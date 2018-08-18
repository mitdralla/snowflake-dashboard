import React, { Component } from 'react';
import { withWeb3 } from 'web3-webpacked-react';
import { Table, TableHead, TableBody, TableRow, TableCell, Button, TextField, Typography } from '@material-ui/core';

import { getContract, linkify } from '../common/utilities'

class SnowflakeAddresses extends Component {
  constructor(props) {
    super(props)

    const rows = this.props.ownedAddresses.map((address, index) => {
      return {id: index, address: address, owner: this.props.owner === address}
    })

    this.state = {
      address: '',
      message: '',
      rows: rows
    }

    this.linkify = linkify.bind(this)
    this.getContract = getContract.bind(this)
    this.initiateAddressClaim = this.initiateAddressClaim.bind(this)
  }

  initiateAddressClaim(hydroId) {
    // get a secret value
    const randomValues = new Uint32Array(1)
    window.crypto.getRandomValues(randomValues)

    let hashedSecret = this.props.w3w.web3js.utils.sha3(randomValues[0].toString())

    let address = this.state.address.toLowerCase()

    let claim = this.props.w3w.web3js.utils.soliditySha3(address, hashedSecret, this.props.hydroId)

    let details = {
      hashedSecret: hashedSecret,
      hydroId: this.props.hydroId
    }

    this.props.w3w.sendTransaction(this.getContract('snowflake').methods.initiateClaim(claim), {
      error: (error, message) => {
        console.error(error.message)
        this.setState({message: 'Transaction Error'})
      },
      transactionHash: (transactionHash) => {
        this.props.addClaim(address, details)
        this.setState({message: this.linkify('transaction', transactionHash, 'Pending', 'body1')})
      },
      confirmation: (confirmationNumber, receipt) => {
        if (confirmationNumber === 0) {
          this.setState({message: `Success! Please switch to ${address} finalize your claim.`})
        }
      }
    })
  }

  handleChange = event => {
    this.setState({address: event.target.value});
  };

  render() {
    return (
      <div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Address</TableCell>
              <TableCell>Owner</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.rows.map(row => {
              return (
                <TableRow key={row.id}>
                  <TableCell>{this.linkify('address', row.address, undefined, 'body1')}</TableCell>
                  <TableCell>{row.owner ? 'True' : 'False'}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <form noValidate autoComplete="off" align="center">
          <TextField
            id="required"
            label="Address"
            helperText="You must be able to transact from this address."
            margin="normal"
            value={this.state.address}
            onChange={this.handleChange}
          />
          <Button variant="contained" color="primary" onClick={this.initiateAddressClaim}>
            Claim
          </Button>
          <Typography variant='body1' gutterBottom align="center" color="textPrimary">
            {this.state.message}
          </Typography>
        </form>
      </div>
    )
  }
}

export default withWeb3(SnowflakeAddresses)
