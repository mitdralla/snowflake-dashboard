import React, { Component } from 'react';
import { withWeb3 } from 'web3-webpacked-react';
import { Checkbox, Table, TableHead, TableBody, TableRow, TableCell, TableFooter } from '@material-ui/core';

import ResolverComponents from './resolvers/index'
import ResolverModal from './resolvers/ResolverModal'
import StoreModal from './StoreModal'

import { getContract, linkify } from '../common/utilities'

class SnowflakeResolvers extends Component {
  constructor(props) {
    super(props)

    const isSelected = {}
    const rows = []
    this.props.resolvers.forEach((resolver, index) => {
      isSelected[index] = false

      rows[index] = {
        id: index,
        resolver: resolver,
        name: this.props.resolverDetails[resolver].name,
        description: this.props.resolverDetails[resolver].description,
        allowance: this.props.resolverDetails[resolver].allowance,
      }
    })

    this.state = {
      rows: rows,
      isSelected: isSelected
    }

    this.linkify = linkify.bind(this)
    this.getContract = getContract.bind(this)
  }

  getCustomResolver(resolver) {
    let customResolver = undefined
    const ResolverComponent = ResolverComponents[resolver]
    if (ResolverComponent !== undefined) {
      const resolverContract = this.getContract(resolver, true)
      customResolver = (
        <ResolverModal>
          <ResolverComponent hydroId={this.props.hydroId} resolverContract={resolverContract} />
        </ResolverModal>
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

  handleClick = (e, id) => {
    this.setState(oldState => {
      return {isSelected: {...oldState.isSelected, [id]: !oldState.isSelected[id]}}
    })
  }

  render() {

    return (
      <div style={{overflowX: 'auto'}}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
              </TableCell>
              <TableCell>Resolver</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Allowance</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.rows.map(row => {
              return (
                <TableRow
                  hover
                  onClick={e => this.handleClick(e, row.id)}
                  role="checkbox"
                  aria-checked={this.state.isSelected[row.id]}
                  key={row.id}
                  selected={this.state.isSelected[row.id]}
                >
                  <TableCell>
                    <Checkbox checked={this.state.isSelected[row.id]} />
                  </TableCell>
                  <TableCell>{this.linkify('address', row.resolver, undefined, 'body1')}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell numeric>{row.allowance}</TableCell>
                  <TableCell>{this.getCustomResolver(row.resolver)}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell key={this.props.resolvers} style={{textAlign: 'center'}} colSpan={6}>
                <StoreModal hydroId={this.props.hydroId} addedResolvers={this.props.resolvers} getAccountDetails={this.props.getAccountDetails} />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    )
  }
}

export default withWeb3(SnowflakeResolvers)
