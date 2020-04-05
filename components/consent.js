import React from 'react'
import PropTypes from 'prop-types'

function Consent({handleConsent}) {
  return (
    <article>
      <p>Le questionnaire que vous vous apprêtez à remplir n’a pas de valeur d’avis médical. Il sert uniquement à vous orienter en fonction de votre état de santé et des symptômes que vous indiquez.</p>
      <p>Vos réponses ne serviront qu’à des fins de recherche pour mieux comprendre l’épidémie de COVID 19.</p>
      <p>Aucune information permettant de vous identifier, directement ou indirectement, ne vous sera demandée.</p>
      <br/>
      <p>L’algorithme d’orientation COVID 19 est mis en œuvre conformément à la <a target="new" target="_top" title="Accéder à la documentation dans un nouvel onglet" href="https://delegation-numerique-en-sante.github.io/covid19-algorithme-orientation/index.html">documentation officielle</a> publiée par le ministère des Solidarités et de la Santé.</p>
      <p>Afin de rendre impossible toute réidentification des personnes concernées, les codes postaux ne sont retenus que s’ils correspondent à des communes de plus de 10 000 habitants. Pour les communes de moins de 10 000 habitants, un processus d’agrégation est mis en œuvre et seules les données agrégées sont conservées. Dans ce même but, seules les tranches d’âge sont conservées et non l’âge exact.</p>
      <button className='mainbutton' type='submit' onClick={() => handleConsent(true)}>
        <span>J’ai compris</span> <i className='fas fa-check' aria-hidden='true' />
      </button>
    </article>
  )
}

Consent.propTypes = {
  handleConsent: PropTypes.func.isRequired
}

export default Consent
