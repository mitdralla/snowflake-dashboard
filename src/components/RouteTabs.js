import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from 'react-router-dom'
import { withRouter } from 'react-router'

import { Tab, Tabs } from '@material-ui/core';
import { Home as HomeIcon } from '@material-ui/icons';
import { AttachMoney as MoneyIcon } from '@material-ui/icons';
import { Store as StoreIcon } from '@material-ui/icons';
import { AddLocation as AddLocationIcon } from '@material-ui/icons';

const Body = lazy(() => import('./routes/Body'))
const Store = lazy(() => import('./routes/DAppStore'))
const GetHydro = lazy(() => import('./routes/GetHydro'))
const FinalizeClaim = lazy(() => import('./routes/FinalizeClaim'))

const routeNames = ['/', '/dapp-store', '/get-hydro', '/claim-address']
const MyTabs = withRouter(({location, ...props}) => {
  const { match, history, children, staticContext, ...passedProps } = props // eslint-disable-line no-unused-vars

  return (
    <Tabs
      {...passedProps}
      value={routeNames.includes(location.pathname) ? location.pathname : false}
    >
      {children}
    </Tabs>
  )
})

export default function RouteTabs ({ ein }) {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <>
        <MyTabs
          fullWidth
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab
            component={Link}
            value='/'
            to="/"
            icon={<HomeIcon />}
            label="Home"
          />
          <Tab
            component={Link}
            value='/dapp-store'
            to="/dapp-store"
            icon={<StoreIcon />}
            label="Dapp Store"
          />
          <Tab
            component={Link}
            value='/get-hydro'
            to="/get-hydro"
            icon={<MoneyIcon />}
            label="Get Hydro"
          />
          <Tab
            component={Link}
            value='/claim-address'
            to="/claim-address"
            icon={<AddLocationIcon />}
            label="Claim Address"
          />
        </MyTabs>

        <Suspense fallback={<div />}>
          <Switch>
            <Route exact path="/" render={() => <Body ein={ein}/>} />
            <Redirect from='/dapp-store(.+)' to='/dapp-store'/>
            <Route path="/dapp-store" render={() => <Store ein={ein}/>} />
            <Redirect from='/get-hydro(.+)' to='/get-hydro'/>
            <Route path="/get-hydro" render={() => <GetHydro />} />
            <Route
              path="/claim-address/ein/:ein"
              render={
                ({ match }) => <Redirect to={{ pathname: '/claim-address', state: { ein: match.params.ein } }} />
              }
            />
            <Route
              path="/claim-address/hydro-id/:hydroId"
              render={
                ({ match }) => <Redirect to={{ pathname: '/claim-address', state: { hydroId: match.params.hydroId } }} />
              }
            />
            <Redirect from='/claim-address(.+)' to='/claim-address'/>
            <Route path="/claim-address" render={() => <FinalizeClaim />} />
            <Redirect to="/" />
          </Switch>
        </Suspense>
      </>
    </Router>
  )
}
