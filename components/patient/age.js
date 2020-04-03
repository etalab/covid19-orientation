import React from 'react'
import PropTypes from 'prop-types'

function Age({handleAge}) {
  return (
    <article className='step' id='age-01'>
      <h2><i className='fas fa-calendar-day' /><span>Quel est votre âge ?</span></h2>
      <div className='card'>
        <ul>
          <li onClick={() => handleAge(14)}>
            <a href='#' data-age='14'><span>Moins de 15 ans</span><i className='fas fa-arrow-right' /></a>
          </li>
          <li onClick={() => handleAge(16)}>
            <a href='#' data-age='16'><span>Entre 15 et 49 ans</span><i className='fas fa-arrow-right' /></a>
          </li>
          <li onClick={() => handleAge(51)}>
            <a href='#' data-age='51'><span>Entre 50 et 69 ans</span><i className='fas fa-arrow-right' /></a>
          </li>
          <li onClick={() => handleAge(71)}>
            <a href='#' data-age='71'><span>70 ans ou plus</span><i className='fas fa-arrow-right' /></a>
          </li>
        </ul>
      </div>
    </article>
  )
}

Age.propTypes = {
  handleAge: PropTypes.func.isRequired
}

export default Age
