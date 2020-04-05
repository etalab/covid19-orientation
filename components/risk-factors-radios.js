import React, {useState} from 'react'
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

const MandatoryFieldsMessage = () => {
  return (
    <div className="card message" style={{ backgroundColor: 'var(--warning-bg)' }}>
      <div className="primary-message">Tous les champs sont obligatoires</div>
    </div>
  )
}

// https://github.com/Delegation-numerique-en-sante/covid19-algorithme-orientation/blob/master/implementation.org#variables-%C3%A0-obligatoirement-sauvegarder-pour-partage
const deriveAlgoValue = (key, value) => {
  if (key==='heartDisease' && value !== 0) return true;
  if (key==='immunosuppressantDisease' && value === 1) return true;
  if (key==='immunosuppressantDrug' && value === 1) return true;
  return false;
}

function RiskFactors({handleRiskFactors}) {
  const [heartDisease, setHeartDisease] = useState(false)
  const [immunosuppressantDisease, setImmunosuppressantDisease] = useState(false)
  const [immunosuppressantDrug, setImmunosuppressantDrug] = useState(false)
  const [heartDiseaseAlgo, setHeartDiseaseAlgo] = useState(false)
  const [immunosuppressantDiseaseAlgo, setImmunosuppressantDiseaseAlgo] = useState(false)
  const [immunosuppressantDrugAlgo, setImmunosuppressantDrugAlgo] = useState(false)
  const [pregnant, setPregnant] = useState(false)
  const [isValid, setIsValid] = useState(null);

  const handleSubmit = event => {
    event.preventDefault()
    const isValid = (heartDisease !== false && immunosuppressantDisease !== false && immunosuppressantDrug !== false && pregnant !== false)
    if (isValid) {
      setIsValid(true)
      handleRiskFactors({
        heart_disease: heartDisease,
        immunosuppressant_disease: immunosuppressantDisease,
        immunosuppressant_drug: immunosuppressantDrug,
        heart_disease_algo: heartDiseaseAlgo,
        immunosuppressant_disease_algo: immunosuppressantDiseaseAlgo,
        immunosuppressant_drug_algo: immunosuppressantDrugAlgo,
        pregnant
      })
    } else {
      setIsValid(false)
    }
  }

  return (
    <article className='step' id='risk-factors'>
      <h2><i className='fas fa-user-md' aria-hidden='true' /><span>Cochez les éléments de cette liste qui correspond à votre situation :</span></h2>
      <div className='card'>
        <form onSubmit={handleSubmit}>
          <div className='complement-infos'>
            <ul>
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
                  Êtes-vous enceinte ?
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
                  Avez-vous une hypertension artérielle mal équilibrée ?
                  <br />
                  Ou une maladie cardiaque ou vasculaire ?
                  <br />
                  Ou prenez-vous un traitement à visée cardiologique ?
                </RadioChoices>
              </li>
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
                  Avez-vous une maladie connue pour diminuer vos défenses
                  immunitaires ?
                </RadioChoices>
              </li>
              <li style={{display: 'block'}}>
                <RadioChoices
                  icon='fa-procedures'
                  name='immunosuppressantDrug'
                  value={immunosuppressantDrug}
                  onChange={value => {
                    setImmunosuppressantDrug(value)
                    setImmunosuppressantDrugAlgo(deriveAlgoValue('immunosuppressantDrug', value))
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
                  Prenez-vous un traitement immunosuppresseur ?
                </RadioChoices>
              </li>
            </ul>
          </div>
          { isValid===false && <MandatoryFieldsMessage/> }
          <button className='mainbutton' >
            <span>Valider ces informations et continuer</span><i className='fas fa-check' aria-hidden='true' />
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
