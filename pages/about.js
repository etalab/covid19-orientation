import React from 'react'

import Page from '../layouts/main'
import StartMessage from '../components/start-message'

function About() {
  return (
    <Page>
      <StartMessage />
      <article>
        <p>
          L’algorithme d’orientation COVID 19 est mis en œuvre conformément à la{' '}
          <a
            target='new'
            target='_top'
            title='Accéder à la documentation dans un nouvel onglet'
            href='https://delegation-numerique-en-sante.github.io/covid19-algorithme-orientation/index.html'
          >
            documentation officielle
          </a>{' '}
          publiée par le ministère des Solidarités et de la Santé.
        </p>
        <p>
          Afin de rendre impossible toute réidentification des personnes
          concernées, les codes postaux ne sont retenus que s’ils correspondent
          à des communes de plus de 10 000 habitants. Pour les communes de moins
          de 10 000 habitants, un processus d’agrégation est mis en œuvre et
          seules les données agrégées sont conservées. Dans ce même but, seules
          les tranches d’âge sont conservées et non l’âge exact.
        </p>

        <div className='gouv-button-container'>
          <a className='gouv-button' href='/'>
            <i className='fas fa-arrow-left' aria-hidden='true' /> Retour au
            formulaire
          </a>
        </div>
      </article>
    </Page>
  )
}

export default About
