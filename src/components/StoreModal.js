import React, { Component } from 'react';
import { withWeb3 } from 'web3-webpacked-react';
import { Button, TextField } from '@material-ui/core';
import Modal from './Modal';
import AddIcon from '@material-ui/icons/Add';

import TransactionButton from './TransactionButton'
import { getContract } from '../common/utilities'

class StoreModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      resolverAddress: '',
      whitelistResolverAddress: '',
      allowance: ''
    };

    this.getContract = getContract.bind(this)
  }

  render() {
    const addButton = props => {
      return (
        <Button variant="fab" color="primary" {...props}>
          <AddIcon />
        </Button>
      )
    }

    return (
      <div>
        <Modal
          fullScreen
          opener={addButton}
          title='dApp Store'
        >
          <form noValidate autoComplete="off">
            <TextField
              label="Resolver Address"
              helperText="The resolver smart contract address."
              margin="normal"
              value={this.state.whitelistResolverAddress}
              onChange={e => {this.setState({whitelistResolverAddress: e.target.value})} }
              fullWidth
            />

            <TransactionButton
              buttonInitial='Whitelist Resolver'
              method={this.getContract('snowflake').methods.whitelistResolver(this.state.whitelistResolverAddress)}
            />
          </form>

          <form noValidate autoComplete="off">
            <TextField
              label="Resolver Address"
              helperText="The resolver smart contract address."
              margin="normal"
              value={this.state.resolverAddress}
              onChange={e => {this.setState({resolverAddress: e.target.value})} }
              fullWidth
            />
            <TextField
              label="Allowance"
              type="number"
              helperText="The amount of Hydro this resolver may withdraw on your behalf."
              margin="normal"
              value={this.state.allowance}
              onChange={e => {this.setState({allowance: e.target.value})} }
              fullWidth
            />

            <TransactionButton
              buttonInitial='Set Resolver'
              method={this.getContract('snowflake').methods.addResolvers(
                [this.state.resolverAddress], [this.props.w3w.fromDecimal(this.state.allowance, 18)]
              )}
              onConfirmation={() => this.props.getAccountDetails(true)}
            />
          </form>
        </Modal>
      </div>
    )
  }
}

export default withWeb3(StoreModal);
