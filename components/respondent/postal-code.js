import React, {useState, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'

const DEFAULT_POSTAL_CODE = ''
const NO_CONSENT_POSTAL_CODE = '00000'

function PostalCode({handlePostalCode}) {
  const [input, setInput] = useState(DEFAULT_POSTAL_CODE)
  const [userDoNotConsent, setUserDoNotConsent] = useState(false)
  const [isValid, setIsValid] = useState(false)

  const handleSubmit = event => {
    event.preventDefault()
    if (userDoNotConsent) {
      handlePostalCode(NO_CONSENT_POSTAL_CODE)
    } else {
      handlePostalCode(input)
    }
  }

  useEffect(() => {
    if (userDoNotConsent) {
      setIsValid(true)
    } else {
      const regex = /^\d{5}$/
      const matches = input.match(regex);
      setIsValid(matches)
    }
  }, [input, userDoNotConsent])

  return (
    <article className='step'>
      <h2>
        <i className='fas fa-mailbox' aria-hidden='true' />&nbsp;
        <span>Quel est votre code postal ?</span></h2>
      <div className='card'>
        <form onSubmit={handleSubmit}>
          <div className='complement-infos'>
            <ul>
              <li style={{ border: 0 }}>
                <label htmlFor='postal-code'>Code postal de votre résidence actuelle *</label>
                <input
                  type='text'
                  disabled={userDoNotConsent}
                  id='postal-code'
                  name='postal-code'
                  inputMode='numeric'
                  value={userDoNotConsent ? DEFAULT_POSTAL_CODE : input}
                  title='Ce code postal semble incorrect'
                  onChange={event => setInput(event.target.value)}
                />
              </li>
              <li style={{ border: 0 }}>
                <input
                  id='no-postal-code'
                  name='no-postal-code'
                  type='checkbox'
                  title='Je ne souhaite pas répondre à cette question'
                  onChange={event => {
                    const userDoNotConsent = Boolean(event.target.checked)
                    setUserDoNotConsent(userDoNotConsent)
                  }}
                />
                <label htmlFor='no-postal-code'>Je ne souhaite pas répondre à cette question / Je ne connais pas mon code postal de résidence actuelle.</label>
              </li>
            </ul>
            <p>* Votre code postal complet ne sera retenu s'il correspond à une zone géographique de plus de 10 000 habitants.</p>
          </div>
          {isValid && (
            <button className='mainbutton' type='submit'>
              <span>Valider et terminer</span><i className='fas fa-check' aria-hidden='true' />
            </button>
          )}
        </form>
      </div>
    </article>
  )
}

PostalCode.propTypes = {
  handlePostalCode: PropTypes.func.isRequired
}

export default PostalCode
