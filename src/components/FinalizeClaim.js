import React, { Component } from 'react';
import { withWeb3 } from 'web3-webpacked-react';
import { Typography, Button } from '@material-ui/core';

import { getContract, linkify } from '../common/utilities'

class FinalizeClaim extends Component {
  constructor(props) {
    super(props)

    this.state = {
      message: '',
    }

    this.getContract = getContract.bind(this)
    this.linkify = linkify.bind(this)
  }

  finalizeAddressClaim = event => {
    this.setState({message: 'Preparing Transaction'})

    let method = this.getContract('snowflake').methods.finalizeClaim(
      this.props.claim.hashedSecret, this.props.claim.hydroId
    )

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
          this.props.getHydroId()
        }
      }
    })
  };

  render() {
    return (
      <form noValidate autoComplete="off" align="center">
        <Button variant="contained" align="center" color="primary" onClick={this.finalizeAddressClaim}>
          Finalize Claim for {this.props.claim.hydroId}
        </Button>
        <Typography variant='body1' gutterBottom align="center" color="textPrimary">
          {this.state.message}
        </Typography>
      </form>
    )
  }
}

export default withWeb3(FinalizeClaim)
