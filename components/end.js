import React from 'react'
import PropTypes from 'prop-types'
import reactHtmlParser from 'react-html-parser'

import fins from '../fins.json'

function End({end, isFinish}) {
  const {icon, primary, secondary} = fins[end]

  if (isFinish) {
    const text = secondary
    return (
      <>
        <article className='step message-fin'>
          <h2><i className='fas fa-info-circle' /> <span>Conseil relatif à votre situation</span></h2>
          <div className='card message'>
            <p className='icon'><i className={`fas ${icon} ${end === 5 ? '' : 'anim-pulse'}`} /></p>
            <p className='primary-message'>{reactHtmlParser(primary)}</p>
            {text && <p className='secondary-message'>{reactHtmlParser(text)}</p>}
          </div>
        </article>
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
}

End.propTypes = {
  end: PropTypes.number.isRequired,
  isFinish: PropTypes.bool
}

export default End
