import React from 'react'
import PropTypes from 'prop-types'

function Consent({handleConsent}) {
  return (
    <article>
      <p>Ce questionnaire sert uniquement à vous orienter en fonction de votre état de santé et des symptômes que vous indiquez. L’avis qu'il fournit n’a pas de valeur médicale.</p>

      <p>L’algorithme mis en oeuvre pour vous proposer une orientation est conforme à la <span><a target='new' target='_top' title='Accéder à la documentation dans un nouvel onglet' href='https://delegation-numerique-en-sante.github.io/covid19-algorithme-orientation/index.html'>documentation publiée par le ministère des Solidarités et de la Santé</a>,</span> qui référence aussi les autres solutions qui s’y conforment.  Vos réponses serviront à aider la recherche et la compréhension de l’épidémie de COVID 19.</p>

      <p>Aucune information permettant de vous identifier, directement ou indirectement, n’est collectée. Voyez nos <span><a href='/about'>explications</a></span> à ce sujet.</p>

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
