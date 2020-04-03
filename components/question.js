import React from 'react'
import PropTypes from 'prop-types'

import Symptom from '../components/symptom'

function Question({question, handleResponse}) {
  if (question) {
    if (question.type === 'symptom') {
      const {setter, symptom} = question
      return (
        <Symptom
          setSymptom={setter}
          {...symptom}
          toggleReponse={handleResponse}
        />
      )
    }

    return question.question()
  }

  return null
}

Question.defaultProps = {
  question: null
}

Question.propTypes = {
  question: PropTypes.shape({
    type: PropTypes.oneOf(['symptom', 'patient']).isRequired,
    setter: PropTypes.func,
    symptom: PropTypes.object,
    question: PropTypes.func
  }),
  handleResponse: PropTypes.func.isRequired
}

export default Question
