// Application d'orientation des appels pour la crise COVID-19
// Réalisée avec le concours de l'Agence du Numérique de la Sécurité Civile

// # ÉQUIPE

// Julien Dubedout
// Benoit Frattini
// Nicolas Mathieu
// David Vigier
// Toute l'Agence du Numérique de la Sécurité civile

// # REMERCIEMENTS

// Renaud Chaput
// Missak Kéloglanian
// Soizic Pénicaud

import React, {useState, useCallback, useEffect} from 'react'

import symptomsQuestions from '../symptoms-questions.json'
import patientQuestions from '../patient-questions.json'

import {getToken, submitForm, getDuration} from '../lib/api'
import {anonymize} from '../lib/codes-postaux'

import Page from '../layouts/main'

import Imc from '../components/patient/imc'
import PostalCode from '../components/patient/postal-code'

import End from '../components/end'

import useCount from '../components/hooks/count'
import Consent from '../components/consent'
import Question from '../components/question'
import RiskFactors from '../components/risk-factors'

function App() {
  // App
  const [token, setToken] = useState(null)
  const [displayForm, setDisplayForm] = useState(false)
  const [end, setEnd] = useState(null)
  const [step, setStep] = useState(0)
  const [isFinish, setIsFinish] = useState(false)

  // Counters
  const [symptomsCount, setSymptomsCount] = useCount(0)
  const [majorSeverityFactorsCount, setMajorSeverityFactorsCount] = useCount(0)
  const [minorSeverityFactorsCount, setMinorSeverityFactorsCount] = useCount(0)
  const [pronosticFactorsCount, setPronosticFactorsCount] = useCount(0)

  // Symptoms
  const [feedingDay, setFeedingDay] = useState(false)
  const [breathlessness, setBreathlessness] = useState(false)
  const [fever, setFever] = useState(false)
  const [temperature, setTemperature] = useState(null)
  const [tiredness, setTiredness] = useState(null)
  const [cough, setCough] = useState(false)
  const [agueusiaAnosmia, setAgueusiaAnosmia] = useState(false)
  const [soreThroatAches, setSoreThroatAches] = useState(false)
  const [diarrhea, setDiarrhea] = useState(false)

  // Patient
  const [age, setAge] = useState(null)
  const [weight, setWeight] = useState(null)
  const [height, setHeight] = useState(null)
  const [postalCode, setPostalCode] = useState(null)

  const [riskFactors, setRiskFactors] = useState(null)

  const handleResponse = useCallback((response, setSymptom) => {
    const {isSymptom, isMajorSeverityFactor, isMinorSeverityFactor, isPronosticFactors, value} = response

    // Counters
    setSymptomsCount(isSymptom)
    setPronosticFactorsCount(isPronosticFactors)
    setMajorSeverityFactorsCount(isMajorSeverityFactor)
    setMinorSeverityFactorsCount(isMinorSeverityFactor)

    setSymptom(value || isSymptom)
  }, [setSymptomsCount, setPronosticFactorsCount, setMajorSeverityFactorsCount, setMinorSeverityFactorsCount])

  const handleConsent = useCallback(async () => {
    const token = await getToken()

    setToken(token)
    setConsent(true)
  }, [])

  const handleRiskFactors = riskFactors => {
    // Increase pronosticFactorsCount by 1 for each true risk factor
    Object.keys(riskFactors).map(risk => setPronosticFactorsCount(Boolean(riskFactors[risk])))
    setRiskFactors(riskFactors)
  }

  const submit = () => {
    const duration = getDuration(token)

    submitForm({
      metadata: {
        duration
      },
      patient: {
        age_less_15: Boolean(age < 15),
        age_less_50: Boolean(age < 50),
        age_less_70: Boolean(age < 70),
        age_more_70: Boolean(age > 70),
        postal_code: anonymize(postalCode),
        height,
        weight
      },
      risk_factors: riskFactors,
      symptoms: {
        agueusia_anosmia: agueusiaAnosmia,
        breathlessness,
        cough,
        diarrhea,
        feeding_day: feedingDay,
        fever,
        sore_throat_aches: soreThroatAches,
        temperature_cat: temperature,
        tiredness
      }
    })
  }

  const reset = () => {
    setToken(null)
    setDisplayForm(false)
    setEnd(null)
    setStep(0)
    setIsFinish(false)

    // Counters
    setSymptomsCount(0)
    setPronosticFactorsCount(0)
    setMajorSeverityFactorsCount(0)
    setMinorSeverityFactorsCount(0)

    // Symptoms
    setFeedingDay(false)
    setFever(false)
    setCough(false)
    setAgueusiaAnosmia(false)
    setSoreThroatAches(false)
    setDiarrhea(false)

    // Patient
    setAge(null)
    setWeight(null)
    setHeight(null)
    setPostalCode(null)

    setRiskFactors(null)
  }

  useEffect(() => {
    if (postalCode) {
      setIsFinish(true)
    }
  }, [postalCode])

  // Show/hide Ends
  useEffect(() => {
    if (age === 14) {
      setEnd(1)
    }

    if (majorSeverityFactorsCount >= 1) {
      setEnd(5)
    }
  }, [age, majorSeverityFactorsCount])

  // Show/hide Form
  useEffect(() => {
    setDisplayForm(Boolean(consent && end !== 1))
  }, [consent, age, end])

  // Get step
  useEffect(() => {
    let step = 0

    if (age) {
      setIsFinish(age < 15)
      step = 1
    }

    setStep(step)
  }, [age])

  // Orderered steps
  const steps = [
    {step: 0, question: patientQuestions.age, setSymptom: setAge},
    {step: 1, question: symptomsQuestions.feeding_day, setSymptom: setFeedingDay},
    {step: 2, question: symptomsQuestions.breathlessness, setSymptom: setBreathlessness},
    {step: 3, question: symptomsQuestions.fever, setSymptom: setFever},
    {step: 4, question: symptomsQuestions.temperature, setSymptom: setTemperature},
    {step: 5, question: symptomsQuestions.tiredness, setSymptom: setTiredness},
    {step: 6, question: symptomsQuestions.cough, setSymptom: setCough},
    {step: 7, question: symptomsQuestions.agueusia_anosmia, setSymptom: setAgueusiaAnosmia},
    {step: 8, question: symptomsQuestions.sore_throat_aches, setSymptom: setSoreThroatAches},
    {step: 9, component: () => <Imc handleHeight={setHeight} handleWeight={setWeight} />},
    {step: 10, component: () => <RiskFactors handleRiskFactors={handleRiskFactors} />},
    {step: 11, component: () => <PostalCode handlePostalCode={setPostalCode} />}
  ]

  return (
    <Page>
      <div id='parcours'>
        <article className='step' id='message-attente'>
          <div className='card message start-message'>
            <p className='icon'><i className='fas fa-viruses' /></p>
            <p className='primary-message'>Vous pensez avoir des symptômes du Covid-19 et vous voulez savoir quel numéro appeler ?<br />Répondez à ces quelques questions :
            </p>
          </div>
        </article>

        {!consent && <Consent handleConsent={handleConsent} />}

        {end && <End end={end} isFinish={isFinish} />}

        {displayForm && (
          <Question
            question={steps.find(q => q.step === step)}
            handleResponse={handleResponse}
          />
        )}

        {consent && (
          <div className='gouv-button-container'>
            <a className='gouv-button' onClick={() => reset()}><i className='fas fa-arrow-left' aria-hidden='true' /> Retour au début</a>
          </div>
        )}
      </div>
    </Page>
  )
}

export default App
