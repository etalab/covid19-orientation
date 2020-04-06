// Copyright (c) 2020 ANSC, DINUM
// SPDX-License-Identifier: MIT
// License-Filename: LICENSE

import 'isomorphic-unfetch' // eslint-disable-line import/no-unassigned-import

const API_URL = process.env.API_URL || 'https://proxy-orientation.covid19.etalab.gouv.fr'

export const getToken = async () => {
  const options = {
    method: 'POST'
  }

  const response = await fetch(`${API_URL}/token`, options)

  if (response.ok) {
    return response.json()
  }
}

export const submitForm = async (token, data) => {
  const options = {
    method: 'POST',
    headers: {
      'X-Auth-Token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }

  await fetch(`${API_URL}/questionnaire`, options)
}
