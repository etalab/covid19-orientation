import React from 'react'
import PropTypes from 'prop-types'

function Consent({handleConsent}) {
  return (
    <article>
      <p>Le questionnaire que vous vous apprêtez à remplir n’a pas de valeur d’avis médical. Il sert uniquement à vous orienter en fonction de votre état de santé et des symptômes que vous indiquez.</p>
      <p>Vos réponses ne serviront qu’à des fins de recherche pour mieux comprendre l’épidémie de COVID 19.</p>
      <p>Aucune information permettant de vous identifier, directement ou indirectement, ne vous sera demandée.</p>

      <a href='/about'>Voir plus d’informations</a>

      <button className='mainbutton' type='submit' onClick={() => handleConsent(true)}>
        <span>J’ai compris</span> <i className='fas fa-check' aria-hidden='true' />
      </button>

      <style jsx>{`
        a {
          margin: 1em 0;
          display: block;
          text-decoration: underline;
        }
        `}</style>
    </article>
  )
}

Consent.propTypes = {
  handleConsent: PropTypes.func.isRequired
}

export default Consent
