import React, { Component } from 'react';
import { withWeb3 } from 'web3-webpacked-react';
import { withStyles } from '@material-ui/core/styles';

import { getContract } from '../common/utilities'
import Header from './Header'
import FinalizeClaim from './FinalizeClaim'
import NoHydroId from './NoHydroId'
import NoSnowflake from './NoSnowflake'
import Snowflake from './Snowflake'

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
      account:      undefined,
      hydroBalance: undefined,
      etherBalance: undefined,
      hydroId:      undefined,
      raindropOnly: undefined,
      claims:       {}
    }

    this.getHydroId = this.getHydroId.bind(this)
    this.getEtherBalance = this.getEtherBalance.bind(this)
    this.getHydroBalance = this.getHydroBalance.bind(this)
    this.getAccountDetails = this.getAccountDetails.bind(this)

    this.getContract = getContract.bind(this)
    this.addClaim = this.addClaim.bind(this)
    this.removeClaim = this.removeClaim.bind(this)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // Store prevUserId in state so we can compare when props change.
    // Clear out any previously-loaded user data (so we don't render stale stuff).
    if (nextProps.w3w.account !== prevState.account) {
      return {
        account:      nextProps.w3w.account,
        hydroBalance: undefined,
        etherBalance: undefined,
        hydroId:      undefined,
        raindropOnly: undefined
      }
    }

    return null
  }

  componentDidMount() {
    this.getAccountDetails()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.hydroBalance === undefined) {
      this.getAccountDetails()
    }
  }

  getAccountDetails(force) {
    if (force) {
      this.setState({
        hydroBalance: undefined, etherBalance: undefined, hydroId: undefined, raindropOnly: undefined
      }, () => {
        this.getHydroId()
        this.getHydroBalance()
        this.getEtherBalance()
      })
    } else {
      this.getHydroId()
      this.getHydroBalance()
      this.getEtherBalance()
    }
  }

  getHydroId() {
    const raindropHydroId = this.getContract('clientRaindrop').methods.getUserByAddress(this.props.w3w.account).call()
      .catch(() => { return null })

    const snowflakeHydroId = this.getContract('snowflake').methods.getHydroId(this.props.w3w.account).call()
      .catch(() => { return null })

    Promise.all([raindropHydroId, snowflakeHydroId])
      .then(([raindrop, snowflake]) => {
        if (snowflake !== null) {
          this.setState({hydroId: snowflake, raindropOnly: false})
        } else {
          if (raindrop !== null) {
            this.setState({hydroId: raindrop, raindropOnly: true})
          } else {
            this.setState({hydroId: null, raindropOnly: undefined})
          }
        }
      })
  }

  getHydroBalance() {
    this.props.w3w.getERC20Balance(this.getContract('token')._address)
      .then(balance => {
        this.setState({hydroBalance: Number(balance).toLocaleString(undefined, { maximumFractionDigits: 3 })})
      })
  }

  getEtherBalance() {
    this.props.w3w.getBalance()
      .then(balance => {
        this.setState({etherBalance: Number(balance).toLocaleString(undefined, { maximumFractionDigits: 3 })})
      })
  }

  addClaim(address, claim) {
    this.setState(oldState => {
      const newClaim = {}
      newClaim[address] = claim
      return { claims: {...oldState.claims, ...newClaim} }
    })
  }

  removeClaim(address) {
    this.setState(oldState => {
      const newClaims = Object.assign({}, oldState)
      delete newClaims[address]
      return { claims: newClaims }
    })
  }

  render() {
    // determine claim elements
    const Claim = (claims) => {
      const claim = claims[this.props.w3w.account.toLowerCase()]
      return claim !== undefined ?
        <FinalizeClaim claim={claim} getAccountDetails={this.getAccountDetails} removeClaim={this.removeClaim} /> :
        ''
    }

    // determine body elements
    const Body = (hydroId, raindropOnly) => {
      if (hydroId === undefined) {
        return ''
      }
      if (this.state.hydroId == null) {
        return (
          <NoHydroId getAccountDetails={this.getAccountDetails} />
        )
      } else if (this.state.raindropOnly) {
        return (
          <NoSnowflake getAccountDetails={this.getAccountDetails} hydroId={this.state.hydroId} />
        )
      } else {
        return (
          <Snowflake
            key={this.state.hydroId}
            hydroId={this.state.hydroId}
            addClaim={this.addClaim}
            getAccountDetails={this.getAccountDetails}
          />
        )
      }
    }

    return (
      <div className={this.props.classes.width} style={{margin: "0 auto", marginBottom: 100}}>
        <Header
          hydroId={this.state.hydroId}
          hydroBalance={this.state.hydroBalance}
          etherBalance={this.state.etherBalance}
        />
        <hr/>
        {Claim(this.state.claims)}
        {Body(this.state.hydroId, this.state.raindropOnly)}
      </div>
    )
  }
}

export default withStyles(styles)(withWeb3(App))
