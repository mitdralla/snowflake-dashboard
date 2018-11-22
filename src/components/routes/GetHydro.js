import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { fromDecimal } from 'web3-react/utilities'
import { useWeb3Context } from 'web3-react/hooks'

import TransactionButton from '../common/TransactionButton'
import { useNamedContract } from '../../common/hooks'

const styles = theme => ({
  marginTop: {
    marginTop: theme.spacing.unit * 4
  }
})

export default withStyles(styles)(function GetHydro ({ classes }) {
  const context = useWeb3Context()
  const tokenContract = useNamedContract('token')
  const snowflakeAddress = useNamedContract('snowflake')._address

  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')

  return (
    <div style={{width: '100%'}}>
      <button onClick={context.reRenderers.forceAccountReRender}>force</button>
      <Typography variant='h6' gutterBottom color="textPrimary" className={classes.marginTop}>
        Manage your Snowflake Token Balances
      </Typography>

      {context.networkId !== 4 ? undefined : (
        <>
          <Typography gutterBottom color="textPrimary">
            Get 10,000 free testnet HYDRO!
          </Typography>

          <TransactionButton
            readyText='Get Testnet Hydro'
            method={() => tokenContract.methods.getMoreTokens()}
            onConfirmation={context.reRenderers.forceAccountReRender}
          />
        </>
      )}

      <Typography variant='h6' gutterBottom color="textPrimary" className={classes.marginTop}>
        Deposit HYDRO from your current account into your Snowflake, which you can use to pay for dApp services.
      </Typography>
      <TextField
        label="Amount"
        type="number"
        helperText="Number of Hydro tokens to deposit."
        margin="normal"
        value={depositAmount}
        onChange={e => setDepositAmount(e.target.value)}
        fullWidth
      />

      <TransactionButton
        readyText='Deposit Hydro'
        method={() => tokenContract.methods.approveAndCall(snowflakeAddress, fromDecimal(depositAmount, 18), '0x00')}
        onConfirmation={context.reRenderers.forceAccountReRender}
      />

      <Typography variant='h6' gutterBottom color="textPrimary" className={classes.marginTop}>
        Withdraw HYDRO from your Snowflake into your current account.
      </Typography>
      <TextField
        label="Amount"
        type="number"
        helperText="Number of Hydro tokens to withdraw."
        margin="normal"
        value={withdrawAmount}
        onChange={e => setWithdrawAmount(e.target.value)}
        fullWidth
      />

      <TransactionButton
        readyText='Withdraw Hydro'
        method={() => tokenContract.methods.withdrawSnowflakeBalance(context.account, fromDecimal(withdrawAmount, 18))}
        onConfirmation={context.reRenderers.forceAccountReRender}
      />
    </div>
  )
})
