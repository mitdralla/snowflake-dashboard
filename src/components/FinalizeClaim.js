import React, { Component } from 'react';
import { withWeb3 } from 'web3-webpacked-react';

import TransactionButton from './TransactionButton'
import { getContract } from '../common/utilities'

class FinalizeClaim extends Component {
  constructor(props) {
    super(props)

    this.getContract = getContract.bind(this)
  }

  render() {
    const message = `Finalize Claim for '${this.props.claim.hydroId}'`
    const method = this.getContract('snowflake').methods.finalizeClaim(
      this.props.claim.hashedSecret, this.props.claim.hydroId
    )

    return (
      <TransactionButton
        buttonInitial={message}
        method={method}
        onConfirmation={() => {
          this.props.removeClaim(this.props.claim.address)
          this.props.getAccountDetails()
        }}
      />
    )
  }
}

export default withWeb3(FinalizeClaim)
