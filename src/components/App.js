import React, { Suspense, lazy } from 'react';

import { useEIN, useHydroId } from '../common/hooks'
import { withStyles } from '@material-ui/core/styles'

import AccountHeader from './AccountHeader'
import SnowflakeHeader from './SnowflakeHeader'

const NoEIN = lazy(() => import('./NoEIN'))
const NoHydroId = lazy(() => import('./NoHydroId'))
const RouteTabs = lazy(() => import('./RouteTabs'))

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

export default withStyles(styles)(function App ({ classes }) {
  const ein = useEIN()
  const hydroId = useHydroId()

  const Display = () => {
    if (ein === null)
      return <NoEIN />
    if (ein && hydroId === null)
      return <NoHydroId />
    if (ein && hydroId) {
      return <RouteTabs ein={ein} />
    }
  }

  return (
    <div>
      <AccountHeader />
      <hr />
      <SnowflakeHeader ein={ein} hydroId={hydroId} />
      <div className={classes.width}>
        <Suspense fallback={<div />}>
          {Display()}
        </Suspense>
      </div>
    </div>
  )
})
