import React, { Component } from 'react';
import { withWeb3 } from 'web3-webpacked-react';
import { TextField, GridList, GridListTile, GridListTileBar } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import DoneIcon from '@material-ui/icons/Done';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import TransactionButton from './TransactionButton'
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

class DAppStore extends Component {
  constructor(props) {
    super(props);

    this.state = {
      resolverAddress: '',
      allowance: '',
      resolvers: [],
      open: false
    };

    this.getContract = getContract.bind(this)
    this.linkify = linkify.bind(this)
    this.getAllResolvers = getAllResolvers.bind(this)
    this.getResolverData = getResolverData.bind(this)
  }

  componentDidMount = () => {
    this.loadResolvers()
  }

  loadResolvers = async () => {
    const { addedResolvers } = this.props

    const resolvers = await this.getAllResolvers()

    Promise.all(
      resolvers.map(resolver => {
        return this.getResolverData(resolver, this.props.hydroId)
      })
    )
      .then(result => {
        let resultLength = result.length
        let addedResolverLength = addedResolvers.length
        for (var i = 0; i < resultLength; i++)  {
          result[i].added = 0
          for (var j = 0; j < addedResolverLength; j++) {
            if (result[i].address === addedResolvers[j]) {
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
            onConfirmation={this.props.getAccountDetails}
            />
        </form>
        <div className={classes.root}>
          <GridList className={classes.gridList} spacing={6} cellHeight={200} cols={3}>
            {this.state.resolvers.map(resolver => (
              <GridListTile
                style={{cursor: 'pointer'}}
                cols={1}
                key={resolver.address}
                onClick={
                  () => {resolver.added === 0 ?
                    this.setState({resolverAddress: resolver.address, allowance: resolver.requiredAllowance}) :
                    this.setState({open: true, resolverAddress: '', allowance: ''})}
                  }
                  >
                  <img src={resolver.logo} alt={resolver.name}/>
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
              onClose={() => this.setState({ open: false })}
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
                  onClick={() => this.setState({open: false})}
                  >
                  <CloseIcon />
                </IconButton>,
              ]}
              />
          </div>
        </div>
      )
    }
  }

  export default withWeb3(withStyles(styles)(DAppStore));
