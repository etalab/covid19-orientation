// Copyright (c) 2020 ANSC, DINUM
// SPDX-License-Identifier: MIT
// License-Filename: LICENSE

import 'isomorphic-unfetch' // eslint-disable-line import/no-unassigned-import

const API_URL = process.env.API_URL || 'https://proxy-orientation.covid19.etalab.gouv.fr'

export const getToken = async () => {
  try {
    const response = await fetch(`${API_URL}/token`, {
      method: 'POST'
    })

    if (response.ok) {
      const body = await response.json()
      return body.data.uuid
    }
  } catch {
    // Do nothing
  }
}

export const submitForm = async (token, data) => {
  if (!token) {
    return
  }

  const requestParameters = {
    method: 'POST',
    headers: {
      'X-Token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }

  try {
    await fetch(`${API_URL}/questionnaire`, requestParameters)
  } catch {
    // Do nothing
  }
}
