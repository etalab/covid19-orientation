import React, {useState} from 'react'
import PropTypes from 'prop-types'

function RiskFactors({handleRiskFactors}) {
  const [breathingDisease, setBreathingDisease] = useState(false)
  const [cancer, setCancer] = useState(false)
  const [diabetes, setDiabetes] = useState(false)
  const [heartDisease, setHeartDisease] = useState(false)
  const [immunosuppressantDisease, setImmunosuppressantDisease] = useState(false)
  const [immunosuppressantDrug, setImmunosuppressantDrug] = useState(false)
  const [kidneyDisease, setKidneyDisease] = useState(false)
  const [liverDisease, setLiverDisease] = useState(false)
  const [pregnant, setPregnant] = useState(false)

  const handleSubmit = event => {
    event.preventDefault()

    handleRiskFactors({
      breathingDisease,
      cancer,
      diabetes,
      heartDisease,
      immunosuppressantDisease,
      immunosuppressantDrug,
      kidneyDisease,
      liverDisease,
      pregnant: pregnant ? '1' : '0'
    })
  }

  return (
    <article className='step' id='risk-factors'>
      <h2><i className='fas fa-user-md' aria-hidden='true' /> <span>Cochez les éléments de cette liste qui correspond à votre situation :</span></h2>
      <div className='card'>
        <form onSubmit={handleSubmit}>
          <div className='complement-infos'>
            <ul>
              <li>
                <i className='fas fa-heartbeat' aria-hidden='true' />
                <label>Avez-vous une hypertension artérielle mal équilibrée ? Ou une maladie cardiaque ou vasculaire ? Ou prenez-vous un traitement à visée cardiologique ?</label>
                <input
                  name='heartDisease'
                  type='checkbox'
                  checked={heartDisease}
                  onChange={() => setHeartDisease(!heartDisease)}
                />
              </li>
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
              <li>
                <i className='fas fa-baby' aria-hidden='true' />
                <label>Êtes-vous enceinte ?</label>
                <input
                  name='pregnant'
                  type='checkbox'
                  checked={pregnant}
                  onChange={() => setPregnant(!pregnant)}
                />
              </li>
              <li>
                <i className='fas fa-procedures' aria-hidden='true' />
                <label>Avez-vous une maladie connue pour diminuer vos défenses immunitaires ?</label>
                <input
                  name='immunosuppressantDisease'
                  type='checkbox'
                  checked={immunosuppressantDisease}
                  onChange={() => setImmunosuppressantDisease(!immunosuppressantDisease)}
                />
              </li>
              <li>
                <i className='fas fa-pills' aria-hidden='true' />
                <label>Prenez-vous un traitement immunosuppresseur ?</label>
                <input
                  name='immunosuppressantDrug'
                  type='checkbox'
                  checked={immunosuppressantDrug}
                  onChange={() => setImmunosuppressantDrug(!immunosuppressantDrug)}
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
