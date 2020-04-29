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

import { chooseEnd, computeIMC } from '../utils'

// https://github.com/Delegation-numerique-en-sante/covid19-algorithme-orientation/blob/master/implementation.org#variables-qui-correspondent-%C3%A0-lorientation-affich%C3%A9e
const orientations = [
  'less_15',
  'home_surveillance',
  'consultation_surveillance_1',
  'consultation_surveillance_2',
  'SAMU',
  'consultation_surveillance_3',
  'consultation_surveillance_4',
  'surveillance'
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
  const [isFinish, setIsFinish] = useState(false)

  // Counters
  const [symptomsCount, setSymptomsCount, resetSymptomsCount] = useCount(0)
  const [majorSeverityFactorsCount, setMajorSeverityFactorsCount, resetMajorSeverityFactorsCount] = useCount(0)
  const [minorSeverityFactorsCount, setMinorSeverityFactorsCount, resetMinorSeverityFactorsCount] = useCount(0)
  const [pronosticFactorsCount, setPronosticFactorsCount, resetPronosticFactorsCount] = useCount(0)

  // Symptoms
  const [feedingDay, setFeedingDay] = useState(false)
  const [breathlessness, setBreathlessness] = useState(false)
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

  const getFeverAlgo = temperature => {
    if (temperature === 'inf_35.5' || temperature === 'sup_39' || temperature === 'NSP') {
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
      feverAlgo,
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
          algo_version: '2020-04-29',
          form_version: '2020-04-29'
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
    setIsFinish(false)

    // Counters
    setSymptomsCount(0)
    setMajorSeverityFactorsCount(0)
    setMinorSeverityFactorsCount(0)
    setPronosticFactorsCount(0)

    // Symptoms
    setFeedingDay(false)
    setBreathlessness(false)
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
      cough,
      diarrhea,
      soreThroatAches,
      agueusiaAnosmia,
      pronosticFactorsCount
    })
    setEnd(newEnd)
  }, [cough, agueusiaAnosmia, diarrhea, soreThroatAches, ageRange, minorSeverityFactorsCount, majorSeverityFactorsCount, pronosticFactorsCount])

  // Show/hide Form
  useEffect(() => {
    setDisplayForm(Boolean(consent && end !== 1))
  }, [consent, ageRange, end])

  // Get step
  useEffect(() => {
    let nextStep = step

    if (ageRange && ageRange === 'inf_15') {
      setIsFinish(true)
    }

    // When not tired, skip to cough
    if (step === 5 && tiredness === false) {
      nextStep = 6
    }

    if (height && weight) {
      nextStep = 11
    }

    if (riskFactors) {
      nextStep = 12
    }

    if (riskFactorsRadios) {
      nextStep = 13
    }

    if (postalCode) {
      setIsFinish(true)
      submit()
    }

    setStep(nextStep)
  }, [step, ageRange, height, weight, riskFactors, riskFactorsRadios, postalCode, tiredness])

  useEffect(() => {
    const {iframe} = router.query

    setIsIframe(Boolean(iframe === '1'))
  }, [router])

  // Orderered steps
  const steps = [
    {step: 0, question: respondentQuestions.ageRange, setSymptom: setAgeRange},
    {step: 1, question: symptomsQuestions.feeding_day, setSymptom: setFeedingDay},
    {step: 2, question: symptomsQuestions.breathlessness, setSymptom: setBreathlessness},
    {step: 3, question: symptomsQuestions.temperature, setSymptom: temperature => {
      setTemperature(temperature)
      setFeverAlgo(getFeverAlgo(temperature))
    }},
    {step: 4, question: symptomsQuestions.tiredness, setSymptom: setTiredness},
    {step: 5, question: symptomsQuestions.tiredness_details, setSymptom: setTirednessDetails},
    {step: 6, question: symptomsQuestions.cough, setSymptom: setCough},
    {step: 7, question: symptomsQuestions.agueusia_anosmia, setSymptom: setAgueusiaAnosmia},
    {step: 8, question: symptomsQuestions.sore_throat_aches, setSymptom: setSoreThroatAches},
    {step: 9, question: symptomsQuestions.diarrhea, setSymptom: setDiarrhea},
    {step: 10, component: () => <Imc handleHeight={setHeight} handleWeight={setWeight} />},
    {step: 11, component: () => <RiskFactors handleRiskFactors={handleRiskFactors} />},
    {step: 12, component: () => <RiskFactorsRadios handleRiskFactors={handleRiskFactorsRadios} />},
    {step: 13, component: () => <PostalCode handlePostalCode={setPostalCode} />}
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
