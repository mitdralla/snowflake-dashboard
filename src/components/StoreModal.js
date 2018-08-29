import React, { Component } from 'react';
import { withWeb3 } from 'web3-webpacked-react';
import { Button, TextField, Typography, GridList, GridListTile, GridListTileBar } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Modal from './Modal';
import AddIcon from '@material-ui/icons/Add';
import DoneIcon from '@material-ui/icons/Done';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import { getContract, getAllResolvers, getResolverData, linkify } from '../common/utilities'

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 618,
    height: 618,
  },
  subheader: {
    width: '100%',
  },
  icon: {
    color: 'rgba(255, 255, 255, 1)',
  },
});

class StoreModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      resolverAddress: '',
      allowance: '',
      whitelistResolverAddress: '',
      whitelistResolverMessage: '',
      resolvers: [],
      open: false
    };

    this.getContract = getContract.bind(this)
    this.linkify = linkify.bind(this)
    this.getAllResolvers = getAllResolvers.bind(this)
    this.getResolverData = getResolverData.bind(this)
  }

  handleClose = (event, reason) => {
    this.setState({ open: false });
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
    const addedResolvers = this.props.addedResolvers

    var resolverMap = this.getAllResolvers().map(resolver => {
      return this.getResolverData(resolver)
    })

    Promise.all(resolverMap).then( result => {
      let resultLength = result.length
      let addedResolverLength =  addedResolvers.length
      for (var i = 0; i < resultLength; i++)  {
        result[i].added = 0
        for (var j = 0; j < addedResolverLength; j++){
          if (result[i].address === addedResolvers[j]){
            result[i].added = 1
          }
        }
      }

      this.setState({resolvers: result})
    })
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Modal
          opener={(props) => {
            return (
              <Button variant="fab" color="primary" {...props}>
                <AddIcon />
              </Button>
            )
          }}
        >
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
          <div className={classes.root}>
            <GridList className={classes.gridList} spacing={6} cellHeight={200} cols={3}>
              {this.state.resolvers.map( resolver => (
                <GridListTile
                  cols={1}
                  key={resolver.address}
                  onClick={
                    () => {resolver.added === 0 ?
                            this.setState({resolverAddress: resolver.address}) :
                            this.setState({open: true, resolverAddress: ''})}
                  }
                >
                  <img src={require("../../public/assets/resolvers/" + resolver.logo)} alt={resolver.name}/>
                  <GridListTileBar
                    title={resolver.name}
                    subtitle={<span>{resolver.description}</span>}
                    actionIcon={
                      <DoneIcon style={resolver.added === 1 ? {} : { display: 'none' }} className={classes.icon}/>
                    }
                  />
                </GridListTile>
              ))}
            </GridList>
          </div>

          <div>
            <Snackbar
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              open={this.state.open}
              autoHideDuration={5000}
              onClose={this.handleClose}
              ContentProps={{
                'aria-describedby': 'message-id',
              }}
              message={<span id="message-id">This resolver is already added.</span>}
              action={[
                <IconButton
                  key="close"
                  aria-label="Close"
                  color="inherit"
                  className={classes.close}
                  onClick={this.handleClose}
                >
                  <CloseIcon />
                </IconButton>,
              ]}
            />
          </div>

        </Modal>
      </div>
    );
  }
}

export default withWeb3(withStyles(styles)(StoreModal));
