import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Tab, Tabs } from '@material-ui/core';
import { Home as HomeIcon } from '@material-ui/icons';
import { AttachMoney as MoneyIcon } from '@material-ui/icons';
import { Store as StoreIcon } from '@material-ui/icons';
import { AddLocation as AddLocationIcon } from '@material-ui/icons';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import { getContract, getResolverData } from '../common/utilities'
import AccountHeader from './AccountHeader'
import SnowflakeHeader from './SnowflakeHeader'
import NoHydroId from './NoHydroId'
import NoSnowflake from './NoSnowflake'
import Snowflake from './Snowflake'
import DAppStore from './DAppStore'
import GetHydro from './GetHydro'

const styles = theme => ({
  width: {
    [theme.breakpoints.down('md')]: {
      width: '90%',
    },
    [theme.breakpoints.up('md')]: {
      width: '75%',
    },
  },
});

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hydroBalance:     undefined,
      etherBalance:     undefined,
      hydroId:          undefined,
      raindropOnly:     undefined,
      claims:           {},
      snowflakeDetails: {}
    }

    this.getContract = getContract.bind(this)
    this.getResolverData = getResolverData.bind(this)
  }

  componentDidMount() {
    this.getAccountDetails()
  }

  getAccountDetails = reset => {
    const refresh = () => {
      this.getHydroId()
      this.getHydroBalance()
      this.getEtherBalance()
    }

    if (reset) {
      this.setState({
        hydroBalance: undefined, etherBalance: undefined, hydroId: undefined, raindropOnly: undefined
      }, refresh)
    } else {
      refresh()
    }
  }

  getHydroId = () => {
    const raindropHydroId = this.getContract('clientRaindrop').methods.getUserByAddress(this.props.w3w.account).call()
      .catch(() => { return null })

    const snowflakeHydroId = this.getContract('snowflake').methods.getHydroId(this.props.w3w.account).call()
      .catch(() => { return null })

    Promise.all([raindropHydroId, snowflakeHydroId])
      .then(([raindrop, snowflake]) => {
        if (snowflake !== null) {
          this.setState({hydroId: snowflake, raindropOnly: false}, this.getSnowflakeDetails)
        } else {
          if (raindrop !== null) {
            this.setState({hydroId: raindrop, raindropOnly: true})
          } else {
            this.setState({hydroId: null, raindropOnly: undefined})
          }
        }
      })
  }

  getHydroBalance = () => {
    this.props.w3w.getERC20Balance(this.getContract('token')._address)
      .then(balance => {
        this.setState({hydroBalance: Number(balance).toLocaleString(undefined, { maximumFractionDigits: 3 })})
      })
  }

  getEtherBalance = () => {
    this.props.w3w.getBalance()
      .then(balance => {
        this.setState({etherBalance: Number(balance).toLocaleString(undefined, { maximumFractionDigits: 3 })})
      })
  }

  getSnowflakeDetails = () => {
    this.getContract('snowflake').methods.getDetails(this.state.hydroId).call()
      .then(snowflakeDetails => {
        // once snowflake details are fetched, fetch details on each resolver
        Promise.all(snowflakeDetails.resolvers.map(resolver => this.getResolverData(resolver, this.state.hydroId)))
          .then(results => {
            // put resolver details into an address-denominated object
            const resolverDetails = {}
            for (let i = 0; i < results.length; i++) {
              resolverDetails[snowflakeDetails.resolvers[i]] = results[i]
            }

            const snowflakeDetailsWithResolverDetails = {
              resolverDetails:  resolverDetails,
              owner:            snowflakeDetails.owner,
              ownedAddresses:   snowflakeDetails.ownedAddresses,
              resolvers:        snowflakeDetails.resolvers,
              snowflakeBalance: this.props.w3w.toDecimal(snowflakeDetails.balance, 18)
            }

            this.setState({snowflakeDetails: snowflakeDetailsWithResolverDetails})
          })
      })
  }

  addClaim = (address, claim) => {
    this.setState(oldState => {
      const newClaim = {}
      newClaim[address] = claim
      return { claims: {...oldState.claims, ...newClaim} }
    })
  }

  removeClaim = (address) => {
    this.setState(oldState => {
      const newClaims = Object.assign({}, oldState)
      delete newClaims[address]
      return { claims: newClaims }
    })
  }

  render() {
    // determine what the body should consist of
    let Body = null
    let Store = null
    if (this.state.hydroId === undefined)
      Body = null
    else if (this.state.hydroId == null)
      Body = <NoHydroId getAccountDetails={this.getAccountDetails} />
    else if (this.state.raindropOnly)
      Body = <NoSnowflake getAccountDetails={this.getAccountDetails} hydroId={this.state.hydroId} />
    else if (Object.keys(this.state.snowflakeDetails).length === 0)
      Body = null
    else {
      Body = <Snowflake
        hydroId={this.state.hydroId}
        addClaim={this.addClaim}
        getAccountDetails={this.getAccountDetails}
        snowflakeDetails={this.state.snowflakeDetails}
      />
      Store = (
        <DAppStore
          hydroId={this.state.hydroId}
          addedResolvers={this.state.snowflakeDetails.resolvers}
          getAccountDetails={this.props.getAccountDetails}
        />
      )
    }

    return (
      <Router>
        <div className={this.props.classes.width} style={{margin: "0 auto", marginBottom: 100}}>
          <AccountHeader
            hydroBalance={this.state.hydroBalance}
            etherBalance={this.state.etherBalance}
          />

          {!(this.state.hydroId && !this.state.raindropOnly) ? null : (
            <Fragment>
              <SnowflakeHeader
                hydroId={this.state.hydroId}
                snowflakeBalance={this.state.snowflakeDetails.snowflakeBalance}
              />

              <Tabs
                value={false}
                fullWidth
                indicatorColor="secondary"
                textColor="secondary"
              >
                <Tab component={Link} to="/" icon={<HomeIcon />} label="Home" />
                <Tab component={Link} to="/dapp-store" icon={<StoreIcon />} label="Dapp Store" />
                <Tab component={Link} to="/get-hydro" icon={<MoneyIcon />} label="Get Hydro" />
                <Tab component={Link} to="/claim-address" icon={<AddLocationIcon />} label="Claim Address" />
              </Tabs>
              <hr/>
            </Fragment>
          )}

          <Route exact path="/" render={() => Body} />
          <Route path="/dapp-store" render={() => Store} />
          <Route path="/get-hydro" render={() => <GetHydro />} />
          <Route path="/claim-address" render={() => (
              <h2>Coming Soon!</h2>
            )}
          />
        </div>
      </Router>
    )
  }
}

export default withStyles(styles)(App)
