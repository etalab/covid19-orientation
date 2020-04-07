import React from 'react'
import PropTypes from 'prop-types'
import reactHtmlParser from 'react-html-parser'

import fins from '../fins.json'

function End({end, isFinish, showUrgentMessage, hideUrgentMessage}) {
  const {icon, primary, secondary} = fins[end]

  if (isFinish || showUrgentMessage) {
    const text = isFinish ? secondary
    return (
      <>
        <article className='step message-fin'>
          <h2><i className='fas fa-info-circle' /> <span>Conseil relatif à votre situation</span></h2>
          <div className='card message'>
            <p className='icon'><i className={`fas ${icon} ${end === 5 ? '' : 'anim-pulse'}`} /></p>
            <p className='primary-message'>{reactHtmlParser(primary)}</p>
            {text && <p className='secondary-message'>{reactHtmlParser(text)}</p>}
            {!isFinish && (
              <div className='centered'>
                <div className='gouv-button-container'>
                  <a className='gouv-button' onClick={hideUrgentMessage}><i className='fas fa-check' aria-hidden='true' />Je veux aider la recherche et finir le questionnaire</a>
                </div>
              </div>
            )}
          </div>
        </article>

        {isFinish && (
          <article>
            <div className='card message'>
              <p className='icon'><i className='fa fa-check' /></p>
              <p className='primary-message'>Merci d’avoir utilisé l’algorithme d’orientation COVID-19</p>
              <p className='secondary-message'>Cet algorithme est potentiellement modifiable après étude de cas et veille scientifique.</p>
            </div>
          </article>
        )}

        <style jsx>{`
          .centered {
            display: flex;
            justify-content: center;
          }
          `}</style>
      </>
    )
  }

  return null
}

End.defaultProps = {
  isFinish: false,
  showUrgentMessage: false
}

End.propTypes = {
  end: PropTypes.number.isRequired,
  showUrgentMessage: PropTypes.bool,
  hideUrgentMessage: PropTypes.func.isRequired,
  isFinish: PropTypes.bool
}

export default End
