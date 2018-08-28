import React, { Component } from 'react';
import { withWeb3 } from 'web3-webpacked-react';
import { Button, Toolbar, Checkbox, Table, TableHead, TableBody, TableRow, TableCell, TableFooter } from '@material-ui/core';
import { withStyles } from '@material-ui/core';

import TransactionButton from './TransactionButton'
import ResolverComponents from './resolvers/index'
import ResolverModal from './resolvers/ResolverModal'
import StoreModal from './StoreModal'

import { getContract, linkify } from '../common/utilities'

const styles = {
  addResolver: {
    position: 'absolute',
    padding: 0,
    left: 0,
    right: 0,
    width: 56,
    margin: '5px auto',
    textAlign: 'center'
  }
}

class SnowflakeResolvers extends Component {
  constructor(props) {
    super(props)

    const isSelected = {}
    const rows = {}
    this.props.resolvers.forEach(resolver => {
      isSelected[resolver] = false

      rows[resolver] = {
        id:          resolver,
        resolver:    resolver,
        name:        this.props.resolverDetails[resolver].name,
        description: this.props.resolverDetails[resolver].description,
        allowance:   this.props.resolverDetails[resolver].allowance,
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
        <ResolverModal resolverName={this.state.rows[resolver].name}>
          <ResolverComponent hydroId={this.props.hydroId} resolverContract={resolverContract} />
        </ResolverModal>
      )
    }

    return customResolver
  }

  handleClick = (e, id) => {
    this.setState(oldState => {
      return {isSelected: {...oldState.isSelected, [id]: !oldState.isSelected[id]}}
    })
  }

  render() {
    const anySelected = Object.values(this.state.isSelected).some(x => x)
    const anyNotSelected = Object.values(this.state.isSelected).some(x => !x)
    const allSelected = Object.values(this.state.isSelected).every(x => x)

    const selectedResolvers = Object.keys(this.state.isSelected).filter(key => this.state.isSelected[key])

    return (
      <div style={{width: '100%'}}>
        <Toolbar style={{width: '100%'}}>
          {anySelected ? (
            <TransactionButton
              buttonInitial='Remove'
              method={this.getContract('snowflake').methods.removeResolvers(selectedResolvers, false)}
              onConfirmation={() => { this.props.getAccountDetails(true) }}
            />
            ) :
            <Button disabled>''</Button>
          }
        </Toolbar>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                {this.props.resolvers.length > 0 ? (
                  <Checkbox
                    indeterminate={anySelected && anyNotSelected}
                    checked={allSelected}
                    onChange={() => {
                      this.setState(oldState => {
                        const newIsSelected = {}
                        let targetValue = true
                        if (allSelected) targetValue = false
                        Object.keys(oldState.isSelected).forEach(x => { newIsSelected[x] = targetValue})
                        return {isSelected: newIsSelected}
                      })
                    }}
                  />
                ) :
                  ''
                }
              </TableCell>
              <TableCell>Resolver</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Allowance</TableCell>
              <TableCell padding="checkbox"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.values(this.state.rows).map(row => {
              return (
                <TableRow
                  hover
                  onClick={e => this.handleClick(e, row.id)}
                  role="checkbox"
                  aria-checked={this.state.isSelected[row.id]}
                  key={row.id}
                  selected={this.state.isSelected[row.id]}
                >
                  <TableCell padding="checkbox">
                    <Checkbox checked={this.state.isSelected[row.id]} />
                  </TableCell>
                  <TableCell>{this.linkify('address', row.resolver, undefined, 'body1')}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell numeric>{row.allowance}</TableCell>
                  <TableCell padding="checkbox">{this.getCustomResolver(row.resolver)}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell key={this.props.resolvers} padding="none" className={this.props.classes.addResolver}>
                <StoreModal
                  hydroId={this.props.hydroId}
                  addedResolvers={this.props.resolvers}
                  getAccountDetails={this.props.getAccountDetails}
                />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    )
  }
}

export default withWeb3(withStyles(styles)(SnowflakeResolvers))
