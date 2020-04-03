import React from 'react'
import PropTypes from 'prop-types'

const End = ({end}) => {
  let endToDisplay

  switch (end) {
    case 1:
      endToDisplay = (
        <article className='step message-fin' id='message-fin-1'>
          <h2><i className='fas fa-info-circle' /> <span>Conseil relatif à votre situation</span></h2>
          <div className='card message'>
            <p className='icon'><i className='fas fa-calendar' /></p>
            <div className='primary-message'>
              <p>Cette application n’est pas adaptée aux personnes de moins de 15 ansC</p>
            </div>
            <div className='secondary-message'>
              <p>Prenez contact avec votre médecin généraliste au moindre doute. En cas d’urgence, appelez le <a href='tel:15'>15</a> (ou contactez le 114 par SMS si vous êtes sourd ou malentendant).</p>
            </div>
          </div>
        </article>
      )
      break
    case 2:
      endToDisplay = (
        <article className='step message-fin' id='message-fin-2'>
          <h2><i className='fas fa-info-circle' /> <span>Conseil relatif à votre situation</span></h2>
          <div className='card message'>
            <p className='icon'><i className='fas fa-house-user anim-pulse' /></p>
            <p className='primary-message'>Votre situation peut relever d’un COVID 19 qu’il faut surveiller.</p>
            <p className='secondary-message'>Si de nouveaux symptômes apparaissent, refaites le test ou consultez votre médecin. Nous vous conseillons de rester à votre domicile.</p>
          </div>
        </article>
      )
      break
    case 3:
      endToDisplay = (
        <article className='step message-fin' id='message-fin-3'>
          <h2><i className='fas fa-info-circle' /> <span>Conseil relatif à votre situation</span></h2>
          <div className='card message'>
            <p className='icon'><i className='fas fa-user-md anim-pulse' /></p>
            <p className='primary-message'>Votre situation peut relever d’un COVID 19, consultez un médecin</p>
            <p className='secondary-message'>Demandez une téléconsultation, un médecin généraliste ou une visite à domicile.<br />Appelez le <a href='tel:15'>15</a> si une gêne respiratoire ou des difficultés importantes pour vous alimenter ou boire apparaissent pendant plus de 24 heures.</p>
          </div>
        </article>
      )
      break
    case 4:
      endToDisplay = (
        <article className='step message-fin' id='message-fin-4'>
          <h2><i className='fas fa-info-circle' /> <span>Conseil relatif à votre situation</span></h2>
          <div className='card message'>
            <p className='icon'><i className='fas fa-user-md anim-pulse' /></p>
            <p className='primary-message'>Votre situation peut relever d’un COVID 19, consultez un médecin</p>
            <p className='secondary-message'>Demandez une téléconsultation, un médecin généraliste ou une visite à domicile. Si vous n’arrivez pas à obtenir de consultation, appelez le <a href='tel:15'>15</a> (ou contactez le 114 par SMS si vous êtes sourd ou malentendant).</p>
          </div>
        </article>
      )
      break
    case 5:
      endToDisplay = (
        <article className='step message-fin' id='message-fin-5'>
          <h2><i className='fas fa-info-circle' /> <span>Conseil relatif à votre situation</span></h2>
          <div className='card message'>
            <p className='icon'><i className='fas fa-phone anim-pulse' /></p>
            <p className='primary-message'>
              Appelez le SAMU en composant le <a href='tel:15'>15</a><br />(ou contactez le 114 par SMS si vous êtes sourd ou malentendant).
            </p>
          </div>
        </article>
      )
      break
    case 6:
      endToDisplay = (
        <article className='step message-fin' id='message-fin-6'>
          <h2><i className='fas fa-info-circle' /> <span>Conseil relatif à votre situation</span></h2>
          <div className='card message'>
            <p className='icon'><i className='fas fa-user-md anim-pulse' /></p>
            <p className='primary-message'>Votre situation peut relever d’un COVID 19, consultez un médecin</p>
            <p className='secondary-message'>Consultez votre médecin généraliste, un médecin en téléconsultation ou demandez une visite à domicile (SOS médecins…).</p>
          </div>
        </article>
      )
      break
    case 7:
      endToDisplay = (
        <article className='step message-fin' id='message-fin-7'>
          <h2><i className='fas fa-info-circle' /> <span>Conseil relatif à votre situation</span></h2>
          <div className='card message'>
            <p className='icon'><i className='fas fa-virus-slash anim-pulse' /></p>
            <p className='primary-message'>Votre situation peut relever d’un COVID 19</p>
            <p className='secondary-message'>Un avis médical est recommandé. Au moindre doute, appelez le <a href='tel:15'>15</a> (ou contactez le 114 par SMS si vous êtes sourd ou malentendant). Nous vous conseillons de rester à votre domicile.</p>
          </div>
        </article>
      )
      break
    case 8:
      endToDisplay = (
        <article className='step message-fin' id='message-fin-8'>
          <h2><i className='fas fa-info-circle' /> <span>Conseil relatif à votre situation</span></h2>
          <div className='card message'>
            <p className='icon'><i className='fas fa-virus-slash anim-pulse' /></p>
            <p className='primary-message'>Votre situation ne relève probablement pas du COVID 19</p>
            <p className='secondary-message'>N’hésitez pas à contacter votre médecin en cas de doute.<br />Vous pouvez refaire le test en cas de nouveau symptôme pour réévaluer la situation.<br />Pour toute information concernant le COVID 19, composez le <a href='tel:0800130000'>0 800 130 000</a>.</p>
          </div>
        </article>
      )
      break
    default:
      break
  }

  return endToDisplay
}

End.propTypes = {
  end: PropTypes.number.isRequired
}

export default End
