import React, { Component } from 'react';
import { withWeb3 } from 'web3-webpacked-react';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

import TransactionForm from './TransactionForm'

import { getContract, linkify } from '../common/utilities'

class SnowflakeAddresses extends Component {
  constructor(props) {
    super(props)

    this.state = {
      addressToClaim: ''
    }

    // get random value
    const randomValues = new Uint32Array(1)
    window.crypto.getRandomValues(randomValues)
    this.hashedSecret = this.props.w3w.web3js.utils.sha3(randomValues[0].toString())
    this.details = {
      hashedSecret: this.hashedSecret
    }

    this.getContract = getContract.bind(this)
    this.linkify = linkify.bind(this)
  }

  getRows() {
    return this.props.ownedAddresses.map((address, index) => {
      return {id: index, address: address, owner: this.props.owner === address}
    })
  }

  updateClaim = (address) => {
    this.claim = this.props.w3w.web3js.utils.soliditySha3(address.toLowerCase(), this.hashedSecret, this.props.hydroId)
    this.details = {...this.details,
      hydroId: this.props.hydroId,
      address: address.toLowerCase()
    }
  }

  render() {
    return (
      <div style={{width: "100%"}}>
        <div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Address</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.getRows().map(row => {
                return (
                  <TableRow key={row.id}>
                    <TableCell>{this.linkify('address', row.address, undefined, 'body1')}</TableCell>
                    <TableCell>{row.owner ? 'True' : 'False'}</TableCell>
                    <TableCell style={{textAlign: 'center'}}>
                    {row.owner ?
                      '' :
                      <TransactionForm
                        fields={[]}
                        buttonInitial={<DeleteIcon />}
                        method={this.getContract('snowflake').methods.unclaim}
                        methodArgs={[{value: [row.address]}]}
                        onConfirmation={() => this.props.getAccountDetails(true)}
                      />
                    }
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        <div>
          <TextField
            label='Address'
            helperText='Must be able to transact from this address'
            margin="normal"
            value={this.state.addressToClaim}
            onChange={(e) => {
              this.setState({addressToClaim: e.target.value})
              this.updateClaim(e.target.value)
            }}
            fullWidth
          />
          <TransactionForm
            fields={[]}
            buttonInitial='Initiate Claim'
            method={this.getContract('snowflake').methods.initiateClaim}
            methodArgs={[{value: this.claim}]}
            onTransactionHash={() => {
              this.props.addClaim(this.details.address, this.details)
            }}
          />
        </div>
      </div>
    )
  }
}

export default withWeb3(SnowflakeAddresses)
