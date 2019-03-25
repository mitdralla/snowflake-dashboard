import React, { Suspense, lazy } from 'react';
import { withRouter, Switch, Route, Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import * as IonIcons from 'react-icons/io'
import { useEIN, useHydroId, useEINDetails, useNamedContract } from '../../common/hooks'

import './Dashboard.css'
import config from '../../config.jsx'
import SnowflakeHeader from '../SnowflakeHeader'
import Header from '../../templates/sections/Header'
import Footer from '../../templates/sections/Footer'
import HeroCarousel from '../../templates/sections/HeroCarousel'

const sidebarNavItems = config.dappCategories.categories;
const NoSnowflakeProvider = lazy(() => import('../states/NoSnowflakeProvider'))
const NoEIN = lazy(() => import('../states/NoEIN'))
const NoHydroId = lazy(() => import('../states/NoHydroId'))
const RouteTabs = lazy(() => import('../RouteTabs'))
const FinalizeClaim = lazy(() => import('../routes/FinalizeClaim'))
const DAppCategories = lazy(() => import('../../pages/DAppCategories'))

export default withRouter((function App ({ classes, location }) {
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
      <Header />
      <HeroCarousel />
      <div className="bodyWrapper">
        <div className="sidebar">
          <div className="container">
            <div className="row">
              <div className="column">
              <ul className="dappSidebarAuxNav">
                <Link to="/wallet"><li>dApp Store Wallet</li></Link>
                <Link to="/your-dapps"><li>Your Added dApps</li></Link>
                <Link to="/identity"><li>Manage Your Identity (EIN)</li></Link>
                <Link to="/submit"><li>Submit Your dApp</li></Link>
              </ul>
              <h2 className="text-grey">Categories</h2>
              <ul className="dappSidebarCategoryNav">
                {sidebarNavItems.map((category, i) => {
                  const iconString = category.icon;
                  const icon = React.createElement(IonIcons[iconString]);

                  return <Link to={'/dapps/category/'+category.link} key={i} component={DAppCategories}><li data-category={category.name.replace(/\s+/g, '-').toLowerCase()} key={i}>{icon} {category.name}</li></Link>
                })}
              </ul>
              </div>
            </div>
          </div>
        </div>

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
