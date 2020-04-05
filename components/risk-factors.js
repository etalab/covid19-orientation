import React, {useState} from 'react'
import PropTypes from 'prop-types'

function RiskFactors({handleRiskFactors}) {
  const [breathingDisease, setBreathingDisease] = useState(false)
  const [cancer, setCancer] = useState(false)
  const [diabetes, setDiabetes] = useState(false)
  const [kidneyDisease, setKidneyDisease] = useState(false)
  const [liverDisease, setLiverDisease] = useState(false)

  const selectionCount = [breathingDisease, cancer, diabetes, kidneyDisease, liverDisease].filter(Boolean).length;

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
      <h2><i className='fas fa-user-md' aria-hidden='true' /><span>Cochez les éléments de cette liste qui correspondent à votre situation :</span></h2>
      <div className='card'>
        <form onSubmit={handleSubmit}>
          <div className='complement-infos'>
            <ul>
              <li>
                <i className='fas fa-heartbeat' aria-hidden='true' />
                <label for='diabetes'>Êtes-vous diabétique ?</label>
                <input
                  id='diabetes'
                  name='diabetes'
                  type='checkbox'
                  checked={diabetes}
                  onChange={() => setDiabetes(!diabetes)}
                />
              </li>
              <li>
                <i className='fas fa-procedures' aria-hidden='true' />
                <label for='cancer'>Avez-vous ou avez-vous eu un cancer dans les 3 dernières années ?</label>
                <input
                  id='cancer'
                  name='cancer'
                  type='checkbox'
                  checked={cancer}
                  onChange={() => setCancer(!cancer)}
                />
              </li>
              <li>
                <i className='fas fa-lungs-virus' aria-hidden='true' />
                <label for='breathingDisease'>Avez-vous une maladie respiratoire ? Ou êtes-vous suivi par un pneumologue ?</label>
                <input
                  id='breathingDisease'
                  name='breathingDisease'
                  type='checkbox'
                  checked={breathingDisease}
                  onChange={() => setBreathingDisease(!breathingDisease)}
                />
              </li>
              <li>
                <i className='fas fa-kidneys' aria-hidden='true' />
                <label for='kidneyDisease'>Avez-vous une insuffisance rénale chronique dialysée ?</label>
                <input
                  id='kidneyDisease'
                  name='kidneyDisease'
                  type='checkbox'
                  checked={kidneyDisease}
                  onChange={() => setKidneyDisease(!kidneyDisease)}
                />
              </li>
              <li>
                <i className='fas fa-procedures' aria-hidden='true' />
                <label for='liverDisease'>Avez-vous une maladie chronique du foie ?</label>
                <input
                  id='liverDisease'
                  name='liverDisease'
                  type='checkbox'
                  checked={liverDisease}
                  onChange={() => setLiverDisease(!liverDisease)}
                />
              </li>
            </ul>
          </div>
          <button className='mainbutton'>
            <span>
              {selectionCount === 0 && `Aucun de ces éléments ne correspond à ma situation`}
              {selectionCount === 1 && `Valider le choix de cet élément`}
              {selectionCount > 1 && `Valider le choix de ces ${selectionCount} éléments`}
            </span>
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
