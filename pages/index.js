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

import symptomesQuestions from '../symptomes-questions.json'

import Page from '../layouts/main'

import Age from '../components/profile/age'

import End from '../components/end'

import useCount from '../components/hooks/count'
import Consent from '../components/consent'
import Question from '../components/question'
import {getToken, submitForm, getDuration} from '../lib/api'

function App() {
  // App
  const [token, setToken] = useState(null)
  const [displayForm, setDisplayForm] = useState(false)
  const [end, setEnd] = useState(null)
  const [questionIdx, setQuestionIdx] = useState(0)
  const [consent, setConsent] = useState(false)

  // Counters
  const [symptomesCount, setSymptomesCount] = useCount(0)
  const [facteurGraviteMajeurCount, setFacteurGraviteMajeurCount] = useCount(0)
  const [facteurGraviteMineurCount, setFacteurGraviteMineurCount] = useCount(0)
  const [facteurPronosticCount, setFacteurPronosticCount] = useCount(0)

  // Symptomes
  const [alimentation, setAlimentation] = useState(false)
  const [fievre, setFievre] = useState(false)
  const [toux, setToux] = useState(false)
  const [anosmie, setAnosmie] = useState(false)
  const [malDeGorge, setMalDeGorge] = useState(false)
  const [diarrhee, setDiarrhee] = useState(false)

  // Profile
  const [age, setAge] = useState(null)
  const [poids, setPoids] = useState(null)
  const [taille, setTaille] = useState(null)


  const handleResponse = useCallback((response, setSymptome) => {
    const {isSymptome, isFacteurGraviteMajeur, isFacteurGraviteMineur} = response

    // Counters
    setSymptomesCount(isFacteurGraviteMajeur)
    setFacteurGraviteMajeurCount(isFacteurGraviteMajeur)
    setFacteurGraviteMineurCount(isFacteurGraviteMineur)

    setSymptome(isSymptome)

    setQuestionIdx(idx => idx + 1)
  }, [setSymptomesCount, setFacteurGraviteMajeurCount, setFacteurGraviteMineurCount])

  const handleConsent = useCallback(async () => {
    const token = await getToken()

    setToken(token)
    setConsent(true)
  }, [])

  const handleAge = useCallback(age => {
    if (age > 14) {
      setQuestionIdx(idx => idx + 1)
    }

    setAge(age)
  }, [setQuestionIdx, setAge])

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
        height: taille,
        weight: poids
      },
      risk_factors: {
        breathing_disease: true,
        cancer: true,
        diabetes: true,
        heart_disease: true,
        immunosuppressant_disease: true,
        immunosuppressant_drug: true,
        kidney_disease: true,
        liver_disease: true,
        pregnant: '1'
      },
      symptoms: {
        agueusia_anosmia: anosmie,
        breathlessness: true,
        cough: toux,
        diarrhea: diarrhee,
        feeding_day: true,
        fever: fievre,
        sore_throat_aches: malDeGorge,
        temperature_cat: [35.5, 37.7],
        tiredness: true,
        tiredness_details: true
      }
    })
  }

  // Show/hide end
  useEffect(() => {
    if (age === 14) {
      setEnd(1)
    }

    if (facteurGraviteMajeurCount >= 1) {
      setEnd(5)
    }
  }, [age, facteurGraviteMajeurCount])

  // Show/hide form
  useEffect(() => {
    setDisplayForm(Boolean(consent && end !== 1))
  }, [consent, age, end])

  // Orderered questions
  const questions = [
    {type: 'profile', question: () => <Age handleAge={handleAge} />},
    {type: 'symptome', setter: setAlimentation, symptome: symptomesQuestions.alimentation}
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
          <Question question={questions[questionIdx]} handleResponse={handleResponse} />
        )}

        {questionIdx > 0 && (
          <div className='gouv-button-container'>
            <a className='gouv-button' href='/'><i className='fas fa-arrow-left' aria-hidden='true' /> Retour au début</a>
          </div>
        )}
      </div>
    </Page>
  )
}

export default App
