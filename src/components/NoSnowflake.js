import React, { Component } from 'react';
import { withWeb3 } from 'web3-webpacked-react';
import { Typography } from '@material-ui/core';

import TransactionForm from './TransactionForm'

import { getContract } from '../common/utilities'

class NoSnowflake extends Component {
  constructor(props) {
    super(props)

    this.getContract = getContract.bind(this)
  }

  render() {
    const message = `Claim '${this.props.hydroId}'`
    return (
      <div>
        <Typography variant='display1' gutterBottom color="textPrimary">
          Almost There...
        </Typography>

        <Typography variant='body1' gutterBottom color="textPrimary">
          Click below to claim your Snowflake!
        </Typography>

        <TransactionForm
          fields={[]}
          buttonInitial={message}
          method={this.getContract('snowflake').methods.mintIdentityToken}
          methodArgs={[]}
          onConfirmation={() => this.props.getAccountDetails()}
        />
      </div>
    )
  }
}

export default withWeb3(NoSnowflake)
