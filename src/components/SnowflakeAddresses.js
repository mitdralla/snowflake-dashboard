import React, { Component } from 'react';
import { withWeb3 } from 'web3-webpacked-react';
import { Checkbox, Table, TableHead, TableBody, TableRow, TableCell, TableFooter } from '@material-ui/core';
import { Toolbar, Button, IconButton, TextField } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import { withStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import TransactionButton from './TransactionButton'
import Modal from './Modal'

import { getContract, linkify } from '../common/utilities'

const styles = {
  addAddress: {
    position: 'absolute',
    padding: 0,
    left: 0,
    right: 0,
    width: 56,
    margin: '5px auto',
    textAlign: 'center'
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
      isSelected:     isSelected,
      addressToClaim: ''
    }

    // get random value
    const randomValues = new Uint32Array(1)
    window.crypto.getRandomValues(randomValues)
    this.hashedSecret = this.props.w3w.web3js.utils.sha3(randomValues[0].toString())
    this.details = {
      hashedSecret: this.hashedSecret
    }

    this.getContract = getContract.bind(this)
    this.linkify = linkify.bind(this)
  }

  updateClaim = (address) => {
    this.claim = this.props.w3w.web3js.utils.soliditySha3(address.toLowerCase(), this.hashedSecret, this.props.hydroId)
    this.details = {...this.details,
      hydroId: this.props.hydroId,
      address: address.toLowerCase()
    }
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

    const addButton = props => {
      return (
        <Button variant="fab" color="primary" {...props}>
          <AddIcon />
        </Button>
      )
    }

    return (
      <div style={{width: '100%'}}>
        <Toolbar style={{width: '100%'}}>
          {anySelected ? (
            <TransactionButton
              buttonInitial='Remove'
              method={this.getContract('snowflake').methods.unclaim(selectedAddresses)}
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
              <TableCell padding="none" className={this.props.classes.addAddress}>
                <Modal
                  opener={addButton}
                  title='Add an Address'
                >
                  <form noValidate autoComplete="off">
                    <TextField
                      label='Address'
                      helperText='Must be able to transact from this address'
                      margin="normal"
                      value={this.state.addressToClaim}
                      onChange={(e) => {
                        this.setState({addressToClaim: e.target.value})
                        this.updateClaim(e.target.value)
                      }}
                      fullWidth
                    />
                    <TransactionButton
                      buttonInitial='Initiate Claim'
                      method={this.getContract('snowflake').methods.initiateClaim(this.claim)}
                      onTransactionHash={() => {
                        this.props.addClaim(this.details.address, this.details)
                      }}
                    />
                  </form>
                </Modal>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    )
  }
}

export default withStyles(styles)(withWeb3(SnowflakeAddresses))
