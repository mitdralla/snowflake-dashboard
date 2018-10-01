import React, { Component, Fragment } from 'react';
import { withWeb3 } from 'web3-webpacked-react';

import { getContract } from '../common/utilities'
import TransactionButton from './TransactionButton'

class GetHydro extends Component {
  getContract = getContract

  render() {
    return (
      <Fragment>
        {this.props.w3w.networkId === 4 ? (
          <form noValidate autoComplete="off">
            <TransactionButton
              buttonInitial='Get Free Testnet Hydro!'
              method={this.getContract('token').methods.getMoreTokens()}
              onConfirmation={this.props.getAccountDetails}
            />
          </form>
          ) :
          null
        }
      </Fragment>
    )
  }
}

export default withWeb3(GetHydro)
