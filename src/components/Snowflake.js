import React, { Component } from 'react';
import { withWeb3 } from 'web3-webpacked-react';
import { Typography } from '@material-ui/core';

import SnowflakeAddresses from './SnowflakeAddresses'
import SnowflakeTokens from './SnowflakeTokens'
import SnowflakeResolvers from './SnowflakeResolvers'
import StoreModal from './StoreModal'


import { getContract } from '../common/utilities'

class Snowflake extends Component {
  constructor(props) {
    super(props)

    this.state = {
      owner:            undefined,
      ownedAddresses:   [],
      resolvers:        [],
      balance:          undefined,
      resolverDetails:  null
    }

    this.getResolverDetails = this.getResolverDetails.bind(this)
    this.getSnowflakeDetails = this.getSnowflakeDetails.bind(this)

    this.getContract = getContract.bind(this)
    this.hydroContract = this.getContract('token')
    this.snowflakeContract = this.getContract('snowflake')
    this.resolverContract = resolver => this.getContract(resolver, true)
  }

  componentDidMount() {
    this.getSnowflakeDetails()
  }

  getSnowflakeDetails () {
    this.snowflakeContract.methods.getDetails(this.props.hydroId).call()
      .then(details => {
        let resolverDetails = details.resolvers.map(resolver => {
          return this.getResolverDetails(resolver)
        })

        Promise.all(resolverDetails)
          .then(results => {
            const extractedDetails = {}
            for (let i = 0; i < details.resolvers.length; i++) {
              extractedDetails[details.resolvers[i]] = results[i]
            }
            this.setState({resolverDetails: extractedDetails, ...{
              owner:          details.owner,
              ownedAddresses: details.ownedAddresses,
              resolvers:      details.resolvers
            }})
          })
      })

    this.snowflakeContract.methods.snowflakeBalance(this.props.hydroId).call()
      .then(balance => {
        var standardized = this.props.w3w.toDecimal(balance, 18)
        standardized = Number(standardized).toLocaleString(undefined, { maximumFractionDigits: 3 })
        this.setState(oldState => {
          return { balance: standardized }
        })
      })
  }

  getResolverDetails (resolver) {
    const resolverContract = this.resolverContract(resolver)

    const name = resolverContract.methods.snowflakeName().call()
      .catch(() => '')
    const description = resolverContract.methods.snowflakeDescription().call()
      .catch(() => '')
    const allowance = this.snowflakeContract.methods.getResolverAllowance(this.props.hydroId, resolver).call()
      .then(allowance => {
        return this.props.w3w.toDecimal(allowance, 18)
      })
      .catch(() => '')

    // this should never throw
    return Promise.all([name, description, allowance])
      .then(([name, description, allowance]) => {
        return {
          name:        name,
          description: description,
          allowance:   allowance
        }
      })
  }

  render() {
    return (
      <React.Fragment>
        <Typography variant='display1' gutterBottom align="center" color="textPrimary">
          Snowflake Detected!
        </Typography>
        <Typography variant='body1' gutterBottom align="center" color="textPrimary">
          Owner: {this.state.owner}
        </Typography>
        <Typography variant='body1' gutterBottom align="center" color="textPrimary">
          Balance: {this.state.balance}
        </Typography>
        <SnowflakeAddresses
          getAccountDetails={this.props.getAccountDetails}
          owner={this.state.owner}
          ownedAddresses={this.state.ownedAddresses}
          hydroId={this.props.hydroId}
          addClaim={this.props.addClaim}
        />
        <SnowflakeTokens
          hydroId={this.props.hydroId}
          getAccountDetails={this.props.getAccountDetails}
        />
        <SnowflakeResolvers
          resolvers={this.state.resolvers}
          resolverDetails={this.state.resolverDetails}
          hydroId={this.props.hydroId}
          getAccountDetails={this.props.getAccountDetails}
        />
        <StoreModal addedResolvers={this.state.resolvers} getAccountDetails={this.props.getAccountDetails} />
      </React.Fragment>
    )
  }
}

export default withWeb3(Snowflake)
