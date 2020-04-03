import React, {useState, useCallback} from 'react'
import PropTypes from 'prop-types'

function IMC({handleImc}) {
  const [taille, setTaille] = useState()
  const [poids, setPoids] = useState()

  const handleSubmit = useCallback(event => {
    event.preventDefault()
    handleImc({taille, poids})
  }, [taille, poids, handleImc])

  return (
    <article className='step' id='imc-01'>
      <h2><i className='fas fa-mailbox' aria-hidden='true' /> <span>Indiquez votre poids et votre taille</span></h2>
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
                  value={taille}
                  data-check-number data-check-number-min='50'
                  data-check-number-max='300'
                  data-check-number-error='Ce nombre ne semble pas être une taille en centimètres valide.'
                  placeholder='ex : 165'
                  inputMode='numeric'
                  onChange={event => setTaille(event.target.value)}
                />
              </li>
              <li>
                <label htmlFor='add-poids'>Poids en kilogrammes * :</label>
                <input
                  type='text'
                  required pattern='[0-9,.]+'
                  id='add-poids'
                  value={poids}
                  data-check-number data-check-number-min='10'
                  data-check-number-max='500'
                  data-check-number-error='Ce nombre ne semble pas être un poids en kilogrammes valide.'
                  placeholder='ex : 70'
                  inputMode='decimal'
                  onChange={event => setPoids(event.target.value)}
                />
              </li>
            </ul>
            <p>* Le remplissage de ces 2 champs est obligatoire.</p>
          </div>
          <button className='mainbutton' type='submit'>
            <span>Valider ces informations et continuer</span><i className='fas fa-check' aria-hidden='true' />
          </button>
        </form>
      </div>
    </article>
  )
}

IMC.propTypes = {
  handleImc: PropTypes.func.isRequired
}

export default IMC
