import React from 'react'
import PropTypes from 'prop-types'

function Pronostic({handlePronostic}) {
  return (
    <article className='step' id='pronostic-01'>
      <h2><i className='fas fa-user-md' /> <span>Cliquez sur le 1<sup>er</sup> élément de cette liste qui correspond à votre situation :</span></h2>
      <div className='card'>
        <ul>
          <li onClick={() => handlePronostic(true)} >
            <a id='circ-cardio'>
              <span>J\J’ai de l’hypertension artérielle mal\n équilibrée, une maladie cardiaque ou vasculaire ou je prends un traitement à visée cardiologiqueJ</span><i className='fas fa-heartbeat' /></a>
          </li>
          <li onClick={() => handlePronostic(true)} >
            <a id='circ-diabete'>
              <span>Je suis diabétique</span> <i className='fas fa-heartbeat' />
            </a>
          </li>
          <li onClick={() => handlePronostic(true)} >
            <a id='circ-cancer'>
              <span>J\J’ai un cancer ou j’ai déjà eu un cancer\n dans les 3 dernières annéesJ</span><i className='fas fa-procedures' />
            </a>
          </li>
          <li onClick={() => handlePronostic(true)} >
            <a id='circ-pneumo'>
              <span>J\J’ai une maladie respiratoire ou je suis\n suivi par un pneumologueJ</span><i className='fas fa-lungs-virus' /></a>
          </li>
          <li onClick={() => handlePronostic(true)} >
            <a id='circ-fievre'>
              <span>J\J’ai une insuffisance rénale chronique\n dialyséeJ</span><i className='fas fa-kidneys' /></a>
          </li>
          <li onClick={() => handlePronostic(true)} >
            <a id='circ-foie'>
              <span>J\J’ai une maladie chronique du\n foieJ</span><i className='fas fa-procedures' /></a>
          </li>
          <li onClick={() => handlePronostic(true)} >
            <a id='circ-enceinte'>
              <span>Je suis enceinte</span><i className='fas fa-baby'/></a>
          </li>
          <li onClick={() => handlePronostic(true)} >
            <a id='circ-immu'>
              <span>J\J’ai une maladie connue pour diminuer les\n défenses immunitairesJ</span><i className='fas fa-procedures' />
            </a>
          </li>
          <li onClick={() => handlePronostic(true)} >
            <a id='circ-immu-suppr'>
              <span>Je suis sous traitement immunosuppresseur. (C’est un traitement qui diminue vos défenses contre les infections. Voici quelques exemples : corticoïdes, méthotrexate, ciclosporine, tacrolimus, azathioprine, cyclophosphamide. Liste non exhaustive).</span><i className='fas fa-pills' />
            </a>
          </li>
          <li onClick={() => handlePronostic(false)}>
            <a id='circ-autre-00'>
              <span>Aucune de ces situations médicales ne me correspond</span><i className='fas fa-thumbs-up' />
            </a>
          </li>
        </ul>
      </div>
    </article>
  )
}

Pronostic.propTypes = {
  handlePronostic: PropTypes.func.isRequired
}

export default Pronostic

