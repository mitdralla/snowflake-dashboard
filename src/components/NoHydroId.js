import React, { useState } from 'react'
import { TextField, Typography } from '@material-ui/core'
import { useWeb3Context } from 'web3-react/hooks'

import { useNamedContract } from '../common/hooks'
import TransactionButton from './common/TransactionButton'

export default function NoHydroId () {
  const [potentialHydroId, setPotentialHydroId] = useState('')

  const context = useWeb3Context()
  const clientRaindrop = useNamedContract('clientRaindrop')

  return (
    <div>
      <Typography variant='h4' gutterBottom color="textPrimary">
        Almost There...
      </Typography>

      <Typography variant='body2' gutterBottom color="textPrimary">
        Just one last step: please choose a Hydro ID to be associated with your Hydro ID.
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
        method={() => clientRaindrop.methods['signUp(string)'](potentialHydroId)}
        onConfirmation={context.reRenderers.forceAccountReRender}
      />
    </div>
  )
}
