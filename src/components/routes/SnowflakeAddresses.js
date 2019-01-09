import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, TableFooter } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete'
import Typography from '@material-ui/core/Typography';
import { useWeb3Context } from 'web3-react/hooks'
import { getEtherscanLink } from 'web3-react/utilities'

import { useNamedContract } from '../../common/hooks'
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
    <div style={{width: '100%'}}>
      <Typography>Authorize another Ethereum wallet to access your Snowflake Identity.</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Address</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
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
