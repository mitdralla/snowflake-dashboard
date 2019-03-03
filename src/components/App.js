import React, { Suspense, lazy } from 'react';
import { withRouter, Switch, Route, Redirect } from 'react-router'
import { withStyles } from '@material-ui/core/styles'
import { useEIN, useHydroId, useEINDetails, useNamedContract } from '../common/hooks'

import AccountHeader from './AccountHeader'
import SnowflakeHeader from './SnowflakeHeader'

const NoSnowflakeProvider = lazy(() => import('./errors/NoSnowflakeProviderError'))
const NoEIN = lazy(() => import('./errors/NoEINError'))
const NoHydroId = lazy(() => import('./errors/NoHydroIdError'))
const RouteTabs = lazy(() => import('./RouteTabs'))
const FinalizeClaim = lazy(() => import('./routes/FinalizeClaim'))

const styles = theme => ({
  width: {
    margin: 'auto',
    [theme.breakpoints.down('md')]: {
      width: '90%',
    },
    [theme.breakpoints.up('md')]: {
      width: '75%',
    },
  },
})

export default withRouter(withStyles(styles)(function App ({ classes, location }) {
  const ein = useEIN()
  const [hydroId, hydroIdAddress] = useHydroId()
  const einDetails = useEINDetails(ein)
  const snowflakeAddress = useNamedContract('snowflake')._address

  const ready = (ein || ein === null) && (hydroId || hydroId === null)
  const claimingAddress = location.pathname.match(/\/claim-address.*/)

  const Display = () => {
    if (!ready) return null
    if (claimingAddress && ein === null) return <FinalizeClaim />
    if (einDetails && !einDetails.providers.includes(snowflakeAddress)) return <NoSnowflakeProvider />
    if (ein === null) return <NoEIN />
    if (ein && hydroId === null) return <NoHydroId />
    if (ein && hydroId) return <RouteTabs ein={ein} hydroIdAddress={hydroIdAddress} />
  }

  const ClaimingAddress = () => {
    if (!ready) return null
    return (
      <Switch>
        <Route
          path="/claim-address/:targetAddress/:targetIsApproving/:signingAddress/:signature/:timestamp"
          render={
            ({ match }) => <Redirect to={{ pathname: '/claim-address', state: {
              targetAddress: match.params.targetAddress,
              targetIsApproving: match.params.targetIsApproving,
              signingAddress: match.params.signingAddress,
              signature: match.params.signature,
              timestamp: match.params.timestamp
            }}} />
          }
        />
        <Redirect from='/claim-address(.+)' to='/claim-address'/>
        {!(ein && hydroId) &&
          <Route
            path="/(.+)"
            render={
              ({ location }) => {
                if (location.pathname !== '/claim-address') return <Redirect to='/' />
                return null
              }
            }
          />
        }
      </Switch>
    )
  }

  return (
    <div>
      <AccountHeader />
      <hr />
      <SnowflakeHeader ein={ein} hydroId={hydroId} />

      <div className={classes.width}>
        <Suspense fallback={<div />}>
          {ClaimingAddress()}
          {Display()}
        </Suspense>
      </div>
    </div>
  )
}))
