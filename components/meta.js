import React from 'react'
import Head from 'next/head'

function Meta() {
  return (
    <Head>
      <meta charSet='utf-8' />
      <meta name='robots' content='noindex' />
      <title>Questionnaire d’orientation COVID-19</title>
      <meta name='description' content='' />
      <meta name='viewport' content='width=device-width, initial-scale=1' />

      <link rel='apple-touch-icon' sizes='180x180' href='./apple-touch-icon.png' />
      <link rel='icon' type='image/png' sizes='32x32' href='./favicon-32x32.png' />
      <link rel='icon' type='image/png' sizes='16x16' href='./favicon-16x16.png' />
      <link rel='manifest' href='./site.webmanifest' />
      <link rel='mask-icon' href='./safari-pinned-tab.svg' color='#5bbad5' />
      <meta name='msapplication-TileColor' content='#ffffff' />
      <meta name='theme-color' content='#ffffff' />

      <link rel='stylesheet' href='./css/normalize.css' />
      <link rel='stylesheet' href='./css/fontawesome.min.css' />
      <link rel='stylesheet' href='./css/main.css' />
    </Head>
  )
}

export default Meta
