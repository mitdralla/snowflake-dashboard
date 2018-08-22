import React, { Component } from 'react';
import { withWeb3 } from 'web3-webpacked-react';
import { Table, TableHead, TableBody, TableRow, TableCell, IconButton, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

import ResolverComponents from './resolvers/index'
import ModalLink from './resolvers/ModalLink'

import { getContract, linkify } from '../common/utilities'

class SnowflakeResolvers extends Component {
  constructor(props) {
    super(props)

    this.state = {
      removeMessages: {}
    }

    this.linkify = linkify.bind(this)
    this.getContract = getContract.bind(this)
  }

  getRows() {
    const rows = []
    this.props.resolvers.forEach((resolver, index) => {
      rows[index] = {
        id: index,
        resolver: resolver,
        name: this.props.resolverDetails[resolver].name,
        description: this.props.resolverDetails[resolver].description,
        allowance: this.props.resolverDetails[resolver].allowance,
      }
    })
    return rows
  }

  getCustomResolver(resolver) {
    let customResolver = undefined
    const ResolverComponent = ResolverComponents[resolver]
    if (ResolverComponent !== undefined) {
      const resolverContract = this.getContract(resolver, true)
      customResolver = (
        <ModalLink>
          <ResolverComponent hydroId={this.props.hydroId} resolverContract={resolverContract} />
        </ModalLink>
      )
    }

    return customResolver
  }

  removeResolver(resolver) {
    this.setState(oldState => {
      return { removeMessages: {...oldState.removeMessages, [resolver]: 'Preparing Transaction'} }
    })

    this.props.w3w.sendTransaction(this.getContract('snowflake').methods.removeResolvers([resolver], false), {
      error: (error, message) => {
        console.error(error.message)
        this.setState(oldState => {
          return { removeMessages: {...oldState.removeMessages, [resolver]: 'Transaction Error'} }
        })
      },
      transactionHash: (transactionHash) => {
        this.setState(oldState => {
          return { removeMessages:
            {...oldState.removeMessages, [resolver]: this.linkify('transaction', transactionHash, 'Pending', 'body1')}
          }
        })
      },
      confirmation: (confirmationNumber, receipt) => {
        if (confirmationNumber === 0) {
          this.props.getAccountDetails(true)
        }
      }
    })
  }

  render() {
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Resolver</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Allowance</TableCell>
            <TableCell>Custom Data</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.getRows().map(row => {
            return (
              <TableRow key={row.id}>
                <TableCell>{this.linkify('address', row.resolver, undefined, 'body1')}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell numeric>{row.allowance}</TableCell>
                <TableCell>{this.getCustomResolver(row.resolver)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => this.removeResolver(row.resolver)}>
                    <DeleteIcon />
                  </IconButton>
                  <Typography variant='body1' gutterBottom align="center" color="textPrimary">
                    {this.state.removeMessages[row.resolver]}
                  </Typography>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    )
  }
}

export default withWeb3(SnowflakeResolvers)
