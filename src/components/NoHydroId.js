import React, { Component } from 'react';
import { withWeb3 } from 'web3-webpacked-react';
import { TextField, Typography, Button } from '@material-ui/core';

import { getContract, linkify } from '../common/utilities'

class NoHydroId extends Component {
  constructor(props) {
    super(props)

    this.state = {
      message: '',
      hydroId: ''
    }

    this.getContract = getContract.bind(this)
    this.linkify = linkify.bind(this)
  }

  handleChange = event => {
    this.setState({hydroId: event.target.value});
  };

  claimHydroId = () => {
    this.setState({message: 'Preparing Transaction'})

    let method = this.getContract('clientRaindrop').methods.signUpUser(this.state.hydroId)
    this.props.w3w.sendTransaction(method, {
      error: (error, message) => {
        console.error(error.message)
        this.setState({message: 'Transaction Error'})
      },
      transactionHash: (transactionHash) => {
        this.setState({message: this.linkify('transaction', transactionHash, 'Pending', 'body1')})
      },
      confirmation: (confirmationNumber, receipt) => {
        if (confirmationNumber === 0) {
          this.props.getAccountDetails()
        }
      }
    })
  }

  render() {
    return (
      <div>
        <Typography variant='display1' gutterBottom align="center" color="textPrimary">
          No HydroID Detected
        </Typography>
        <Typography variant='body1' gutterBottom align="center" color="textPrimary">
          There isn't a HydroID associated with your current address. Please sign up for a HydroID via the Hydro mobile app. If you know what you're doing, claim a HydroID manually below.
        </Typography>

        <form noValidate autoComplete="off" align="center">
          <TextField
            id="required"
            label="Hydro ID"
            helperText="This will be your public identifier."
            margin="normal"
            value={this.state.hydroId}
            onChange={this.handleChange}
          />
          <Button variant="contained" color="primary" onClick={this.claimHydroId}>
            Claim Hydro ID
          </Button>
          <Typography variant='body1' gutterBottom align="center" color="textPrimary">
            {this.state.message}
          </Typography>
        </form>
      </div>
    )
  }
}

export default withWeb3(NoHydroId)
