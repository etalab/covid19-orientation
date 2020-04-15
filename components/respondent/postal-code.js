import React, {useState, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'

function PostalCode({handlePostalCode}) {
  const [input, setInput] = useState('')
  const [isValid, setIsValid] = useState(false)

  const handleSubmit = event => {
    event.preventDefault()
    handlePostalCode(input)
  }

  useEffect(() => {
    const regex = /^\d{5}$/
    setIsValid(input.match(regex))
  }, [input])

  return (
    <article className='step'>
      <h2><i className='fas fa-mailbox' aria-hidden='true' /> <span>Quel est votre code postal ?</span></h2>
      <div className='card'>
        <form onSubmit={handleSubmit}>
          <div className='complement-infos'>
            <ul>
              <li>
                <label>Code postal de votre résidence actuelle *</label>
                <input
                  id='postal-code'
                  name='postal-code'
                  type='text'
                  inputMode='numeric'
                  title='Ce code postal semble incorrect'
                  onChange={event => setInput(event.target.value)}
                />
              </li>
            </ul>
	    <p>* Pour préserver votre anonymat, le code postal n'est retenu que s’il correspond à des communes de plus de 10 000 habitants.</p>
          </div>

          {isValid && (
            <button className='mainbutton' type='submit'>
              <span>Valider ces informations et continuer</span><i className='fas fa-check' aria-hidden='true' />
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
