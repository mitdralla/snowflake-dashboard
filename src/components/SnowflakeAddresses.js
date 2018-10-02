import React, { Component } from 'react';
import { withWeb3 } from 'web3-webpacked-react';
import { Checkbox, Table, TableHead, TableBody, TableRow, TableCell, TableFooter } from '@material-ui/core';
import { Toolbar, Button, IconButton } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';

import TransactionButton from './TransactionButton'

import { getContract, linkify } from '../common/utilities'

const styles = {
  addAddress: {
    textAlign: 'left'
  }
}

class SnowflakeAddresses extends Component {
  constructor(props) {
    super(props)

    const isSelected = {}
    const rows = {}
    this.props.ownedAddresses.forEach(address => {
      if (this.props.owner !== address) isSelected[address] = false

      rows[address] = {
        id:      address,
        address: address,
        owner:   this.props.owner === address
      }
    })

    this.state = {
      rows:           rows,
      isSelected:     isSelected
    }

    this.getContract = getContract.bind(this)
    this.linkify = linkify.bind(this)
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

    const selectedAddresses = Object.keys(this.state.isSelected).filter(key => this.state.isSelected[key])

    const rows = Object.values(this.state.rows).map(row => {
      const extraProps = row.owner ? {} : {
        role:           "checkbox",
        hover:          true,
        onClick:        e => this.handleClick(e, row.id),
        'aria-checked': this.state.isSelected[row.id],
        selected:       this.state.isSelected[row.id]
      }

      return (
        <TableRow
          key={row.id}
          {...extraProps}
        >
          <TableCell padding="checkbox">
            {row.owner ? '' : <Checkbox checked={this.state.isSelected[row.id]} />}
          </TableCell>
          <TableCell>{this.linkify('address', row.address, undefined, 'body1')}</TableCell>
          <TableCell>{row.owner ? <IconButton disabled><DoneIcon /></IconButton> : undefined}</TableCell>
        </TableRow>
      )
    })

    return (
      <div style={{width: '100%'}}>
        <Typography>Authorize another Ethereum wallet to access your Snowflake Identity.</Typography>
        <Toolbar style={{visibility: anySelected ? 'visible' : 'hidden'}}>
          <TransactionButton
            buttonInitial={<AddIcon/>}
            method={this.getContract('snowflake').methods.unclaim(selectedAddresses)}
            onConfirmation={this.props.getAccountDetails}
          />
        </Toolbar>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                {this.props.ownedAddresses.length > 1 ? (
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
              <TableCell>Address</TableCell>
              <TableCell>Owner</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className={this.props.classes.addAddress}>
                <Button component={Link} to="/claim-address" variant="fab" color="primary">
                  <AddIcon />
                </Button>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    )
  }
}

export default withStyles(styles)(withWeb3(SnowflakeAddresses))
