import React, { Component } from 'react';
import { withWeb3 } from 'web3-webpacked-react';
import { Typography } from '@material-ui/core';

import { getContract } from '../common/utilities'

import TransactionForm from './TransactionForm'

class NoHydroId extends Component {
  constructor(props) {
    super(props)
    this.getContract = getContract.bind(this)
  }

  render() {
    return (
      <div>
        <Typography variant='display1' gutterBottom color="textPrimary">
          No Hydro ID Detected
        </Typography>

        <Typography variant='body2' gutterBottom color="textPrimary">
          Your current address does not have a Hydro ID. You may claim one below.
        </Typography>

        <TransactionForm
          fields={[{label: 'Hydro ID', helperText: "This is a public identifier."}]}
          buttonInitial="Claim"
          method={this.getContract('clientRaindrop').methods.signUpUser}
          methodArgs={[{lookup: "Hydro ID"}]}
          onConfirmation={() => this.props.getAccountDetails()}
        />
      </div>
    )
  }
}

export default withWeb3(NoHydroId)
