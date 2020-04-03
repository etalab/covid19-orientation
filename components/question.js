import React from 'react'
import PropTypes from 'prop-types'

import Symptom from '../components/symptom'

const Question = ({question, handleResponse}) => {
  if (question) {
    if (question.type === 'symptome') {
      const {setter, symptome} = question
      return (
        <Symptom
          setSymptome={setter}
          {...symptome}
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
    type: PropTypes.oneOf(['symptome', 'profile']).isRequired
  }),
  handleResponse: PropTypes.func.isRequired
}

export default Question
