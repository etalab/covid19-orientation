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
import RiskFactorsRadios from '../components/risk-factors-radios'


// compute end based on some parameters
// Replica of arbre_décisions.txt
const chooseEnd = ({
  ageRange,
  minorSeverityFactorsCount,
  majorSeverityFactorsCount,
  fever,
  cough,
  diarrhea,
  soreThroatAches,
  agueusiaAnosmia,
  pronosticFactorsCount,
}) => {
  let end;
  // dont try to compute end when no age defined
  if (!ageRange) {
    return 8;
  }
  if (ageRange === "inf_15") {
      end = 1
    } else if (majorSeverityFactorsCount >= 1) {
      end = 5
    } else if (fever && cough) {
      if (pronosticFactorsCount === 0) {
        end = 6
      }
      if (pronosticFactorsCount >= 1) {
        if (minorSeverityFactorsCount < 2) {
          end = 6
        }
        if (minorSeverityFactorsCount >= 2) {
          end = 4
        }
      }
    } else if (fever || (!fever && (diarrhea || (cough && soreThroatAches) || (cough && agueusiaAnosmia)))) {
      if (pronosticFactorsCount === 0) {
        if (minorSeverityFactorsCount === 0) {
          if (ageRange === "inf_15" || ageRange === "from_15_to_49") {
            end = 2
          } else {
            end = 3
          }
        } else if (minorSeverityFactorsCount >= 1) {
          end = 3
        }
      }
      if (pronosticFactorsCount >= 1) {
        if (minorSeverityFactorsCount < 2) {
          end = 3
        } else if (minorSeverityFactorsCount >= 2) {
          end = 4
        }
      }
    } else if (cough || soreThroatAches || agueusiaAnosmia) {
      if (pronosticFactorsCount === 0) {
        end = 2
      } else if (pronosticFactorsCount >= 1) {
        end = 7
      }
    } else if (!cough && !soreThroatAches && !agueusiaAnosmia) {
      end = 8
    }
  return end;
}

