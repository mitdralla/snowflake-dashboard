import React, { Suspense, lazy } from 'react';
import { Route, Link, Redirect, Switch } from 'react-router-dom'
import { withRouter } from 'react-router'

import { Tab, Tabs } from '@material-ui/core';
import { Home as HomeIcon } from '@material-ui/icons';
import { AttachMoney as MoneyIcon } from '@material-ui/icons';
import { Store as StoreIcon } from '@material-ui/icons';
import { AddLocation as AddLocationIcon } from '@material-ui/icons';

const Body = lazy(() => import('./Views/Body'))
const Store = lazy(() => import('./Views/DAppStore'))
const GetHydro = lazy(() => import('./Views/GetHydro'))
const FinalizeClaim = lazy(() => import('./Views/FinalizeClaim'))
const Faq = lazy(() => import('./Views/FAQ'))
const Stats = lazy(() => import('./Views/Stats'))
const Audits = lazy(() => import('./Views/Audits'))
const Terms = lazy(() => import('./Views/Terms'))
const Privacy = lazy(() => import('./Views/Privacy'))
const About = lazy(() => import('./Views/About'))
const Contact = lazy(() => import('./Views/Contact'))
const SubmitDApp = lazy(() => import('./Views/SubmitDApp'))
const ManageIdentity = lazy(() => import('./Views/ManageYourIdentity'))
const ManageWallet = lazy(() => import('./Views/DAppStoreWallet'))
const ManageDApps = lazy(() => import('./Views/DAppsAdded'))
const DAppCategories = lazy(() => import('./Views/DAppCategories'))
const DAppDetails = lazy(() => import('./Views/DAppDetails'))

const routeNames = ['/', '/dapp-store', '/get-hydro', '/claim-address', '/faq']
const MyTabs = withRouter(({ location, children, ...rest }) => {
  const { match, history, staticContext, ...tabProps } = rest // eslint-disable-line no-unused-vars

  return (
    <Tabs
      {...tabProps}
      value={routeNames.includes(location.pathname) ? location.pathname : false}
    >
      {children}
    </Tabs>
  )
})

export default withRouter(function RouteTabs ({ ein, hydroIdAddress }) {
  return (
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
          <Route exact path="/" render={() => <Body ein={ein} hydroIdAddress={hydroIdAddress} />} />
          <Redirect from='/dapp-store(.+)' to='/dapp-store'/>
          <Route path="/dapp-store" render={() => <Store ein={ein}/>} />
          <Redirect from='/get-hydro(.+)' to='/get-hydro'/>
          <Route path="/get-hydro" render={() => <GetHydro ein={ein} />} />
          <Route path="/claim-address" render={() => <FinalizeClaim ein={ein} />} />
          <Route path="/faq" render={() => <Faq />} />
          <Route path="/stats" render={() => <Stats />} />
          <Route path="/audits" render={() => <Audits />} />
          <Route path="/terms-of-use" render={() => <Terms />} />
          <Route path="/privacy-policy" render={() => <Privacy />} />
          <Route path="/about" render={() => <About />} />
          <Route path="/contact" render={() => <Contact />} />
          <Route path="/submit" render={() => <SubmitDApp />} />
          <Route path="/wallet" render={() => <ManageWallet />} />
          <Route path="/your-dapps" render={() => <ManageDApps />} />
          <Route path="/identity" render={() => <ManageIdentity />} />
          <Route path="/dapps/category*" component={DAppCategories} render={() => <DAppCategories />} />
          <Route path="/dapp*" component={DAppDetails} render={() => <DAppDetails />} />
          <Redirect to="/" />
        </Switch>
      </Suspense>
    </>
  )
})
