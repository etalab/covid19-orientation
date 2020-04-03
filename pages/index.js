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

import {getToken, submitForm, getDuration} from '../lib/api'

import Page from '../layouts/main'

import Age from '../components/patient/age'
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
  const [consent, setConsent] = useState(false)

  // Counters
  const [symptomsCount, setSymptomsCount] = useCount(0)
  const [majorSeverityFactorsCount, setMajorSeverityFactorsCount] = useCount(0)
  const [minorSeverityFactorsCount, setMinorSeverityFactorsCount] = useCount(0)
  const [pronosticFactors, setPronosticFactors] = useCount(0)

  // Symptoms
  const [feedingDay, setFeedingDay] = useState(false)
  const [fever, setFever] = useState(false)
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
    const {isSymptom, isMajorSeverityFactor, isMinorSeverityFactor} = response

    // Counters
    setSymptomsCount(isMajorSeverityFactor)
    setMajorSeverityFactorsCount(isMajorSeverityFactor)
    setMinorSeverityFactorsCount(isMinorSeverityFactor)

    setSymptom(isSymptom)

    setStep(step => step + 1)
  }, [setSymptomsCount, setMajorSeverityFactorsCount, setMinorSeverityFactorsCount])

  const handleConsent = useCallback(async () => {
    const token = await getToken()

    setToken(token)
    setConsent(true)
  }, [])

  const handleAge = useCallback(age => {
    if (age > 14) {
      setStep(1)
    }

    setAge(age)
  }, [setStep, setAge])

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
        postal_code: '75000',
        height,
        weight
      },
      risk_factors: riskFactors,
      symptoms: {
        agueusia_anosmia: agueusiaAnosmia,
        breathlessness: true,
        cough,
        diarrhea,
        feeding_day: feedingDay,
        fever,
        sore_throat_aches: soreThroatAches,
        temperature_cat: [35.5, 37.7],
        tiredness: true,
        tiredness_details: true
      }
    })
  }

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

  // Orderered questions
  const questions = [
    {step: 0, type: 'patient', question: () => <Age handleAge={handleAge} />},
    {step: 1, type: 'symptom', setter: setFeedingDay, symptom: symptomsQuestions.alimentation},
    {step: 13, type: 'patient', question: () => <RiskFactors handleRiskFactors={setRiskFactors} />},
    {step: 22, type: 'patient', question: () => <PostalCode handlePostalCode={setPostalCode} />}
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

        {end && <End end={end} />}

        {displayForm && (
          <Question question={questions.find(q => q.step === step)} handleResponse={handleResponse} />
        )}

        {consent && (
          <div className='gouv-button-container'>
            <a className='gouv-button' href='/'><i className='fas fa-arrow-left' aria-hidden='true' /> Retour au début</a>
          </div>
        )}
      </div>
    </Page>
  )
}

export default App
