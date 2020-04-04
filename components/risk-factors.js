import React, {useState} from 'react'
import PropTypes from 'prop-types'

function RiskFactors({handleRiskFactors}) {
  const [breathingDisease, setBreathingDisease] = useState(false)
  const [cancer, setCancer] = useState(false)
  const [diabetes, setDiabetes] = useState(false)
  const [kidneyDisease, setKidneyDisease] = useState(false)
  const [liverDisease, setLiverDisease] = useState(false)

  const handleSubmit = event => {
    event.preventDefault()

    handleRiskFactors({
      breathing_desease: breathingDisease,
      cancer,
      diabetes,
      kidney_disease: kidneyDisease,
      liver_disease: liverDisease
    })
  }

  return (
    <article className='step' id='risk-factors'>
      <h2><i className='fas fa-user-md' aria-hidden='true' /><span>Cochez les éléments de cette liste qui correspond à votre situation :</span></h2>
      <div className='card'>
        <form onSubmit={handleSubmit}>
          <div className='complement-infos'>
            <ul>
              <li>
                <i className='fas fa-heartbeat' aria-hidden='true' />
                <label>Êtes-vous diabétique ?</label>
                <input
                  name='diabetes'
                  type='checkbox'
                  checked={diabetes}
                  onChange={() => setDiabetes(!diabetes)}
                />
              </li>
              <li>
                <i className='fas fa-procedures' aria-hidden='true' />
                <label>Avez-vous ou avez-vous eu un cancer dans les 3 dernières années ?</label>
                <input
                  name='cancer'
                  type='checkbox'
                  checked={cancer}
                  onChange={() => setCancer(!cancer)}
                />
              </li>
              <li>
                <i className='fas fa-lungs-virus' aria-hidden='true' />
                <label>Avez-vous une maladie respiratoire ? Ou êtes-vous suivi par un pneumologue ?</label>
                <input
                  name='breathingDisease'
                  type='checkbox'
                  checked={breathingDisease}
                  onChange={() => setBreathingDisease(!breathingDisease)}
                />
              </li>
              <li>
                <i className='fas fa-kidneys' aria-hidden='true' />
                <label>Avez-vous une insuffisance rénale chronique dialysée ?</label>
                <input
                  name='kidneyDisease'
                  type='checkbox'
                  checked={kidneyDisease}
                  onChange={() => setKidneyDisease(!kidneyDisease)}
                />
              </li>
              <li>
                <i className='fas fa-procedures' aria-hidden='true' />
                <label>Avez-vous une maladie chronique du foie ?</label>
                <input
                  name='liverDisease'
                  type='checkbox'
                  checked={liverDisease}
                  onChange={() => setLiverDisease(!liverDisease)}
                />
              </li>
            </ul>
          </div>

          <button className='mainbutton'>
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
