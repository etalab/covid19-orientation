// Copyright (c) 2020 ANSC, DINUM
// SPDX-License-Identifier: MIT
// License-Filename: LICENSE

import React, {useState, useCallback, useEffect} from 'react'
import {useRouter} from 'next/router'

import symptomsQuestions from '../symptoms-questions.json'
import respondentQuestions from '../respondent-questions.json'
import ends from '../fins.json'

import {getToken, submitForm} from '../lib/api'
import {anonymize} from '../lib/codes-postaux'

import Page from '../layouts/main'

import Imc from '../components/respondent/imc'
import PostalCode from '../components/respondent/postal-code'

import End from '../components/end'

import useCount from '../components/hooks/count'
import Consent from '../components/consent'
import Question from '../components/question'
import RiskFactors from '../components/risk-factors'
import RiskFactorsRadios from '../components/risk-factors-radios'
import StartMessage from '../components/start-message'

// Compute end based on some parameters
// https://github.com/Delegation-numerique-en-sante/covid19-algorithme-orientation/blob/master/pseudo-code.org
const chooseEnd = ({
  ageRange,
  minorSeverityFactorsCount,
  majorSeverityFactorsCount,
  fever,
  cough,
  diarrhea,
  soreThroatAches,
  agueusiaAnosmia,
  pronosticFactorsCount
}) => {
  let end = 8
  // Dont try to compute end when no age defined
  if (!ageRange) {
    return 8
  }

  if (ageRange === 'inf_15') {
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
        if (ageRange === 'inf_15' || ageRange === 'from_15_to_49') {
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

  return end
}

// Rounded IMC at 1 decimal
const computeIMC = (weight, height) => (Math.round(parseInt(weight, 10) / ((parseInt(height, 10) / 100) ** 2) * 10) / 10)

// https://github.com/Delegation-numerique-en-sante/covid19-algorithme-orientation/blob/master/implementation.org#variables-qui-correspondent-%C3%A0-lorientation-affich%C3%A9e
const orientations = [
  'orientation_moins_de_15_ans',
  'orientation_domicile_surveillance_1',
  'orientation_consultation_surveillance_1',
  'orientation_consultation_surveillance_2',
  'orientation_SAMU',
  'orientation_consultation_surveillance_3',
  'orientation_consultation_surveillance_4',
  'orientation_surveillance'
]

function App() {
  const router = useRouter()

  // App
  const [isIframe, setIsIframe] = useState(false)
  const [token, setToken] = useState(null)
  const [consent, setConsent] = useState(false)
  const [displayForm, setDisplayForm] = useState(false)
  const [end, setEnd] = useState(null)
  const [step, setStep] = useState(0)
  const [showUrgentMessage, setShowUrgenteMessage] = useState(false)
  const [isFinish, setIsFinish] = useState(false)

  // Counters
  const [symptomsCount, setSymptomsCount, resetSymptomsCount] = useCount(0)
  const [majorSeverityFactorsCount, setMajorSeverityFactorsCount, resetMajorSeverityFactorsCount] = useCount(0)
  const [minorSeverityFactorsCount, setMinorSeverityFactorsCount, resetMinorSeverityFactorsCount] = useCount(0)
  const [pronosticFactorsCount, setPronosticFactorsCount, resetPronosticFactorsCount] = useCount(0)

  // Symptoms
  const [feedingDay, setFeedingDay] = useState(false)
  const [breathlessness, setBreathlessness] = useState(false)
  const [fever, setFever] = useState(false)
  const [feverAlgo, setFeverAlgo] = useState(false)
  const [temperature, setTemperature] = useState(null)
  const [tiredness, setTiredness] = useState(null)
  const [tirednessDetails, setTirednessDetails] = useState(null)
  const [cough, setCough] = useState(false)
  const [agueusiaAnosmia, setAgueusiaAnosmia] = useState(false)
  const [soreThroatAches, setSoreThroatAches] = useState(false)
  const [diarrhea, setDiarrhea] = useState(false)

  // Respondent
  const [ageRange, setAgeRange] = useState(null)
  const [weight, setWeight] = useState(null)
  const [height, setHeight] = useState(null)
  const [postalCode, setPostalCode] = useState(null)

  const [riskFactors, setRiskFactors] = useState(null)
  const [riskFactorsRadios, setRiskFactorsRadios] = useState(null)

  const getFeverAlgo = (fever, temperature) => {
    if (fever === 999) {
      return true
    }

    if (fever === 1 && (temperature === 'inf_35.5' || temperature === 'sup_39' || temperature === 'NSP')) {
      return true
    }

    return false
  }

  const handleResponse = useCallback((response, setSymptom) => {
    const {isSymptom, isMajorSeverityFactor, isMinorSeverityFactor, isPronosticFactors, value} = response

    // Counters
    setSymptomsCount(isSymptom)
    setPronosticFactorsCount(isPronosticFactors)
    setMajorSeverityFactorsCount(isMajorSeverityFactor)
    setMinorSeverityFactorsCount(isMinorSeverityFactor)

    // The value can be false
    setSymptom(value !== undefined ? value : isSymptom)

    setStep(step => step + 1)
  }, [setSymptomsCount, setPronosticFactorsCount, setMajorSeverityFactorsCount, setMinorSeverityFactorsCount])

  const handleConsent = useCallback(async () => {
    setConsent(true)

    const token = await getToken()
    setToken(token)
  }, [])

  // Boolean risks : count of truthy riskFactors
  const getPronosticFactorsCount = riskFactors => Object.keys(riskFactors).filter(risk => Boolean(riskFactors[risk])).length

  // Radio risks : count of truthy *algo or pregnant=1
  const getPronosticFactorsCountRadios = riskFactorsRadios => {
    // Increase pronosticFactorsCount by 1 for each true risk factor
    let count = 0
    if (!riskFactorsRadios) {
      return 0
    }

    if (riskFactorsRadios.heart_disease_algo) {
      count++
    }

    if (riskFactorsRadios.immunosuppressant_disease_algo) {
      count++
    }

    if (riskFactorsRadios.immunosuppressant_drug_algo) {
      count++
    }

    if (riskFactorsRadios.pregnant === 1) {
      count++
    }

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
    const imc = computeIMC(weight, height)

    const newEnd = chooseEnd({
      ageRange,
      minorSeverityFactorsCount,
      majorSeverityFactorsCount,
      fever,
      cough,
      diarrhea,
      soreThroatAches,
      agueusiaAnosmia,
      pronosticFactorsCount
    })

    const {
      heart_disease_algo,
      immunosuppressant_disease_algo,
      immunosuppressant_drug_algo,
      ...riskFactorsRadiosValues
    } = riskFactorsRadios

    submitForm(token, {
      questionnaire: {
        metadata: {
          orientation: orientations[newEnd - 1],
          algo_version: '2020-04-06',
          form_version: '2020-04-06'
        },
        respondent: {
          age_range: ageRange,
          imc,
          postal_code: anonymize(postalCode)
        },
        risk_factors: {
          ...riskFactors,
          ...riskFactorsRadiosValues
        },
        // Set false if undefined
        symptoms: {
          agueusia_anosmia: agueusiaAnosmia || false,
          breathlessness: breathlessness || false,
          cough: cough || false,
          diarrhea: diarrhea || false,
          feeding_day: feedingDay || false,
          fever,
          sore_throat_aches: soreThroatAches || false,
          temperature_cat: temperature || 'NSP',
          tiredness: tiredness || false,
          tiredness_details: tirednessDetails || false
        },
        calculations: {
          heart_disease_algo,
          immunosuppressant_disease_algo,
          immunosuppressant_drug_algo,
          fever_algo: feverAlgo
        }
      }
    })
  }

  const reset = async () => {
    resetSymptomsCount()
    resetMajorSeverityFactorsCount()
    resetMinorSeverityFactorsCount()
    resetPronosticFactorsCount()

    // App
    setEnd(null)
    setStep(0)
    setShowUrgenteMessage(false)
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
    setFeverAlgo(false)
    setTemperature(null)
    setTiredness(null)
    setTirednessDetails(null)
    setCough(false)
    setAgueusiaAnosmia(false)
    setSoreThroatAches(false)
    setDiarrhea(false)

    // Respondent
    setAgeRange(null)
    setWeight(null)
    setHeight(null)
    setPostalCode(null)

    setRiskFactors(null)
    setRiskFactorsRadios(null)
    
    // get a new token
    const token = await getToken()
    setToken(token)
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
      pronosticFactorsCount
    })
    setEnd(newEnd)
  }, [cough, fever, agueusiaAnosmia, diarrhea, soreThroatAches, ageRange, minorSeverityFactorsCount, majorSeverityFactorsCount, pronosticFactorsCount])

  // Check if end is a emergency
  useEffect(() => {
    if (end) {
      const {urgent} = ends[end]
      if (urgent) {
        setShowUrgenteMessage(true)
      }
    }
  }, [end])

  // Show/hide Form
  useEffect(() => {
    setDisplayForm(Boolean(consent && end !== 1 && !showUrgentMessage))
  }, [consent, ageRange, end, showUrgentMessage])

  // Get step
  useEffect(() => {
    let nextStep = step

    if (ageRange && ageRange === 'inf_15') {
      setIsFinish(true)
    }

    // When no fever, skip temperature
    if (fever !== 1 && step === 4) {
      nextStep = 5
    }

    // When not tired, skip to cough
    if (step === 6 && tiredness === false) {
      nextStep = 7
    }

    if (height && weight) {
      nextStep = 12
    }

    if (riskFactors) {
      nextStep = 13
    }

    if (riskFactorsRadios) {
      nextStep = 14
    }

    if (postalCode) {
      setIsFinish(true)
      submit()
    }

    setStep(nextStep)
  }, [step, ageRange, fever, height, weight, riskFactors, riskFactorsRadios, postalCode, tiredness])

  useEffect(() => {
    const {iframe} = router.query

    setIsIframe(Boolean(iframe === '1'))
  }, [router])

  // Orderered steps
  const steps = [
    {step: 0, question: respondentQuestions.ageRange, setSymptom: setAgeRange},
    {step: 1, question: symptomsQuestions.feeding_day, setSymptom: setFeedingDay},
    {step: 2, question: symptomsQuestions.breathlessness, setSymptom: setBreathlessness},
    {step: 3, question: symptomsQuestions.fever, setSymptom: fever => {
      setFever(fever);
      setFeverAlgo(getFeverAlgo(fever, temperature))
    }},
    {step: 4, question: symptomsQuestions.temperature, setSymptom: temperature => {
      setTemperature(temperature)
      setFeverAlgo(getFeverAlgo(fever, temperature))
    }},
    {step: 5, question: symptomsQuestions.tiredness, setSymptom: setTiredness},
    {step: 6, question: symptomsQuestions.tiredness_details, setSymptom: setTirednessDetails},
    {step: 7, question: symptomsQuestions.cough, setSymptom: setCough},
    {step: 8, question: symptomsQuestions.agueusia_anosmia, setSymptom: setAgueusiaAnosmia},
    {step: 9, question: symptomsQuestions.sore_throat_aches, setSymptom: setSoreThroatAches},
    {step: 10, question: symptomsQuestions.diarrhea, setSymptom: setDiarrhea},
    {step: 11, component: () => <Imc handleHeight={setHeight} handleWeight={setWeight} />},
    {step: 12, component: () => <RiskFactors handleRiskFactors={handleRiskFactors} />},
    {step: 13, component: () => <RiskFactorsRadios handleRiskFactors={handleRiskFactorsRadios} />},
    {step: 14, component: () => <PostalCode handlePostalCode={setPostalCode} />}
  ]

  return (
    <Page iframe={isIframe}>
      <div id='parcours'>
        {!consent && (
          <>
            <StartMessage />
            <Consent handleConsent={handleConsent} />
          </>
        )}

        {end && (
          <End
            end={end}
            isFinish={isFinish}
            showUrgentMessage={showUrgentMessage}
            hideUrgentMessage={() => setShowUrgenteMessage(false)}
          />
        )}

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
