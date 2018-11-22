import React from 'react';
import { withRouter } from 'react-router'
import { withStyles } from '@material-ui/core/styles';

import { Typography } from '@material-ui/core';
// import { Button, TextField } from '@material-ui/core';
// import { Snackbar, SnackbarContent } from '@material-ui/core';
// import IconButton from '@material-ui/core/IconButton';
// import CloseIcon from '@material-ui/icons/Close';
// import DeleteIcon from '@material-ui/icons/Delete';
// import FileCopyIcon from '@material-ui/icons/FileCopy';
// import { Link } from 'react-router-dom'
//
// import TransactionButton from '../common/TransactionButton'
// import Copyable from '../common/Copyable'
// import { getContract } from '../../common/utilities'

const styles = theme => ({
  snackbar: {
    maxWidth: '45%'
  },
  success: {
    backgroundColor: theme.palette.success.main
  },
  warning: {
    backgroundColor: theme.palette.error.main
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  close: {
    marginLeft: theme.spacing.unit / 2
  },
  white: {
    color: "white"
  }
})

export default withStyles(styles)(withRouter(function FinalizeClaim () {
  return (
    <Typography variant='display1' gutterBottom color="textPrimary">
      Coming soon!
    </Typography>
  )
}))
//
//   this.state = {
//     finalizeAddress: '',
//     finalizeSecret:  '',
//     finalizeHydroId: '',
//     claimAddress:    '',
//     activeClaim:     undefined,
//     claimSnackbar:   false,
//     addressSnackbar: false
//   }
//
//   const state = this.props.location.state || {}
//   const claim = this.getClaim()
//
//   // try to set state from url
//   if (state.address || state.secret || state.hydroId)
//     this.state = {
//       ...this.state,
//       finalizeAddress: state.address,
//       finalizeSecret:  state.secret,
//       finalizeHydroId: state.hydroId,
//       activeClaim:     {address: state.address, secret: state.secret, hydroId: state.hydroId},
//       claimSnackbar:   true
//     }
//   // try to get claim from session storage
//   else if (claim)
//     this.state = {
//       ...this.state,
//       finalizeAddress: claim.address,
//       finalizeSecret:  claim.secret,
//       finalizeHydroId: claim.hydroId,
//       activeClaim:     claim,
//       claimSnackbar:   true
//     }
//
//   // show snackbar if we need to
//   if (
//     this.state.activeClaim &&
//     (this.props.w3w.account.toLowerCase() !== this.state.finalizeAddress.toLowerCase())
//   )
//     this.state = {
//       ...this.state,
//       addressSnackbar: true
//     }
//
//   // get random value for new claims in case we need it
//   const randomValues = new Uint32Array(1)
//   window.crypto.getRandomValues(randomValues)
//   this.hashedSecret = this.props.w3w.web3js.utils.sha3(randomValues[0].toString())
// }
//
// getClaimKey() {
//   return this.getContract('snowflake')._address
// }
//
// getClaim() {
//   let claim = sessionStorage.getItem(this.getClaimKey())
//   return claim ? JSON.parse(claim) : null
// }
//
// setClaim(address, secret, hydroId) {
//   const claim = {address: address, secret: secret, hydroId: hydroId}
//   sessionStorage.setItem(this.getClaimKey(), JSON.stringify(claim))
// }
//
// removeClaim() {
//   sessionStorage.removeItem(this.getClaimKey())
// }
//
// deleteLocalClaim = () => {
//   this.setState({
//     finalizeAddress: '',
//     finalizeSecret:  '',
//     finalizeHydroId: '',
//     activeClaim:     undefined,
//     claimSnackbar:   false,
//     addressSnackbar: false,
//   })
//
//   this.removeClaim()
//
//   if (this.props.location.state)
//     this.props.history.replace({
//       ...this.props.location,
//       state: {}
//     })
// }
//
// getUrlFromClaim = (claim) => {
//   return !this.state.activeClaim ? '' :
//     [
//       window.location.origin,
//       process.env.PUBLIC_URL,
//       this.props.location.pathname,
//       `/${claim.address}/${claim.secret}/${claim.hydroId}`
//     ].join('')
// }
//
// updateLocalClaim() {
//   const { claimAddress } = this.state
//   const { hydroId } = this.props
//   const claim = this.props.w3w.web3js.utils.soliditySha3(claimAddress.toLowerCase(), this.hashedSecret, hydroId)
//   this.claim = {address: claimAddress, secret: this.hashedSecret, hydroId: hydroId, claim: claim}
// }
//
// render() {
//   const { classes } = this.props
//
//   return (
//     <div>
//       <Snackbar
//         anchorOrigin={{
//           vertical: 'bottom',
//           horizontal: 'left',
//         }}
//         autoHideDuration={10000}
//         className={this.props.classes.snackbar}
//         open={this.state.claimSnackbar}
//         onClose={(e, reason) => reason === "clickaway" ? null : this.setState({ claimSnackbar: false })}
//       >
//         <SnackbarContent
//           className={this.props.classes.success}
//           message={<p>Claim detected! We{"'"}ve pre-filled the fields above.</p>}
//           action={[
//             <Button
//               key="clear"
//               size="small"
//               onClick={this.deleteLocalClaim}
//               className={classes.white}
//             >
//               Delete Claim
//               <DeleteIcon className={classes.rightIcon} />
//             </Button>,
//             <IconButton
//               key="close"
//               color="inherit"
//               className={classes.close}
//               onClick={() => this.setState({claimSnackbar: false})}
//             >
//               <CloseIcon />
//             </IconButton>
//           ]}
//         />
//       </Snackbar>
//
//       {this.props.hydroId ? null :
//         <Button variant="contained" color="primary" component={Link} to="/">Need a Snowflake?</Button>
//       }
//
//       {!this.state.activeClaim ? null :
//         <Snackbar
//           anchorOrigin={{
//             vertical: 'bottom',
//             horizontal: 'right',
//           }}
//           className={this.props.classes.snackbar}
//           open={this.state.addressSnackbar}
//           onClose={(e, reason) => reason === "clickaway" ? null : this.setState({ addressSnackbar: false })}
//         >
//           <SnackbarContent
//             className={this.props.classes.warning}
//             message={
//               <p>
//                 Please switch to {this.state.activeClaim.address}, or visit the link to the right.
//               </p>
//             }
//             action={[
//               <Copyable key="copy" placement="top" value={this.getUrlFromClaim(this.state.activeClaim)}>
//                 <Button
//                   key="clear"
//                   size="small"
//                   className={classes.white}
//                 >
//                   Copy Link
//                   <FileCopyIcon className={classes.rightIcon} />
//                 </Button>
//               </Copyable>
//             ]}
//           />
//         </Snackbar>
//       }
//
//
//       <Typography variant='display1' gutterBottom color="textPrimary">
//         Finalize a Claim
//       </Typography>
//
//       <Typography variant='body2' gutterBottom color="textPrimary">
//         Click below to finalize linking an address to your Snowflake.
//       </Typography>
//
//       <TextField
//         label='Hydro ID'
//         margin="normal"
//         value={this.state.finalizeHydroId}
//         onChange={e => this.setState({finalizeHydroId: e.target.value})}
//         disabled={!!this.state.activeClaim}
//         fullWidth
//       />
//
//       <TextField
//         label='Secret'
//         type="password"
//         margin="normal"
//         value={this.state.finalizeSecret}
//         onChange={e => this.setState({finalizeSecret: e.target.value})}
//         disabled={!!this.state.activeClaim}
//         fullWidth
//       />
//
//       <TransactionButton
//         buttonInitial='Finalize Claim'
//         method={() => this.getContract('snowflake').methods.finalizeClaim(
//           this.getClaim().secret, this.getClaim().hydroId
//         )}
//         onConfirmation={() => {
//           this.removeClaim()
//           this.props.getAccountDetails()
//         }}
//       />
//
//     {!this.props.hydroId || (this.state.activeClaim) ? null :
//       <Fragment>
//         <Typography variant='display1' gutterBottom color="textPrimary" style={{marginTop: 20}}>
//           Claim a New Address
//         </Typography>
//
//         <Typography variant='body2' gutterBottom color="textPrimary">
//           Enter the address you{"'"}d like to claim below.
//         </Typography>
//
//         <form noValidate autoComplete="off">
//           <TextField
//             label='Address'
//             helperText='Must be able to transact from this address'
//             margin="normal"
//             value={this.state.claimAddress}
//             onChange={e => {
//               this.setState({claimAddress: e.target.value}, this.updateLocalClaim)
//             }}
//             fullWidth
//           />
//           <TransactionButton
//             onConfirmation={() => {
//               this.setState({
//                 activeClaim: this.submittedClaim,
//                 addressSnackbar: true
//               })
//             }}
//             buttonInitial='Initiate Claim'
//             method={() => {
//               this.setClaim(this.claim.address, this.claim.secret, this.claim.hydroId)
//               this.submittedClaim = this.claim
//               return this.getContract('snowflake').methods.initiateClaim(this.claim.claim)}
//             }
//           />
//         </form>
//       </Fragment>
//       }
//     </div>
//   )
// }))
