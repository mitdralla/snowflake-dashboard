// This is the 'Address Management' module on the 'Home' tab. It allows a user to add a new wallet address to access their Snowflake.
// It currently shows the user a table row list of wallet addresses that have been added that links to Etherscan.
// The plus button links to 'Claim Address' tab.

import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, TableFooter } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete'
import Typography from '@material-ui/core/Typography';
import { useWeb3Context } from 'web3-react'

import { useNamedContract } from '../../common/hooks'
import { getEtherscanLink } from '../../common/utilities'
import TransactionButton from '../common/TransactionButton'


const styles = theme => ({
  addAddress: {
    textAlign: 'left'
  },
  link: {
    textDecoration: 'none',
    color: theme.typography.title.color
  }
})

export default withStyles(styles)(function SnowflakeAddresses ({ classes, associatedAddresses, hydroIdAddress }) {
  const context = useWeb3Context()
  const _1484Contract = useNamedContract('1484')

  return (
    <div className="tabbedContent claimAddress">
      <Typography>Authorize another Ethereum wallet to access your Snowflake Identity.</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Address</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>

        {/* A table list row of address that have access to a users Snowflake */}
        <TableBody>
          {associatedAddresses.map(address => (
            <TableRow key={address}>
              <TableCell>
                <a
                  href={getEtherscanLink(context.networkId, 'address', address)}
                  className={classes.link}
                  target="_blank" rel='noopener noreferrer'
                  >
                  {address}
                </a>
              </TableCell>
              <TableCell padding="checkbox">
                {address !== hydroIdAddress &&
                  <TransactionButton
                    readyText={<DeleteIcon />}
                    method={() => _1484Contract.methods.removeAssociatedAddress()}
                    onConfirmation={context.forceAccountReRender}
                  />
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        {/* Redirect to claim address tab */}
        <TableFooter>
          <TableRow>
            <TableCell className={classes.addAddress}>
              <Button component={Link} to="/claim-address" variant="fab" color="primary">
                <AddIcon />
              </Button>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
})
