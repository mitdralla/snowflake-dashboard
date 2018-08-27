import React from 'react';
import Typography from '@material-ui/core/Typography';

import contracts from './contracts'

export function getContract (contractName, isResolver) {
  let contractData

  if (isResolver) {
    const resolvers = contracts[this.props.w3w.getNetworkName()].resolvers
    if (Object.keys(resolvers).includes(contractName)) {
      contractData = resolvers[contractName]
      contractData.address = contractName
    } else {
      const genericResolverABI = [{"constant":true,"inputs":[],"name":"snowflakeDescription","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"snowflakeName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"}],"name":"setSnowflakeAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"snowflakeAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"hydroId","type":"string"},{"name":"allowance","type":"uint256"}],"name":"onSignUp","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"}] // eslint-disable-line
      contractData = {ABI: genericResolverABI, address: contractName}
    }
  } else {
    contractData = contracts[this.props.w3w.getNetworkName()][contractName]
  }
  return this.props.w3w.getContract(contractData.ABI, contractData.address)
}

export function getAllResolvers () {
  const resolvers = contracts[this.props.w3w.getNetworkName()].resolvers

  return Object.keys(resolvers)
}

export function getResolverData (resolverAddress) {
  const getContractObj = getContract.bind(this)
  const resolverContract = getContractObj(resolverAddress, true)

  const name = resolverContract.methods.snowflakeName().call()
    .catch(() => '')
  const description = resolverContract.methods.snowflakeDescription().call()
    .catch(() => '')

  const allowance = getContractObj('snowflake', false).methods.getResolverAllowance(this.props.hydroId, resolverAddress).call()
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
        allowance:   allowance,
        address:     resolverAddress
      }
    })
}

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