function App() {
  // App
  const [token, setToken] = useState(null)
  const [consent, setConsent] = useState(false)
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
  const [ageRange, setAgeRange] = useState(null)
  const [weight, setWeight] = useState(null)
  const [height, setHeight] = useState(null)
  const [postalCode, setPostalCode] = useState(null)

  const [riskFactors, setRiskFactors] = useState(null)
  const [riskFactorsRadios, setRiskFactorsRadios] = useState(null)

  const handleResponse = useCallback((response, setSymptom) => {
    const {isSymptom, isMajorSeverityFactor, isMinorSeverityFactor, isPronosticFactors, value} = response

    // Counters
    setSymptomsCount(isSymptom)
    setPronosticFactorsCount(isPronosticFactors)
    setMajorSeverityFactorsCount(isMajorSeverityFactor)
    setMinorSeverityFactorsCount(isMinorSeverityFactor)

    setSymptom(value || isSymptom)

    setStep(step => step + 1)
  }, [setSymptomsCount, setPronosticFactorsCount, setMajorSeverityFactorsCount, setMinorSeverityFactorsCount])

  const handleConsent = useCallback(async () => {
    const token = await getToken()

    setToken(token)
    setConsent(true)
  }, [])

  // boolean risks : count of truthy riskFactors
  const getPronosticFactorsCount = riskFactors => Object.keys(riskFactors).filter(risk => Boolean(riskFactors[risk])).length

  // radio risks : count of truthy *algo or pregnant=1
  const getPronosticFactorsCountRadios = riskFactorsRadios => {
    // Increase pronosticFactorsCount by 1 for each true risk factor
    let count = 0;
    if (!riskFactorsRadios) {
      return 0
    }
    if (riskFactorsRadios.heart_disease_algo) count++
    if (riskFactorsRadios.immunosuppressant_disease_algo) count++
    if (riskFactorsRadios.immunosuppressant_drug_algo) count++
    if (riskFactorsRadios.pregnant === 1) count++
    return count
  }

  const handleRiskFactors = riskFactors => {
    // Increase pronosticFactorsCount by 1 for each true risk factor
    setPronosticFactorsCount(getPronosticFactorsCount(riskFactors) + getPronosticFactorsCountRadios(riskFactorsRadios))
    setRiskFactors(riskFactors)
  }

  const handleRiskFactorsRadios = riskFactorsRadios => {
    // Increase pronosticFactorsCount by 1 for each true risk factor
    setPronosticFactorsCount(getPronosticFactorsCount(riskFactors) + getPronosticFactorsCountRadios(riskFactorsRadios))
    setRiskFactorsRadios(riskFactorsRadios)
  }

  const submit = () => {
    const duration = getDuration(token)

    submitForm({
      metadata: {
        duration
      },
      patient: {
        age_range: ageRange,
        postal_code: anonymize(postalCode),
        height,
        weight
      },
      risk_factors: {
        ...riskFactors,
        ...riskFactorsRadios
      },
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
    // App
    setEnd(null)
    setStep(0)
    setIsFinish(false)

    // Counters
    setSymptomsCount(0)
    setMajorSeverityFactorsCount(0)
    setMinorSeverityFactorsCount(0)
    setPronosticFactorsCount(0)

    // Symptoms
    setFeedingDay(false)
    setBreathlessness(false)
    setFever(false)
    setTemperature(null)
    setTiredness(null)
    setCough(false)
    setAgueusiaAnosmia(false)
    setSoreThroatAches(false)
    setDiarrhea(false)

    // Patient
    setAgeRange(null)
    setWeight(null)
    setHeight(null)
    setPostalCode(null)

    setRiskFactors(null)
    setRiskFactorsRadios(null)
  }

  // Get end
  useEffect(() => {
    // Replica of arbre_décisions.txt
    const newEnd = chooseEnd({
      ageRange,
      minorSeverityFactorsCount,
      majorSeverityFactorsCount,
      fever,
      cough,
      diarrhea,
      soreThroatAches,
      agueusiaAnosmia,
      pronosticFactorsCount,
    })
    setEnd(newEnd)
  }, [cough, fever, agueusiaAnosmia, diarrhea, soreThroatAches, ageRange, minorSeverityFactorsCount, majorSeverityFactorsCount, pronosticFactorsCount])

  // Show/hide Form
  useEffect(() => {
    setDisplayForm(Boolean(consent && end !== 1))
  }, [consent, ageRange, end])

  // Get step
  useEffect(() => {
    let nextStep = step

    if (ageRange && ageRange === "inf_15") {
      setIsFinish(true);
    }

    if (fever && fever === 'inconnue') {
      setFever(true)
      nextStep = 5
    }

    if (height && weight) {
      nextStep = 10
    }

    if (riskFactors) {
      nextStep = 11
    }

    if (riskFactorsRadios) {
      nextStep = 12
    }

    if (postalCode) {
      setIsFinish(true);
      submit();
    }

    setStep(nextStep)
  }, [step, ageRange, fever, height, weight, riskFactors, riskFactorsRadios, postalCode])

  // Orderered steps
  const steps = [
    {step: 0, question: patientQuestions.ageRange, setSymptom: setAgeRange},
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
    {step: 11, component: () => <RiskFactorsRadios handleRiskFactors={handleRiskFactorsRadios} />},
    {step: 12, component: () => <PostalCode handlePostalCode={setPostalCode} />}
  ]

  return (
    <Page>
      <div id='parcours'>
        <article className='step' id='message-attente'>
          <div className='card message start-message'>
            <p className='icon'><i className='fas fa-viruses' /></p>
            <p className='primary-message'>Vous pensez avoir des symptômes du Covid-19 et vous voulez savoir quoi faire ?<br />Répondez à ces quelques questions :
            </p>
          </div>
        </article>

        {!consent && <Consent handleConsent={handleConsent} />}

        {end && <End end={end} isFinish={isFinish} />}

        {displayForm && !isFinish && (
          <Question
            question={steps.find(q => q.step === step)}
            handleResponse={handleResponse}
          />
        )}

        {(step > 0 || isFinish) && (
          <div className='gouv-button-container'>
            <a className='gouv-button' onClick={() => reset()}><i className='fas fa-arrow-left' aria-hidden='true' /> Retour au début</a>
          </div>
        )}
      </div>
    </Page>
  )
}

export default App
