import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, TableFooter } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import { useWeb3Context } from 'web3-react/hooks'
import { getEtherscanLink } from 'web3-react/utilities'

const styles = theme => ({
  addAddress: {
    textAlign: 'left'
  },
  link: {
    textDecoration: 'none',
    color: theme.typography.title.color
  }
})

export default withStyles(styles)(function SnowflakeAddresses ({ classes, associatedAddresses }) {
  const context = useWeb3Context()

  return (
    <div style={{width: '100%'}}>
      <Typography>Authorize another Ethereum wallet to access your Snowflake Identity.</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Address</TableCell>
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
