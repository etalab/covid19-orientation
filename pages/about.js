// Copyright (c) 2020 ANSC, DINUM
// SPDX-License-Identifier: MIT
// License-Filename: LICENSE

import React from 'react'

import Page from '../layouts/main'
import StartMessage from '../components/start-message'

function About() {
  return (
    <Page>
      <StartMessage />
      <article>
        <p>
          Afin de rendre impossible toute réidentification des personnes
          concernées, les codes postaux ne sont retenus que s’ils correspondent
          à des communes de plus de 10 000 habitants. Pour les communes de moins
          de 10 000 habitants, un processus d’agrégation est mis en œuvre et
          seules les données agrégées sont conservées. Dans ce même but, seules
          les tranches d’âge et l'indice de masse corporelle sont conservés,
          non l’âge exact ni la taille et le poids.
        </p>

        <div className='gouv-button-container'>
          <a className='gouv-button' href='/'>
            <i className='fas fa-arrow-left' aria-hidden='true' /> Retour à la page précédente
          </a>
        </div>
      </article>
    </Page>
  )
}

export default About
