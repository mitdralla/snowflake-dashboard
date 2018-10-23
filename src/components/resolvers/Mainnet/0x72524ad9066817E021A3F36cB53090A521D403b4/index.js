import React, { Component } from 'react';
import { TextField, Typography, Button } from '@material-ui/core';
import { withWeb3 } from 'web3-webpacked-react';

import TransactionButton from '../../../TransactionButton'

export { default as logo } from './logo.png'

class Status extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentStatus: '',
      newStatus: '',
      lookupStatus: '',
      lookupHydroId: ''
    }
  }

  getCurrentStatus = () => {
    this.props.resolverContract.methods.getStatus(this.props.hydroId).call()
      .then(status => {
        this.setState({currentStatus: status})
      })
  }

  componentDidMount() {
    this.getCurrentStatus()
  }

  lookupStatus = async () => {
    const hasHydroId = await this.props.snowflakeContract.methods.getDetails(this.state.lookupHydroId).call()
      .then(details => {
        if (details.ownedAddresses.length === 0) {
          return false
        } else {
          return true
        }
      })

    if (hasHydroId) {
      this.props.resolverContract.methods.getStatus(this.state.lookupHydroId).call()
        .then(status => {
          if (status === '') {
            this.setState({lookupStatus: 'Hydro ID has not added the Status Resolver'})
          } else {
            this.setState({lookupStatus: status})
          }
        })
    } else {
      this.setState({lookupStatus: 'Hydro ID does not exist'})
    }
  }

  render() {
    return (
      <div>
        <Typography variant='display1' gutterBottom align="center" color="textPrimary">
          {this.state.currentStatus}
        </Typography>


        <form noValidate autoComplete="off">
          <TextField
            label="New Status"
            helperText="This will be public."
            margin="normal"
            value={this.state.newStatus}
            onChange={e => this.setState({newStatus: e.target.value})}
            fullWidth
          />
          <TransactionButton
            buttonInitial='Set New Status'
            method={() => this.props.resolverContract.methods.setStatus(this.state.newStatus)}
            onConfirmation={() => {
              this.getCurrentStatus()
            }}
          />
        </form>

        <hr style={{marginTop: 30, marginBottom: 30}}/>

        <Typography variant='display1' gutterBottom align="center" color="textPrimary">
          {this.state.lookupStatus}
        </Typography>

        <form noValidate autoComplete="off">
          <TextField
            label="Hydro Id"
            helperText="View a Hydro ID's status."
            margin="normal"
            value={this.state.lookupHydroId}
            onChange={e => this.setState({lookupHydroId: e.target.value})}
            fullWidth
          />
        <Button variant='contained' color='primary' onClick={this.lookupStatus}>
            Lookup
          </Button>
        </form>
      </div>
    );
  }
}

export default withWeb3(Status);

export const ABI = [{"constant":true,"inputs":[{"name":"hydroId","type":"string"}],"name":"getStatus","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"snowflakeDescription","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"status","type":"string"}],"name":"setStatus","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"snowflakeName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"callOnRemoval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"}],"name":"setSnowflakeAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"callOnSignUp","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"snowflakeAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"hydroId","type":"string"},{"name":"allowance","type":"uint256"}],"name":"onSignUp","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"snowflakeAddress","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"hydroId","type":"string"},{"indexed":false,"name":"status","type":"string"}],"name":"StatusUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"}] // eslint-disable-line

export const requiredAllowance = "1"
