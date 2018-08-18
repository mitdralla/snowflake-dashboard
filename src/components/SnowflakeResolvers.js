import React, { Component } from 'react';
import { withWeb3 } from 'web3-webpacked-react';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';

import ResolverComponents from './resolvers/index'
import ModalLink from './resolvers/ModalLink'

import { getContract, linkify } from '../common/utilities'

class SnowflakeResolvers extends Component {
  constructor(props) {
    super(props)

    this.linkify = linkify.bind(this)
    this.getContract = getContract.bind(this)

    const rows = []
    const customResolvers = {}
    this.props.resolvers.forEach((resolver, index) => {
      rows[index] = {
        id: index,
        resolver: resolver,
        name: this.props.resolverDetails[resolver].name,
        description: this.props.resolverDetails[resolver].description,
        allowance: this.props.resolverDetails[resolver].allowance,
      }

      const ResolverComponent = ResolverComponents[resolver]
      if (ResolverComponent !== undefined) {
        const resolverContract = this.getContract(resolver, true)
        customResolvers[resolver] = (
          <ModalLink>
            <ResolverComponent hydroId={this.props.hydroId} resolverContract={resolverContract} />
          </ModalLink>
        )
      }
    })

    this.state = {
      rows: rows,
      customResolvers: customResolvers
    }
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
          </TableRow>
        </TableHead>
        <TableBody>
          {this.state.rows.map(row => {
            return (
              <TableRow key={row.id}>
                <TableCell>{this.linkify('address', row.resolver, undefined, 'body1')}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell numeric>{row.allowance}</TableCell>
                <TableCell>{this.state.customResolvers[row.resolver]}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    )
  }
}

export default withWeb3(SnowflakeResolvers)
