// Copyright (c) 2020 ANSC, DINUM
// SPDX-License-Identifier: MIT
// License-Filename: LICENSE

import React from 'react'
import PropTypes from 'prop-types'

import Meta from '../components/meta'

class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node
  }

  static defaultProps = {
    children: null
  }

  render() {
    const {iframe, children} = this.props

    return (
      <>
        <Meta />
        <div id='main-container'>
          <main>
            {children}
          </main>
        </div>

        <style jsx global>{`
            body {
              overflow: ${iframe ? 'hidden' : 'inherit'};
            }
          `}</style>
      </>
    )
  }
}

Layout.defaultProps = {
  iframe: false
}

Layout.propTypes = {
  iframe: PropTypes.bool
}

export default Layout
