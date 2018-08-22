import React, { Component } from 'react';
import { withWeb3 } from 'web3-webpacked-react';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';
import { Button, TextField, Typography, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

import { getContract, linkify } from '../common/utilities'

class SnowflakeAddresses extends Component {
  constructor(props) {
    super(props)

    this.state = {
      address: '',
      claimMessage: '',
      unclaimMessages: {}
    }

    this.linkify = linkify.bind(this)
    this.getContract = getContract.bind(this)
    this.initiateAddressClaim = this.initiateAddressClaim.bind(this)
  }

  getRows() {
    return this.props.ownedAddresses.map((address, index) => {
      return {id: index, address: address, owner: this.props.owner === address}
    })
  }

  initiateAddressClaim(hydroId) {
    this.setState({claimMessage: 'Preparing Transaction.'})

    // get a secret value
    const randomValues = new Uint32Array(1)
    window.crypto.getRandomValues(randomValues)

    let hashedSecret = this.props.w3w.web3js.utils.sha3(randomValues[0].toString())

    let address = this.state.address.toLowerCase()

    let claim = this.props.w3w.web3js.utils.soliditySha3(address, hashedSecret, this.props.hydroId)

    let details = {
      hashedSecret: hashedSecret,
      hydroId: this.props.hydroId,
      address: address
    }

    this.props.w3w.sendTransaction(this.getContract('snowflake').methods.initiateClaim(claim), {
      error: (error, message) => {
        console.error(error.message)
        this.setState({claimMessage: 'Transaction Error'})
      },
      transactionHash: (transactionHash) => {
        this.props.addClaim(address, details)
        this.setState({claimMessage: this.linkify('transaction', transactionHash, 'Pending', 'body1')})
      },
      confirmation: (confirmationNumber, receipt) => {
        if (confirmationNumber === 0) {
          this.setState({claimMessage: `Success! Please switch to ${address} finalize your claim.`})
        }
      }
    })
  }

  unclaim(address) {
    this.setState(oldState => {
      return { unclaimMessages: {...oldState.unclaimMessages, [address]: 'Preparing Transaction'} }
    })

    this.props.w3w.sendTransaction(this.getContract('snowflake').methods.unclaim([address]), {
      error: (error, message) => {
        console.error(error.message)
        this.setState(oldState => {
          return { unclaimMessages: {...oldState.unclaimMessages, [address]: 'Transaction Error'} }
        })
      },
      transactionHash: (transactionHash) => {
        this.setState(oldState => {
          return { unclaimMessages:
            {...oldState.unclaimMessages, [address]: this.linkify('transaction', transactionHash, 'Pending', 'body1')}
          }
        })
      },
      confirmation: (confirmationNumber, receipt) => {
        if (confirmationNumber === 0) {
          this.props.getAccountDetails(true)
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
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.getRows().map(row => {
              return (
                <TableRow key={row.id}>
                  <TableCell>{this.linkify('address', row.address, undefined, 'body1')}</TableCell>
                  <TableCell>{row.owner ? 'True' : 'False'}</TableCell>
                  <TableCell>
                  {row.owner ?
                    '' :
                    <IconButton onClick={() => this.unclaim(row.address)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                  <Typography variant='body1' gutterBottom align="center" color="textPrimary">
                    {this.state.unclaimMessages[row.address]}
                  </Typography>
                  </TableCell>
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
            {this.state.claimMessage}
          </Typography>
        </form>
      </div>
    )
  }
}

export default withWeb3(SnowflakeAddresses)
