import React from 'react';
import { Typography } from '@material-ui/core'
import { useWeb3Context } from 'web3-react/hooks'

import { useNamedContract } from '../common/hooks'
import TransactionButton from './common/TransactionButton'

export default function NoEIN () {
  const context = useWeb3Context()
  const _1484Contract = useNamedContract('1484')
  const clientRaindropAddress = useNamedContract('clientRaindrop')._address

  return (
    <div>
      <Typography gutterBottom color="textPrimary">
        Click below to claim your 1484 Identity!
      </Typography>

      <TransactionButton
        readyText='Claim your 1484 Identity!'
        method={() => _1484Contract.methods.createIdentity(context.account, context.account, [clientRaindropAddress])}
        onConfirmation={context.reRenderers.forceAccountReRender}
      />

      <Typography variant='body2' gutterBottom color="textPrimary">
        Already Have a Snowflake? Linking is coming soon!
      </Typography>

      {/*<Router basename={process.env.PUBLIC_URL}>
        <div className={classes.width} style={{margin: "0 auto", marginBottom: 100}}>
          <Button variant="contained" color="primary" component={Link} to="/claim-address">Finalize Claim</Button>
        </div>
      </Router>*/}
    </div>
  )
}
