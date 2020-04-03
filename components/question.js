import React from 'react'
import PropTypes from 'prop-types'

function Question({question, handleResponse}) {
  if (question) {
    if (question.component) {
      return question.component()
    }

    const {title, icon, responses} = question.question
    return (
      <article className='step'>
        <h2><i className={`fas ${icon}`} /> <span>{title}</span></h2>
        <div className='card'>
          <ul>
            {responses.map(response => (
              <li key={response.label} onClick={() => handleResponse(response, question.setSymptom)}>
                <a>
                  <span>{response.label}</span><i className={`fas ${response.icon ?? 'fa-arrow-right'}`} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </article>
    )
  }

  return null
}

Question.propTypes = {
  question: PropTypes.shape({
    component: PropTypes.func,
    question: PropTypes.shape({
      title: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      responses: PropTypes.array.isRequired
    }),
    setSymptom: PropTypes.func
  }),
  handleResponse: PropTypes.func.isRequired
}

export default Question
