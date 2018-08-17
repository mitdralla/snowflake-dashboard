import React, { Component } from 'react';
import { withWeb3 } from 'web3-webpacked-react';
import { TextField, Typography, Button } from '@material-ui/core';

import { getContract, linkify } from '../common/utilities'

class Snowflake extends Component {
  constructor(props) {
    super(props)

    this.getContract = getContract.bind(this)
    this.linkify = linkify.bind(this)
  }

  // claimSnowflake = event => {
  //   this.setState({message: 'Preparing Transaction'})
  //
  //   let method = this.getContract('clientRaindrop').methods.signUpUser(this.state.hydroId)
  //   this.props.w3w.sendTransaction(method, {
  //     error: (error, message) => {
  //       console.error(error.message)
  //       this.setState({message: 'Transaction Error'})
  //     },
  //     transactionHash: (transactionHash) => {
  //       this.setState({message: this.linkify('transaction', transactionHash, 'Pending', 'body1')})
  //     },
  //     confirmation: (confirmationNumber, receipt) => {
  //       if (confirmationNumber === 0) {
  //         this.setState({message: this.linkify('transaction', receipt.transactionHash, 'Success!', 'body1')})
  //         this.props.getHydroId()
  //       }
  //     }
  //   })
  // };

  render() {
    // <form noValidate autoComplete="off" align="center">
    //   <TextField
    //     id="required"
    //     label="Hydro ID"
    //     helperText="This will be your public identifier."
    //     margin="normal"
    //     value={this.state.hydroId}
    //     onChange={this.handleChange}
    //   />
    //   <Button variant="contained" color="primary" onClick={this.claimHydroId}>
    //     Claim Hydro ID
    //   </Button>
    //   <Typography variant='body1' gutterBottom align="center" color="textPrimary">
    //     {this.state.message}
    //   </Typography>
    // </form>
    return (
      <div>
        <Typography variant='display1' gutterBottom align="center" color="textPrimary">
          Snowflake Detected!
        </Typography>
      </div>
    )
  }
}

export default withWeb3(Snowflake)
