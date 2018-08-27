import React, { Component } from 'react';
import { withWeb3 } from 'web3-webpacked-react';
import { Button, TextField, Typography, GridList, GridListTile, GridListTileBar } from '@material-ui/core';
import Modal from 'react-modal';
import AddIcon from '@material-ui/icons/Add';

import { getContract, getAllResolvers, getResolverData, linkify } from '../common/utilities'

Modal.setAppElement('#root')

class StoreModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false,
      message: '',
      resolverAddress: '',
      allowance: '',
      whitelistResolverAddress: '',
      whitelistResolverMessage: '',
      resolvers: []
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.getContract = getContract.bind(this)
    this.linkify = linkify.bind(this)
    this.getAllResolvers = getAllResolvers.bind(this)
    this.getResolverData = getResolverData.bind(this)
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  whitelistResolver = () => {
    this.setState({whitelistResolverMessage: 'Preparing Transaction'})

    let method = this.getContract('snowflake').methods.whitelistResolver(this.state.whitelistResolverAddress)
    this.props.w3w.sendTransaction(method, {
      error: (error, message) => {
        console.error(error.message)
        this.setState({whitelistResolverMessage: 'Transaction Error'})
      },
      transactionHash: (transactionHash) => {
        this.setState({whitelistResolverMessage: this.linkify('transaction', transactionHash, 'Pending', 'body1')})
      },
      confirmation: (confirmationNumber, receipt) => {
        if (confirmationNumber === 0) {
          this.setState({whitelistResolverMessage: 'Success!'})
        }
      }
    })
  }

  setResolver = () => {
    this.setState({message: 'Preparing Transaction'})

    let method = this.getContract('snowflake').methods.addResolvers(
      [this.state.resolverAddress], [this.props.w3w.fromDecimal(this.state.allowance, 18)]
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
  }

  componentDidMount = () => {
    this.loadResolvers()
  }

  loadResolvers = () => {
    var resolverMap = this.getAllResolvers().map(resolver => {
      return this.getResolverData(resolver)
    })

    Promise.all(resolverMap).then( result => {
      // console.log(result)
      this.setState({resolvers: result})
    })
  }

  render() {
    return (
      <React.Fragment>
        <Button variant="fab" color="primary" onClick={this.openModal}>
          <AddIcon />
        </Button>

        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          contentLabel={this.props.resolver}
        >
          <React.Fragment>
            <form noValidate autoComplete="off" align="center">
              <TextField
                id="required"
                label="Resolver Address"
                helperText="The resolver smart contract address."
                margin="normal"
                value={this.state.whitelistResolverAddress}
                onChange={e => {this.setState({whitelistResolverAddress: e.target.value})} }
              />
              <Button variant="contained" color="primary" onClick={this.whitelistResolver}>
                Whitelist Resolver
              </Button>
              <Typography variant='body1' gutterBottom align="center" color="textPrimary">
                {this.state.whitelistResolverMessage}
              </Typography>
            </form>

            <form noValidate autoComplete="off" align="center">
              <TextField
                id="required"
                label="Resolver Address"
                helperText="The resolver smart contract address."
                margin="normal"
                value={this.state.resolverAddress}
                onChange={e => {this.setState({resolverAddress: e.target.value})} }
              />
              <TextField
                id="required"
                label="Allowance"
                type="number"
                helperText="The amount of Hydro this resolver may withdraw on your behalf."
                margin="normal"
                value={this.state.allowance}
                onChange={e => {this.setState({allowance: e.target.value})} }
              />
              <Button variant="contained" color="primary" onClick={this.setResolver}>
                Set Resolver
              </Button>
              <Typography variant='body1' gutterBottom align="center" color="textPrimary">
                {this.state.message}
              </Typography>
            </form>
            <Button variant="outlined" onClick={this.closeModal}>Close</Button>
          </React.Fragment>
          <div>
            <GridList cellHeight={180}>
              {this.state.resolvers.map( resolver => (
                <GridListTile key={resolver.address} onClick={() => {this.setState({resolverAddress: resolver.address})}}>
                  <GridListTileBar
                    title={resolver.name}
                    subtitle={<span>{resolver.description}</span>}
                  />
                </GridListTile>
              ))}
            </GridList>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

export default withWeb3(StoreModal);
