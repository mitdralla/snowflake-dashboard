import React, { Component } from 'react';
import { withWeb3 } from 'web3-webpacked-react';
import { Typography, Button } from '@material-ui/core';

import { getContract, linkify } from '../common/utilities'

class NoSnowflake extends Component {
  constructor(props) {
    super(props)

    this.state = {
      message: ''
    }

    this.getContract = getContract.bind(this)
    this.linkify = linkify.bind(this)
  }

  claimSnowflake = event => {
    this.setState({message: 'Preparing Transaction'})

    let method = this.getContract('snowflake').methods.mintIdentityToken()
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
  };

  render() {
    return (
      <div>
        <Typography variant='display1' gutterBottom align="center" color="textPrimary">
          No Snowflake Detected
        </Typography>
        <Typography variant='body1' gutterBottom align="center" color="textPrimary">
          You have a HydroID, but have not minted a Snowflake identity yet. Please do so below.
        </Typography>

        <form noValidate autoComplete="off" align="center">
          <Button variant="contained" color="primary" onClick={this.claimSnowflake}>
            Claim Snowflake
          </Button>
          <Typography variant='body1' gutterBottom align="center" color="textPrimary">
            {this.state.message}
          </Typography>
        </form>
      </div>
    )
  }
}

export default withWeb3(NoSnowflake)
