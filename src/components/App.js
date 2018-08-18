import React, { Component } from 'react';
import { withWeb3, AccountUpdater } from 'web3-webpacked-react';

import { getContract } from '../common/utilities'
import Header from './Header'
import FinalizeClaim from './FinalizeClaim'
import Body from './Body'


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hydroId: undefined,
      raindropOnly: undefined,
      claims: {}
    }

    this.getHydroId = this.getHydroId.bind(this)
    this.getContract = getContract.bind(this)
    this.addClaim = this.addClaim.bind(this)

    this.getHydroId()
  }

  addClaim(address, claim) {
    this.setState(oldState => {
      const newClaim = {}
      newClaim[address] = claim
      return {claims: {...oldState.claims, ...newClaim}}
    })
  }

  getHydroId() {
    const raindropHydroId = this.getContract('clientRaindrop').methods.getUserByAddress(this.props.w3w.account).call()
      .catch(() => { return null })

    const snowflakeHydroId = this.getContract('snowflake').methods.getHydroId(this.props.w3w.account).call()
      .catch(() => { return null })

    Promise.all([raindropHydroId, snowflakeHydroId])
      .then(([raindrop, snowflake]) => {
        if (snowflake !== null) {
          this.setState({hydroId: snowflake, raindropOnly: false})
        } else {
          if (raindrop !== null) {
            this.setState({hydroId: raindrop, raindropOnly: true})
          } else {
            this.setState({hydroId: undefined, raindropOnly: undefined})
          }
        }
      })
  }

  render() {
    // console.log(this.state.claims)
    const claim = this.state.claims[this.props.w3w.account.toLowerCase()]
    const finalizeClaim = claim !== undefined ?
      <FinalizeClaim claim={claim} getHydroId={this.getHydroId} /> :
      ''

    return (
      <div>
        <AccountUpdater>
          <Header hydroId={this.state.hydroId} getHydroId={this.getHydroId}/>
        </AccountUpdater>
        <hr/>
        {finalizeClaim}
        <Body
          key={this.state.hydroId}
          hydroId={this.state.hydroId}
          raindropOnly={this.state.raindropOnly}
          getHydroId={this.getHydroId}
          addClaim={this.addClaim}
        />
      </div>
    )
  }
}

export default withWeb3(App)
