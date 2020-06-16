import React, {useState} from 'react'
import PropTypes from 'prop-types'

function RiskFactors({handleRiskFactors}) {
  const [breathingDisease, setBreathingDisease] = useState(false)
  const [cancer, setCancer] = useState(false)
  const [diabetes, setDiabetes] = useState(false)
  const [kidneyDisease, setKidneyDisease] = useState(false)
  const [liverDisease, setLiverDisease] = useState(false)
  const [sickleCell, setSickleCell] = useState(false)

  const selectionCount = [breathingDisease, cancer, diabetes, kidneyDisease, liverDisease, sickleCell].filter(Boolean).length;

  const handleSubmit = event => {
    event.preventDefault()

    handleRiskFactors({
      breathing_disease: breathingDisease,
      cancer,
      diabetes,
      kidney_disease: kidneyDisease,
      liver_disease: liverDisease,
      sickle_cell: sickleCell
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
                <label htmlFor='diabetes'>Avez-vous un diabète mal équilibré ou avec des complications (yeux, reins) ?</label>
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
                <label htmlFor='cancer'>Avez-vous un cancer évolutif sous traitement (hors hormonothérapie) ?</label>
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
                <label htmlFor='breathingDisease'>Avez-vous une maladie respiratoire chronique (bronchopneumopathie obstructive, asthme sévère, fibrose pulmonaire, syndrome d’apnées du sommeil, mucoviscidose) ou êtes-vous suivi par un pneumologue ?</label>
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
                <label htmlFor='kidneyDisease'>Avez-vous une insuffisance rénale chronique avec besoin de faire de la dialyse ?</label>
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
                <label htmlFor='liverDisease'>Avez-vous une cirrhose ?</label>
                <input
                  id='liverDisease'
                  name='liverDisease'
                  type='checkbox'
                  checked={liverDisease}
                  onChange={() => setLiverDisease(!liverDisease)}
                />
              </li>
              <li>
                <i className='fas fa-procedures' aria-hidden='true' />
                <label htmlFor='sickleCell'>Avez-vous une drépanocytose homozygote (forme majeure) ou avez-vous bénéficié d’une splénectomie (ablation de la rate) à cause de la drépanocytose ?</label>
                <input
                  id='sickleCell'
                  name='sickleCell'
                  type='checkbox'
                  checked={sickleCell}
                  onChange={() => setSickleCell(!sickleCell)}
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

      <style jsx>{`
        .complement-infos ul li {
            display: grid;
            grid-template-columns: 40px 1fr 30px;
            align-items: center;
        }
        `}</style>
    </article>
  )
}

RiskFactors.propTypes = {
  handleRiskFactors: PropTypes.func.isRequired
}

export default RiskFactors
