import React, { Component } from 'react';
import { withWeb3 } from 'web3-webpacked-react';
import { TextField } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import TransactionButton from './TransactionButton'
import { getContract } from '../common/utilities'

const styles = theme => ({
  marginTop: {
    marginTop: theme.spacing.unit * 4
  }
})

class SnowflakeTokens extends Component {
  constructor(props) {
    super(props)

    this.state = {
      depositAmount: '',
      withdrawAmount: '',
      transferHydroId: '',
      transferAmount: ''
    }

    this.getContract = getContract.bind(this)
  }

  render() {
    const { classes } = this.props
    const depositAmount = this.props.w3w.fromDecimal(String(this.state.depositAmount), 18)
    const withdrawAmount = this.props.w3w.fromDecimal(String(this.state.withdrawAmount), 18)
    const transferAmount = this.props.w3w.fromDecimal(String(this.state.transferAmount), 18)

    return (
      <div style={{width: '100%'}}>
        <Typography variant='display1' gutterBottom color="textPrimary" className={classes.marginTop}>
          Manage your Snowflake Token Balances
        </Typography>

        {this.props.w3w.networkId === 4 ? (
          <>
            <Typography variant='body2' gutterBottom color="textPrimary">
              Get 10,000 free testnet HYDRO!
            </Typography>

            <form noValidate autoComplete="off">
              <TransactionButton
                buttonInitial='Get Testnet Hydro'
                method={() => this.getContract('token').methods.getMoreTokens()}
                onConfirmation={this.props.getAccountDetails}
              />
            </form>
          </>
          ) :
          null
        }

        <Typography variant='body2' gutterBottom color="textPrimary" className={classes.marginTop}>
          Deposit HYDRO from your current account into your Snowflake, which you can use to pay for dApp services.
        </Typography>
        <form noValidate autoComplete="off">
          <TextField
            label="Amount"
            type="number"
            helperText="Number of Hydro tokens to deposit."
            margin="normal"
            value={this.state.depositAmount}
            onChange={e => this.setState({depositAmount: e.target.value})}
            fullWidth
          />
          <TransactionButton
            buttonInitial='Deposit Hydro'
            method={() => this.getContract('token').methods.approveAndCall(
              this.getContract('snowflake')._address, depositAmount, '0x00'
            )}
            onConfirmation={this.props.getAccountDetails}
          />
        </form>

        <Typography variant='body2' gutterBottom color="textPrimary" className={classes.marginTop}>
          Transfer HYDRO to another Snowflake holder.
        </Typography>
        <form noValidate autoComplete="off">
          <TextField
            label="HydroId"
            helperText="The Hydro ID of the token recipient."
            margin="normal"
            value={this.state.transferHydroId}
            onChange={e => this.setState({transferHydroId: e.target.value})}
            fullWidth
          />
          <TextField
            label="Amount"
            type="number"
            helperText="Number of Hydro tokens to transfer."
            margin="normal"
            value={this.state.transferAmount}
            onChange={e => this.setState({transferAmount: e.target.value})}
            fullWidth
          />
          <TransactionButton
            buttonInitial='Transfer Hydro'
            method={() => this.getContract('snowflake').methods.transferSnowflakeBalance(
              this.state.transferHydroId, transferAmount
            )}
            onConfirmation={this.props.getAccountDetails}
          />
        </form>

        <Typography variant='body2' gutterBottom color="textPrimary" className={classes.marginTop}>
          Withdraw HYDRO from your Snowflake into your current account.
        </Typography>
        <form noValidate autoComplete="off">
          <TextField
            label="Amount"
            type="number"
            helperText="Number of Hydro tokens to withdraw."
            margin="normal"
            value={this.state.withdrawAmount}
            onChange={e => this.setState({withdrawAmount: e.target.value})}
            fullWidth
          />
          <TransactionButton
            buttonInitial='Withdraw Hydro'
            method={() => this.getContract('snowflake').methods.withdrawSnowflakeBalance(
              this.props.w3w.account, withdrawAmount
            )}
            onConfirmation={this.props.getAccountDetails}
          />
        </form>
      </div>
    )
  }
}

export default withStyles(styles)(withWeb3(SnowflakeTokens))
