import React, { Component } from 'react';
import { withWeb3 } from 'web3-webpacked-react';
import { withRouter } from 'react-router'

import TransactionButton from './TransactionButton'
import { getContract } from '../common/utilities'
import { withStyles } from '@material-ui/core/styles';
import { Typography, TextField } from '@material-ui/core';
import { Snackbar, SnackbarContent } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const styles = theme => ({
  snackbar: {
    maxWidth: '45%'
  },
  success: {
    backgroundColor: theme.palette.success.main
  },
  warning: {
    backgroundColor: theme.palette.error.main
  }
})

class FinalizeClaim extends Component {
  constructor(props) {
    super(props)

    this.state = {
      finalizeSecret:  '',
      finalizeHydroId: '',
      claimAddress:    '',
      claimSnackbar:   false,
      addressSnackbar: false
    }

    const state = this.props.location.state || {}
    if (state.address || state.secret || state.hydroId) {
      this.state.finalizeSecret  = state.secret  || ''
      this.state.finalizeHydroId = state.hydroId || ''
      this.state.claimSnackbar   = true

      this.setFromURL = true

      if (this.props.w3w.account.toLowerCase() !== state.address.toLowerCase()) {
        this.finalizeAddress = state.address || ''
        this.state.addressSnackbar = true
      }
    }

    // get random value
    const randomValues = new Uint32Array(1)
    window.crypto.getRandomValues(randomValues)
    this.hashedSecret = this.props.w3w.web3js.utils.sha3(randomValues[0].toString())

    this.getContract = getContract.bind(this)
  }

  componentDidMount() {
    // try to get claim from session storage
    if (!this.setFromURL && this.getClaim()) {
      this.setState({
        finalizeSecret:  this.getClaim().secret,
        finalizeHydroId: this.getClaim().hydroId,
        claimSnackbar:   true
      })

      if (this.getClaim().address.toLowerCase() !== this.props.w3w.account.toLowerCase()) {
        this.finalizeAddress = this.getClaim().address
        this.setState({addressSnackbar: true})
      }
    }
  }

  getClaimKey() {
    return this.getContract('snowflake')._address
  }

  getClaim() {
    let claim = sessionStorage.getItem(this.getClaimKey())
    return claim ? JSON.parse(claim) : null
  }

  setClaim(address, secret, hydroId) {
    const claim = {address: address, secret: secret, hydroId: hydroId}
    sessionStorage.setItem(this.getClaimKey(), JSON.stringify(claim))
  }

  removeClaim() {
    sessionStorage.removeItem(this.getClaimKey())
  }

  updateLocalClaim() {
    const { claimAddress } = this.state
    const { hydroId } = this.props
    const claim = this.props.w3w.web3js.utils.soliditySha3(claimAddress.toLowerCase(), this.hashedSecret, hydroId)
    this.claim = {address: claimAddress, secret: this.hashedSecret, hydroId: hydroId, claim: claim}
  }

  render() {
    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          className={this.props.classes.snackbar}
          open={this.state.claimSnackbar}
          autoHideDuration={8000}
          onClose={() => this.setState({ claimSnackbar: false })}
        >
          <SnackbarContent
            className={this.props.classes.success}
            message={<p>We{"'"}ve detected a claim and pre-filled the information above!</p>}
            action={[
              <IconButton
                key="close"
                color="inherit"
                onClick={() => this.setState({claimSnackbar: false})}
              >
                <CloseIcon />
              </IconButton>
            ]}
          />
        </Snackbar>

        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          className={this.props.classes.snackbar}
          open={this.state.addressSnackbar}
          onClose={(e, reason) => reason === "clickaway" ? null : this.setState({ addressSnackbar: false })}
        >
          <SnackbarContent
            className={this.props.classes.warning}
            message={<p>Please switch to {this.finalizeAddress} to finalize your claim.</p>}
          />
        </Snackbar>


        <Typography variant='display1' gutterBottom color="textPrimary">
          Finalize a Claim
        </Typography>

        <Typography variant='body2' gutterBottom color="textPrimary">
          Click below to finalize linking an address to your Snowflake.
        </Typography>

        <TextField
          label='Hydro ID'
          helperText='Your Hydro ID.'
          margin="normal"
          value={this.state.finalizeHydroId}
          onChange={e => this.setState({finalizeHydroId: e.target.value})}
          fullWidth
        />

        <TextField
          label='Secret'
          helperText='A secret value.'
          type="password"
          margin="normal"
          value={this.state.finalizeSecret}
          onChange={e => this.setState({finalizeSecret: e.target.value})}
          fullWidth
        />

        <TransactionButton
          buttonInitial='Finalize Claim'
          method={() => this.getContract('snowflake').methods.finalizeClaim(
            this.getClaim().secret, this.getClaim().hydroId
          )}
          onConfirmation={() => {
            this.props.removeClaim()
            this.props.getAccountDetails()
          }}
        />

        <Typography variant='display1' gutterBottom color="textPrimary" style={{marginTop: 20}}>
          Claiming a New Address?
        </Typography>

        <form noValidate autoComplete="off">
          <TextField
            label='Address'
            helperText='Must be able to transact from this address'
            margin="normal"
            value={this.state.claimAddress}
            onChange={e => {
              this.setState({claimAddress: e.target.value}, this.updateLocalClaim)
            }}
            fullWidth
          />
          <TransactionButton
            onTransactionHash={() => {
              this.finalizeAddress = this.claim.address
            }}
            onConfirmation={() => {
              this.setState({addressSnackbar: true})
            }}
            buttonInitial='Initiate Claim'
            method={() => {
              this.setClaim(this.claim.address, this.claim.secret, this.claim.hydroId)
              return this.getContract('snowflake').methods.initiateClaim(this.claim.claim)}
            }
          />
        </form>
      </div>
    )
  }
}

export default withStyles(styles)(withRouter(withWeb3(FinalizeClaim)))
