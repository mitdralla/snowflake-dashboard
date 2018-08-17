import React from 'react';
import Typography from '@material-ui/core/Typography';

import contracts from './contracts'

export function getContract (contractName, resolver) {
  let contractData

  if (resolver) {
    const resolvers = contracts[this.props.w3w.getNetworkName()].resolvers
    if (Object.keys(resolvers).includes(resolver)) {
      contractData = resolvers[contractName]
    } else {
      const genericResolverABI = [{"constant": true,"inputs": [],"name": "snowflakeDescription","outputs": [{"name": "","type": "string"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "snowflakeName","outputs": [{"name": "","type": "string"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "owner","outputs": [{"name": "","type": "address"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [{"name": "_address","type": "address"}],"name": "setSnowflakeAddress","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [{"name": "newOwner","type": "address"}],"name": "transferOwnership","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [],"name": "snowflakeAddress","outputs": [{"name": "","type": "address"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [{"name": "hydroId","type": "string"},{"name": "allowance","type": "uint256"}],"name": "onSignUp","outputs": [{"name": "","type": "bool"}],"payable": false,"stateMutability": "nonpayable","type": "function"},{"anonymous": false,"inputs": [{"indexed": true,"name": "previousOwner","type": "address"},{"indexed": true,"name": "newOwner","type": "address"}],"name": "OwnershipTransferred","type": "event"}] // eslint-disable-line
      contractData = {ABI: genericResolverABI, address: resolver}
    }
  } else {
    contractData = contracts[this.props.w3w.getNetworkName()][contractName]
  }

  return this.props.w3w.getContract(contractData.ABI, contractData.address)
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
