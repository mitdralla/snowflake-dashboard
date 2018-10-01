import React, { Component } from 'react';
import { withWeb3 } from 'web3-webpacked-react';
import { TextField, Typography } from '@material-ui/core';

import { getContract } from '../common/utilities'

import TransactionButton from './TransactionButton'

class NoHydroId extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hydroId: ''
    }

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

        <TextField
          key='Hydro ID'
          label='Hydro ID'
          helperText='This is a public identifier.'
          margin="normal"
          value={this.state.hydroId}
          onChange={e => this.setState({hydroId: e.target.value})}
          fullWidth
        />
        <TransactionButton
          buttonInitial="Claim"
          method={this.getContract('clientRaindrop').methods.signUpUser(this.state.hydroId)}
          onConfirmation={this.props.getAccountDetails}
        />
      </div>
    )
  }
}

export default withWeb3(NoHydroId)
