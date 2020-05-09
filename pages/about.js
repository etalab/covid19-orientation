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
          Si vous avez moins de 15 ans, un message est affiché
          indiquant que l’application n’est pas adaptée à votre
          situation, car l’algorithme servant à vous orienter n’a pas
          été médicalement validé pour des populations de moins de 15
          ans.  Dans ce cas, aucune donnée n’est collectée.
        </p>

        <p>
          Si vous avez plus de 15 ans et que vous remplissez le
          formulaire jusqu’à la fin, vos réponses sont envoyées vers
          un serveur et restent anonymes : votre adresse IP n’est pas
          collectée ; vos âges, poids et tailles exacts ne sont pas
          collectés, seuls le sont votre tranche d’âge et votre indice
          de masse corporelle.
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
