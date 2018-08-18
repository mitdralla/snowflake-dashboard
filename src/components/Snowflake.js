import React, { Component } from 'react';
import { withWeb3 } from 'web3-webpacked-react';
import { Typography } from '@material-ui/core';

import SnowflakeAddresses from './SnowflakeAddresses'
import SnowflakeTokens from './SnowflakeTokens'
import SnowflakeResolvers from './SnowflakeResolvers'

import { getContract } from '../common/utilities'

class Snowflake extends Component {
  constructor(props) {
    super(props)

    this.state = {
      snowflakeDetails: {
        owner: undefined,
        ownedAddresses: [],
        resolvers: [],
        balance: undefined
      },
      resolverDetails: null
    }

    this.getResolverDetails = this.getResolverDetails.bind(this)
    this.getSnowflakeDetails = this.getSnowflakeDetails.bind(this)

    this.getContract = getContract.bind(this)
    this.hydroContract = this.getContract('token')
    this.snowflakeContract = this.getContract('snowflake')
    this.resolverContract = resolver => this.getContract(resolver, true)

    this.getSnowflakeDetails(this.props.hydroId)
  }

  getSnowflakeDetails (hydroId) {
    this.snowflakeContract.methods.getDetails(hydroId).call()
      .then(details => {
        this.setState(oldState => {
          const extractedDetails = {
            owner: details.owner,
            ownedAddresses: details.ownedAddresses,
            resolvers: details.resolvers
          }
          return {snowflakeDetails: {...oldState.snowflakeDetails, ...extractedDetails}}
        })

        let resolverDetails = details.resolvers.map(resolver => {
          return this.getResolverDetails(resolver)
        })

        Promise.all(resolverDetails)
          .then(results => {
            const extractedDetails = {}
            for (let i = 0; i < details.resolvers.length; i++) {
              extractedDetails[details.resolvers[i]] = results[i]
            }
            this.setState({resolverDetails: extractedDetails})
          })
      })

      this.snowflakeContract.methods.snowflakeBalance(hydroId).call()
        .then(balance => {
          var standardized = this.props.w3w.toDecimal(balance, 18)
          standardized = Number(standardized).toLocaleString(undefined, { maximumFractionDigits: 3 })
          this.setState(oldState => {return {snowflakeDetails: {...oldState.snowflakeDetails, balance: standardized}}})
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

    // this should never throw
    return Promise.all([name, description, allowance])
      .then(([name, description, allowance]) => {
        return {
          name: name,
          description: description,
          allowance: allowance
        }
      })
  }

  render() {
    return (
      <div key={this.state.resolverDetails}>
        <Typography variant='display1' gutterBottom align="center" color="textPrimary">
          Snowflake Detected!
        </Typography>
        <Typography variant='body1' gutterBottom align="center" color="textPrimary">
          Owner: {this.state.snowflakeDetails.owner}
        </Typography>
        <Typography variant='body1' gutterBottom align="center" color="textPrimary">
          Balance: {this.state.snowflakeDetails.balance}
        </Typography>
        <SnowflakeAddresses
          ownedAddresses={this.state.snowflakeDetails.ownedAddresses}
          owner={this.state.snowflakeDetails.owner}
          hydroId={this.props.hydroId}
          addClaim={this.props.addClaim}
        />
        <SnowflakeTokens
          hydroId={this.props.hydroId}
        />
        <SnowflakeResolvers
          resolvers={this.state.snowflakeDetails.resolvers}
          resolverDetails={this.state.resolverDetails}
          hydroId={this.props.hydroId}
        />
      </div>
    )
  }
}

export default withWeb3(Snowflake)
