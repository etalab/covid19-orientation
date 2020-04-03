import React, {useState, useCallback} from 'react'
import PropTypes from 'prop-types'

function IMC({handleHeight, handleWeight}) {
  const [weight, setWeight] = useState()
  const [height, setHeight] = useState()

  const handleSubmit = useCallback(event => {
    event.preventDefault()
    handleHeight(height)
    handleWeight(weight)
  }, [height, weight, handleHeight, handleWeight])

  return (
    <article className='step' id='imc-01'>
      <h2><i className='fas fa-weight' aria-hidden='true' /> <span>Indiquez votre poids et votre taille</span></h2>
      <div className='card'>
        <form id='form-imc' onSubmit={handleSubmit}>
          <div className='complement-infos'>
            <p>Ces données sont utiles pour calculer votre indice de masse corporelle.</p>
            <ul>
              <li>
                <label htmlFor='add-taille'>Taille en centimètres * :</label>
                <input
                  type='text'
                  required pattern='[0-9]+'
                  id='add-taille'
                  value={height}
                  data-check-number data-check-number-min='50'
                  data-check-number-max='300'
                  data-check-number-error='Ce nombre ne semble pas être une taille en centimètres valide.'
                  placeholder='ex : 165'
                  inputMode='numeric'
                  onChange={event => setHeight(event.target.value)}
                />
              </li>
              <li>
                <label htmlFor='add-poids'>Poids en kilogrammes * :</label>
                <input
                  type='text'
                  required pattern='[0-9,.]+'
                  id='add-poids'
                  value={weight}
                  data-check-number data-check-number-min='10'
                  data-check-number-max='500'
                  data-check-number-error='Ce nombre ne semble pas être un poids en kilogrammes valide.'
                  placeholder='ex : 70'
                  inputMode='decimal'
                  onChange={event => setWeight(event.target.value)}
                />
              </li>
            </ul>
            <p>* Le remplissage de ces 2 champs est obligatoire.</p>
          </div>
          {height && weight && (
            <button className='mainbutton' type='submit'>
              <span>Valider ces informations et continuer</span><i className='fas fa-check' aria-hidden='true' />
            </button>)}
        </form>
      </div>
    </article>
  )
}

IMC.propTypes = {
  handleHeight: PropTypes.func.isRequired,
  handleWeight: PropTypes.func.isRequired
}

export default IMC
