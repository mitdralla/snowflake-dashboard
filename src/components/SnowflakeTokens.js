import React, { Component } from 'react';
import { withWeb3 } from 'web3-webpacked-react';
import { TextField, Typography, Button } from '@material-ui/core';

import { getContract, linkify } from '../common/utilities'

class SnowflakeTokens extends Component {
  constructor(props) {
    super(props)

    this.state = {
      amount: '',
      message: ''
    }

    this.linkify = linkify.bind(this)
    this.getContract = getContract.bind(this)
  }

  handleChange = event => {
    this.setState({amount: event.target.value});
  };

  depositHydro = event => {
    this.setState({message: 'Preparing Transaction'})

    const amount = this.props.w3w.fromDecimal(String(this.state.amount), 18)

    const method = this.getContract('token').methods.approveAndCall(
      this.getContract('snowflake')._address, amount, '0x00'
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
          this.props.getAccountDetails(true)
        }
      }
    })
  };

  render() {
    return (
      <div>
        <form noValidate autoComplete="off" align="center">
          <TextField
            id="required"
            label="Amount"
            type="number"
            helperText="Number of Hydro tokens to deposit."
            margin="normal"
            value={this.state.amount}
            onChange={this.handleChange}
          />
        <Button variant="contained" color="primary" onClick={this.depositHydro}>
            Deposit Hydro
          </Button>
          <Typography variant='body1' gutterBottom align="center" color="textPrimary">
            {this.state.message}
          </Typography>
        </form>
      </div>
    )
  }
}

export default withWeb3(SnowflakeTokens)
