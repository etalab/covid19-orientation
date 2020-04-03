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

function App() {
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
  const [age, setAge] = useState(0)
  const [poids, setPoids] = useState(0)
  const [taille, setTaille] = useState(0)
  const [imc, setImc] = useState(0)

  const [conseils, setConseils] = useState(null)

  const handleResponse = useCallback((response, setSymptome) => {
    const {isSymptome, isFacteurGraviteMajeur, isFacteurGraviteMineur} = response

    // Counters
    setSymptomesCount(isFacteurGraviteMajeur)
    setFacteurGraviteMajeurCount(isFacteurGraviteMajeur)
    setFacteurGraviteMineurCount(isFacteurGraviteMineur)

    setSymptome(isSymptome)

    setQuestionIdx(idx => idx + 1)
  }, [setSymptomesCount, setFacteurGraviteMajeurCount, setFacteurGraviteMineurCount])

  const handleAge = useCallback(age => {
    if (age > 14) {
      setQuestionIdx(idx => idx + 1)
    }

    setAge(age)
  }, [setQuestionIdx, setAge])

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

        {!consent && <Consent handleConsent={setConsent} />}

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
