import React, { Component } from 'react';
import { TextField, Typography, Button } from '@material-ui/core';
import { withWeb3 } from 'web3-webpacked-react';

import TransactionButton from '../../TransactionButton'

class ResolverView extends Component {
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
            method={this.props.resolverContract.methods.setStatus(this.state.newStatus)}
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

export default withWeb3(ResolverView);
