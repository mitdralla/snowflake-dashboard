import React from 'react'
import Typography from '@material-ui/core/Typography'

import contracts from './contracts'
import { default as defaultLogo } from '../components/resolvers/defaultLogo.png'

// Get the selected contract.
export function getContract (contractName) {
  const contractData = contracts[this.props.w3w.getNetworkName()][contractName]
  return this.props.w3w.getContract(contractData.ABI, contractData.address)
}

export const GENERIC_SNOWFLAKE_RESOLVER_ABI = [{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"snowflakeDescription","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"snowflakeName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"callOnRemoval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"callOnSignUp","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"snowflakeAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_snowflakeName","type":"string"},{"name":"_snowflakeDescription","type":"string"},{"name":"_snowflakeAddress","type":"address"},{"name":"_callOnSignUp","type":"bool"},{"name":"_callOnRemoval","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":false,"inputs":[{"name":"_snowflakeAddress","type":"address"}],"name":"setSnowflakeAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]

// Get the details of a resolver (dApp).
export async function getResolverDetails (address) {
  const resolverPath = `components/resolvers/${this.props.w3w.getNetworkName()}/${address}`
  const resolverData = await import('../' + resolverPath)
    .catch(() => null)

  // get contract object
  if (resolverData === null) {
    const genericResolverABI = [{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"snowflakeDescription","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"snowflakeName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"callOnRemoval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"callOnSignUp","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"snowflakeAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_snowflakeName","type":"string"},{"name":"_snowflakeDescription","type":"string"},{"name":"_snowflakeAddress","type":"address"},{"name":"_callOnSignUp","type":"bool"},{"name":"_callOnRemoval","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":false,"inputs":[{"name":"_snowflakeAddress","type":"address"}],"name":"setSnowflakeAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"einTo","type":"uint256"},{"name":"amount","type":"uint256"}],"name":"depositHydroBalanceTo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}] // eslint-disable-line

    return {contract: this.props.w3w.getContract(genericResolverABI, address)}
  }

  if (!resolverData.default) throw Error(`No default member exported from ${resolverPath}.`)
  if (!resolverData.ABI) throw Error(`No 'ABI' member exported from ${resolverPath}.`)

  return {
    'default':         resolverData.default,
    logo:              resolverData.logo || defaultLogo,
    requiredAllowance: resolverData.requiredAllowance || "0",
    contract:          this.props.w3w.getContract(resolverData.ABI, address)
  }
}

// Get a list of all resolvers (dApps) in the store.
export async function getAllResolvers () {
  // eslint-disable-next-line
  return (await import('../' + `components/resolvers/${this.props.w3w.getNetworkName()}`)).default
}

// Get the resolvers properties.
export async function getResolverData (resolverAddress, hydroId) {
  const snowflakeContract = getContract.bind(this)('snowflake')
  const resolverDetails = await getResolverDetails.bind(this)(resolverAddress)

  const name = resolverDetails.contract.methods.snowflakeName().call()
    .catch(() => '')
  const description = resolverDetails.contract.methods.snowflakeDescription().call()
    .catch(() => '')

  const allowance = !hydroId ? undefined :
    snowflakeContract.methods.getResolverAllowance(hydroId, resolverAddress).call()
      .then(allowance => {
        return this.props.w3w.toDecimal(allowance, 18)
      })
      .catch(() => '')

  // this never throws (but why?)
  return Promise.all([name, description, allowance])
    .then(([name, description, allowance]) => {
      return {
        name:              name,
        description:       description,
        allowance:         allowance,
        requiredAllowance: resolverDetails.requiredAllowance,
        address:           resolverAddress,
        logo:              resolverDetails.logo
      }
    })
}

// Links to Etherscans txn.
export function linkify (type, data, display, variant) {
  display = display === undefined ? data : display

  return (
    <Typography
      style={{display: 'inline-block', textDecoration: 'none'}}
      color='primary'
      variant={variant}
      component="a"
      href={this.props.w3w.etherscanFormat(type, data)}
      target="_blank"
    >
      {display}
    </Typography>
  )
}
