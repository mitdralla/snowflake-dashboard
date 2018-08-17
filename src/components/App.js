import React, { Component } from 'react';
import { withWeb3 } from 'web3-webpacked-react';

import { getContract } from '../common/utilities'
import Header from './Header'
import Body from './Body'


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hydroId: null,
      raindropOnly: false
    }

    this.getHydroId = this.getHydroId.bind(this)
    this.getContract = getContract.bind(this)

    this.getHydroId()
  }

  getHydroId() {
    const raindropHydroId = this.getContract('clientRaindrop').methods.getUserByAddress(this.props.w3w.account).call()
      .catch(() => {
        return null
      })

    const snowflakeHydroId = this.getContract('snowflake').methods.getHydroId(this.props.w3w.account).call()
      .catch(() => {
        return null
      })

    Promise.all([raindropHydroId, snowflakeHydroId])
      .then(([raindrop, snowflake]) => {
        let hydroId
        if (snowflake !== null) {
          hydroId = snowflake
        } else {
          if (raindrop !== null) {
            this.setState({raindropOnly: true})
          }
          hydroId = raindrop
        }
        this.setState({hydroId: hydroId})
      })
  }

  render() {
    return (
      <div>
        <Header hydroId={this.state.hydroId} />
        <hr/>
        <Body hydroId={this.state.hydroId} raindropOnly={this.state.raindropOnly} getHydroId={this.getHydroId} />
      </div>
    )
  }
}

export default withWeb3(App)
