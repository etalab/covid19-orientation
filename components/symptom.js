import React from 'react'
import PropTypes from 'prop-types'

function Symptom({question, icon, responses, toggleReponse, setSymptom}) {
  return (
    <article className='step'>
      <h2><i className={`fas ${icon}`} /> <span>{question}</span></h2>
      <div className='card'>
        <ul>
          {responses.map(question => (
            <li key={question.label} onClick={() => toggleReponse(question, setSymptom)}>
              <a>
                <span>{question.label}</span><i className={`fas ${question.icon}`} />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <style jsx>{`
        li:hover {
          cursor: pointer;
        }
        `}</style>
    </article>
  )
}

Symptom.propTypes = {
  question: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  responses: PropTypes.array.isRequired,
  toggleReponse: PropTypes.func.isRequired,
  setSymptom: PropTypes.func.isRequired
}

export default Symptom
