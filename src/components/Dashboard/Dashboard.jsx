import React, { Suspense, lazy } from 'react';
import { withRouter, Switch, Route, Redirect } from 'react-router'
import { useEIN, useHydroId, useEINDetails, useNamedContract } from '../../common/hooks'
import './Dashboard.css'
import config from '../../config.jsx'

import { Header } from '../Header'
import { HeroCarousel } from '../HeroCarousel'
import { Sidebar } from '../Sidebar'
import { Footer } from '../Footer'

import SnowflakeHeader from '../SnowflakeHeader'
const NoSnowflakeProvider = lazy(() => import('../states/NoSnowflakeProvider'))
const NoEIN = lazy(() => import('../states/NoEIN'))
const NoHydroId = lazy(() => import('../states/NoHydroId'))
const RouteTabs = lazy(() => import('../RouteTabs'))
const FinalizeClaim = lazy(() => import('../Views/FinalizeClaim'))

export default withRouter((function App ({ classes, location }) {
  const ein = useEIN()
  const [hydroId, hydroIdAddress] = useHydroId()
  const einDetails = useEINDetails(ein)
  const snowflakeAddress = useNamedContract('snowflake')._address

  const ready = (ein || ein === null) && (hydroId || hydroId === null)
  const claimingAddress = location.pathname.match(/\/claim-address.*/)

  const storeWrapperStyle = {
    maxWidth: config.general.theme.maxWidth,
    backgroundColor: config.general.theme.contentBackgroundColor
  }

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
    <div className="dashWrapper" style={storeWrapperStyle}>
      <Header />
      <HeroCarousel />
      <div className="bodyWrapper">
        <Sidebar />

        <div className="bodyContent">
          <SnowflakeHeader ein={ein} hydroId={hydroId} />
          <Suspense fallback={<div />}>
            {ClaimingAddress()}
            {Display()}
          </Suspense>
        </div>
      </div>
      <Footer />
    </div>
  )
}))
