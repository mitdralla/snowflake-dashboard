import React, { Component } from 'react';
import { TextField, Typography } from '@material-ui/core';
import { withWeb3 } from 'web3-webpacked-react';

import TransactionButton from '../TransactionButton'

class ResolverView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentStatus: '',
      newStatus: ''
    }
  }

  getCurrentStatus() {
    this.props.resolverContract.methods.getStatus(this.props.hydroId).call()
      .then(status => {
        this.setState({currentStatus: status})
      })
  }

  componentDidMount() {
    this.getCurrentStatus()
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
            onTransactionHash={() => {
              this.getCurrentStatus()
            }}
          />
        </form>
      </div>
    );
  }
}

export default withWeb3(ResolverView);
