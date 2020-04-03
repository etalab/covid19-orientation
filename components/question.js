import React from 'react'
import PropTypes from 'prop-types'

import Symptom from '../components/symptom'

const Question = ({question, handleResponse}) => {
  console.log("Question -> question", question)
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
}

Question.defaultProps = {
  question: null
}

Question.propTypes = {
  question: PropTypes.shape({
    type: PropTypes.oneOf(['symptom', 'profile']).isRequired
  }),
  handleResponse: PropTypes.func.isRequired
}

export default Question
