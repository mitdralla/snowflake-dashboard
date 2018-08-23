import React, { Component } from 'react';
import { TextField, Typography, Button } from '@material-ui/core';
import { withWeb3 } from 'web3-webpacked-react';

import { linkify } from '../../common/utilities'

class ResolverView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentStatus: '',
      newStatus: '',
      message: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.linkify = linkify.bind(this)
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

  handleSubmit(event) {
    event.preventDefault();
    this.sendTransaction()
  }

  sendTransaction() {
    let method = this.props.resolverContract.methods.setStatus(this.state.newStatus)

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
          this.setState({message: 'Success!'})
          this.getCurrentStatus()
        }
      }
    })
  }

  render() {
    return (
      <div>
        <Typography variant='display2' gutterBottom align="center" color="textPrimary">
          Current Status
        </Typography>
        <Typography variant='body1' gutterBottom align="center" color="textPrimary">
          {this.state.currentStatus}
        </Typography>

        <form noValidate autoComplete="off" align="center">
          <TextField
            id="required"
            label="Status"
            helperText="This will be public."
            margin="normal"
            value={this.state.newStatus}
            onChange={e => this.setState({newStatus: e.target.value})}
          />
          <Button variant="contained" color="primary" onClick={this.handleSubmit}>
            Set New Status
          </Button>
          <Typography variant='body1' gutterBottom align="center" color="textPrimary">
            {this.state.message}
          </Typography>
        </form>
      </div>
    );
  }
}

export default withWeb3(ResolverView);
