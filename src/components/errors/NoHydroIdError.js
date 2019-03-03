import React, { useState } from 'react'
import { TextField, Typography } from '@material-ui/core'
import { useWeb3Context } from 'web3-react/hooks'

import { useNamedContract } from '../../common/hooks'
import TransactionButton from '../common/TransactionButton'

export default function NoHydroId () {
  const [potentialHydroId, setPotentialHydroId] = useState('')

  const context = useWeb3Context()
  const snowflake = useNamedContract('snowflake')
  const clientRaindropAddress = useNamedContract('clientRaindrop')._address

  const bytes = context.library.eth.abi.encodeParameters(
    ['address', 'string'], [context.account, potentialHydroId]
  )

  return (
    <div>
      <Typography variant='h4' gutterBottom color="textPrimary">
        Almost There...
      </Typography>

      <Typography variant='body2' gutterBottom color="textPrimary">
        Just one last step: please choose a Hydro ID to be associated with your Identity.
      </Typography>

      <TextField
        key='Hydro ID'
        label='Hydro ID'
        helperText='This is a public identifier.'
        margin="normal"
        value={potentialHydroId}
        onChange={e => setPotentialHydroId(e.target.value)}
        fullWidth
      />

      <TransactionButton
        readyText='Claim Hydro ID!'
        method={() => snowflake.methods.addResolver(clientRaindropAddress, true, 0, bytes)}
        onConfirmation={context.forceAccountReRender}
      />
    </div>
  )
}
