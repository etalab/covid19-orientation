import React, { useState, useCallback, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

const HEIGHT_MINMAX = {
  min: 50,
  max: 246,
}

const WEIGHT_MINMAX = {
  min: 25,
  max: 400,
}

function checkIWeightIsValid (weight) {
  const weightIsValid = weight >= WEIGHT_MINMAX.min && weight <= WEIGHT_MINMAX.max
  return weightIsValid
}

function checkIfHeightIsValid (height) {
  const heightIsValid =
    height >= HEIGHT_MINMAX.min && height <= HEIGHT_MINMAX.max
  return heightIsValid
}

function renderMandatoryFieldsMessage(msg) {
  // NOTE Dupliquer depuis le composant risk-factor-radios
  return (
    <div className="message">
      <div className="primary-message">{msg}</div>
      <style jsx>{`
        .primary-message {
          margin: 0.5em 0;
          text-align: center;
          color: var(--alert-dark);
        }
      `}</style>
    </div>
  )
}

function IMC({ handleHeight, handleWeight }) {
  const didMountRef = useRef(false)
  const [weight, setWeight] = useState()
  const [height, setHeight] = useState()
  const [isValid, setIsValid] = useState(false)
  const [isWeightValid, setWeightIsValid] = useState(false)
  const [isHeightValid, setHeightIsValid] = useState(false)
  const [hasBeenSubmitted, setHasBeenSubmitted] = useState(false)

  const handleSubmit = useCallback(event => {
    event.preventDefault()
    handleHeight(height)
    handleWeight(weight)
  }, [height, weight])

  useEffect(() => {
    if (didMountRef.current) {
      const weightIsValid = checkIWeightIsValid(weight)
      setWeightIsValid(weightIsValid)
      const heightIsValid = checkIfHeightIsValid(height)
      setHeightIsValid(heightIsValid)
      const validValue = isWeightValid && isHeightValid
      setIsValid(validValue)
    } else {
      didMountRef.current = true
    }
  })

  return (
    <article className="step" id="imc-01">
      <h2>
        <i className="fas fa-weight" aria-hidden="true" />
        <span>&nbsp;Indiquez votre poids et votre taille</span>
      </h2>
      <div className="card">
        <form id="form-imc" onSubmit={handleSubmit}>
          <div className="complement-infos">
            <p>
              Ces données sont utiles pour calculer votre indice de masse
              corporelle.
            </p>
            <ul>
              <li>
                <label htmlFor="add-taille">Taille en centimètres * :</label>
                <input
                  type="number"
                  id="add-taille"
                  name="add-taille"
                  min={HEIGHT_MINMAX.min}
                  max={HEIGHT_MINMAX.max}
                  placeholder="Par ex. 165"
                  onChange={event => {
                    setHasBeenSubmitted(false)
                    setHeight(event.target.value)
                  }}
                />
              </li>
              <li>
                <label htmlFor="add-poids">Poids en kilogrammes * :</label>
                <input
                  type="number"
                  id="add-poids"
                  name="add-poids"
                  min={WEIGHT_MINMAX.min}
                  max={WEIGHT_MINMAX.max}
                  placeholder="Par ex. 70"
                  onChange={event => {
                    setHasBeenSubmitted(false)
                    setWeight(event.target.value)
                  }}
                />
              </li>
            </ul>
            {(
              (hasBeenSubmitted && !isHeightValid) &&
                renderMandatoryFieldsMessage('Ce nombre ne semble pas être une taille valide en centimètres.')
            )}
            {(
              (hasBeenSubmitted &&!isWeightValid) &&
                renderMandatoryFieldsMessage('Ce nombre ne semble pas être un poids valide en kilogrammes.')
            )}
            <p>*&nbsp;La saisie de ces deux champs est obligatoire.</p>
          </div>
          <button
            type="submit"
            className={`mainbutton ${isValid ? '' : 'required'}`}
            onClick={() => setHasBeenSubmitted(true)}
          >
            {(
              (didMountRef.current &&
                weight !== '' &&
                weight !== undefined &&
                height !== '' &&
                height !== undefined
              ) && (
                <React.Fragment>
                  <span>Je mesure {height} cm et je pèse {weight} kilos.</span>
                  <i className="fas fa-check" aria-hidden="true" />
                </React.Fragment>
              )
            ) || (
              <span>Envoyer</span>
            )}
            </button>
        </form>
      </div>
    </article>
  )
}

IMC.propTypes = {
  handleHeight: PropTypes.func.isRequired,
  handleWeight: PropTypes.func.isRequired,
}

export default IMC
