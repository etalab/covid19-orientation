import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'

function RadioChoices({icon, choices, name, value, onChange, children}) {
  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          paddingBottom: 0,
          marginBottom: 0
        }}
      >
        <div style={{flex: '0 1 40px'}}>
          <i className={`fas ${icon}`} aria-hidden='true' />
        </div>
        <div
          style={{
            flex: '1 1 auto',
            paddingBottom: 0,
            marginBottom: 0
          }}
        >
          <label>{children}</label>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row'
        }}
      >
        <div style={{flex: '0 1 60px'}} />
        {choices.map(choice => (
          <label key={choice.title} style={{margin: 0, padding: 0}}>
            <input
              name={name}
              type='radio'
              value={choice.value}
              checked={value === choice.value}
              onChange={() => onChange(choice.value)}
            />{' '}
            {choice.title}
          </label>
        ))}
      </div>
    </>
  )
}

function MandatoryFieldsMessage() {
  return (
    <div className='message'>
      <div className='primary-message'>Tous les champs sont obligatoires</div>
      <style jsx>{`
          .primary-message {
            margin: 0.5em 0;
            text-align: center;
            color: var(--alert-dark);
          }
        `}</style>
    </div>
  )
}

// https://github.com/Delegation-numerique-en-sante/covid19-algorithme-orientation/blob/master/implementation.org#variables-%C3%A0-obligatoirement-sauvegarder-pour-partage
const deriveAlgoValue = (key, value) => {
  if (key === 'heartDisease' && value !== 0) {
    return true
  }

  if (key === 'immunosuppressantDisease' && value === 1) {
    return true
  }

  return false
}

function checkIfFormIsValid (
  part,
  heartDisease,
  pregnant,
  immunosuppressantDisease
) {
  if (part === 0) return (
    heartDisease !== false &&
    pregnant !== false
  )
  if (part === 1) return (
    immunosuppressantDisease !== false
  )
  return false;
}

function RiskFactors({handleRiskFactors}) {
  const [heartDisease, setHeartDisease] = useState(false)
  const [immunosuppressantDisease, setImmunosuppressantDisease] = useState(false)
  const [heartDiseaseAlgo, setHeartDiseaseAlgo] = useState(false)
  const [immunosuppressantDiseaseAlgo, setImmunosuppressantDiseaseAlgo] = useState(false)
  const [pregnant, setPregnant] = useState(false)
  const [isValid, setIsValid] = useState(false)
  const [hasBeenSubmitted, setHasBeenSubmitted] = useState(false)

  const [part, setPart] = useState(0)

  useEffect(() => {
    const validValue = checkIfFormIsValid (
      part,
      heartDisease,
      pregnant,
      immunosuppressantDisease
    )
    setIsValid(validValue)
  });

  const handleSubmit = event => {
    event.preventDefault()
    setHasBeenSubmitted(true)
    if (isValid && part === 0) {
      // avance dans le form, reset des variables de validation/submit
      setHasBeenSubmitted(false)
      setIsValid(false)
      setPart(1)
    } else if (isValid && part === 1){
      // soumet les reponses des `form part 0` et `form part 1`
      handleRiskFactors({
        heart_disease: heartDisease,
        immunosuppressant_disease: immunosuppressantDisease,
        heart_disease_algo: heartDiseaseAlgo,
        immunosuppressant_disease_algo: immunosuppressantDiseaseAlgo,
        pregnant
      })
    }
  }

  return (
    <article className='step' id='risk-factors'>
      <h2><i className='fas fa-user-md' aria-hidden='true' /><span>Cochez les éléments de cette liste qui correspond à votre situation :</span></h2>
      <div className='card'>
        <form onSubmit={handleSubmit}>
          <div className='complement-infos'>
            <ul>
              {part === 0 ? (
                <>
                  <li style={{display: 'block'}}>
                    <RadioChoices
                      icon='fa-baby'
                      name='pregnant'
                      value={pregnant}
                      onChange={value => setPregnant(value)}
                      choices={[
                        {
                          title: 'Oui',
                          value: 1
                        },
                        {title: 'Non', value: 0},
                        {title: 'Non applicable', value: 888}
                      ]}
                    >
                      Êtes-vous enceinte au 3ème trimestre de votre grossesse ?
                    </RadioChoices>
                  </li>
                  <li
                    style={{
                      display: 'block'
                    }}
                  >
                    <RadioChoices
                      icon='fa-heartbeat'
                      name='heartDisease'
                      value={heartDisease}
                      onChange={value => {
                        setHeartDisease(value)
                        setHeartDiseaseAlgo(deriveAlgoValue('heartDisease', value))
                      }}
                      choices={[
                        {
                          title: 'Oui',
                          value: 1
                        },
                        {title: 'Non', value: 0},
                        {title: 'Je ne sais pas', value: 999}
                      ]}
                    >
			Avez-vous des antécédents de maladie cardiovasculaire :
			hypertension artérielle compliquée (avec complications cardiaques, rénales), 
			accident vasculaire cérébral, maladie coronaire (infarctus), chirurgie cardiaque, 
			insuffisance cardiaque avec essoufflement au moindre effort ?
                    </RadioChoices>
                  </li>
                </>
              ) : (
                <>
                  <li style={{display: 'block'}}>
                    <RadioChoices
                      icon='fa-procedures'
                      name='immunosuppressantDisease'
                      value={immunosuppressantDisease}
                      onChange={value => {
                        setImmunosuppressantDisease(value)
                        setImmunosuppressantDiseaseAlgo(deriveAlgoValue('immunosuppressantDisease', value))
                      }}
                      choices={[
                        {
                          title: 'Oui',
                          value: 1
                        },
                        {title: 'Non', value: 0},
                        {title: 'Je ne sais pas', value: 999}
                      ]}
                    >
			Avez-vous une immunodépression, par exemple : médicamenteuse (chimiothérapie
			anti cancéreuse, traitement immunosuppresseur, biothérapie et/ou corticothérapie
			à dose immunosuppressive depuis plus de 15 jours) ; infection à VIH non contrôlée
			ou avec des CD4 &lt;200/mm3 ; consécutive à une greffe d'organe solide ou de cellules
			souches hématopoïétiques ; liée à une hémopathie maligne en cours de traitement ?
                    </RadioChoices>
                  </li>
                </>
              )}
            </ul>
          </div>
          {hasBeenSubmitted && !isValid && <MandatoryFieldsMessage /> }
          <button className={`mainbutton ${isValid ? '' : 'required'}`} type='submit'>
            <span>Valider ces informations et continuer</span>
            <i className='fas fa-check' aria-hidden='true' />
          </button>
        </form>
      </div>
    </article>
  )
}

RiskFactors.propTypes = {
  handleRiskFactors: PropTypes.func.isRequired
}

export default RiskFactors
