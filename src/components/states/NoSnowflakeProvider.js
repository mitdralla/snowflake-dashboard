import React from 'react'
import { Typography } from '@material-ui/core'
import { useWeb3Context }  from 'web3-react'

import { useNamedContract } from '../../common/hooks'
import TransactionButton from '../common/TransactionButton'

export default function NoHydroId () {
  const context = useWeb3Context()
  const _1484 = useNamedContract('1484')
  const snowflakeAddress = useNamedContract('snowflake')._address

  return (
    <div>
      <Typography variant='h4' gutterBottom color="textPrimary">
        Snowflake
      </Typography>

      <Typography variant='body2' gutterBottom color="textPrimary">
        Before continuing, you{"'"}ll need to give Snowflake permission to manage your EIN.
      </Typography>

      <TransactionButton
        readyText='Set Snowflake Provider'
        method={() => _1484.methods.addProviders([snowflakeAddress])}
        onConfirmation={context.forceAccountReRender}
      />
    </div>
  )
}
