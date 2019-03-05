// This is the 'Resolver Management' module on the 'Home' tab. It allows a user to add and view their added resolvers (dApps).
// It currently shows the user a table row list of wallet addresses that have been added that links to Etherscan.
// The plus button links to 'Claim Address' tab.

import React, { useReducer } from 'react'
import { Toolbar, Checkbox, Table, TableHead, TableBody, TableRow, TableCell, TableFooter } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { withRouter } from "react-router"
import { Button } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import { withStyles } from '@material-ui/core'
import { TextField } from '@material-ui/core'
import SwapVertIcon from '@material-ui/icons/SwapVert'
import Typography from '@material-ui/core/Typography'
import { useWeb3Context } from 'web3-react/hooks'
import { fromDecimal } from 'web3-react/utilities'
import { getEtherscanLink } from 'web3-react/utilities'

import { useNamedContract } from '../../common/hooks'
import TransactionButton from '../common/TransactionButton'
import ResolverModal from '../resolvers/ResolverModal'

const styles = theme => ({
  addResolver: {
    textAlign: 'left'
  },
  link: {
    textDecoration: 'none',
    color: theme.typography.title.color
  }
})

// Not sure what this is currently doing.
function allowancesReducer (state, action) {
  switch (action.type) {
    case 'change': {
      const changed = state.slice()
      changed[action.index] = action.newValue
      return changed
    }
    case 'reset':
      return action.newValues
    default:
      throw Error('This should not happen.')
  }
}

// Not sure what this is currently doing.
function selectedReducer (state, action) {
  switch (action.type) {
    case 'toggle': {
      const changed = state.slice()
      changed[action.index] = !changed[action.index]
      return changed
    }
    case 'toggleAllOn':
      return Array(state.length).fill(true)
    case 'toggleAllOff':
      return Array(state.length).fill(false)
    default:
      throw Error('This should not happen.')
  }
}

export default
  withRouter(
    withStyles(styles)(
      function SnowflakeResolvers ({ classes, resolvers, resolverDetails, resolverAllowances, ein }) {
  const context = useWeb3Context()
  const [selectedResolvers, dispatchSelected] = useReducer(
    selectedReducer, Array(Object.keys(resolverAllowances).length).fill(false)
  )
  const [newAllowances, dispatchAllowance] = useReducer(allowancesReducer, resolverAllowances)

  const snowflakeContract = useNamedContract('snowflake')
  const clientRaindropAddress = useNamedContract('clientRaindrop')._address

  const handleCheckboxClick = (resolver, i) => {
    dispatchAllowance({ type: 'reset', newValues: resolverAllowances })
    dispatchSelected({ type: 'toggle', index: i })
  }

  const anySelected = selectedResolvers.some(x => x)
  const anyNotSelected = selectedResolvers.some(x => !x)
  const allSelected = selectedResolvers.every(x => x)

  const allowanceChanged = newAllowances
    .map((newAllowance, i) => newAllowance !== resolverAllowances[i])
    .some(x => x)

  return (
    <div style={{width: '100%'}}>
      <Typography>Manage Resolvers linked to your 1484 Snowflake Identity.</Typography>

      <Toolbar style={{visibility: anySelected ? 'visible' : 'hidden'}}>

       {/* This button is initially hidden but appears when you check off the resolver (dApp) row in the table.
         This allows the user to edit the HYDRO allowance. This button confirms the update and preforms the transaction. */}
        <TransactionButton
          show={allowanceChanged}
          readyText={<React.Fragment>Update Allowances<SwapVertIcon/></React.Fragment>}
          method={() => snowflakeContract.methods.changeResolverAllowances(
            resolvers.filter((r, i) => selectedResolvers[i]),
            newAllowances.filter((a, i) => selectedResolvers[i]).map(a => fromDecimal(a, 18))
          )}
          onConfirmation={context.forceAccountReRender}
        />
      </Toolbar>

      {/* Table for displaying the users resolvers (dApps). */}
      <Table>
        <TableHead>
          <TableRow>

            {/* Toggles all rows as 'selected' or as 'unselected' */}
            <TableCell padding="checkbox">
              {resolvers.length === 0 ? '' : (
                <Checkbox
                  indeterminate={anySelected && anyNotSelected}
                  checked={allSelected}
                  onChange={() => {
                    dispatchSelected({ type: allSelected ? 'toggleAllOff' : 'toggleAllOn' })
                  }}
                />
              )}
            </TableCell>
            <TableCell>Resolver</TableCell>
            <TableCell>Name</TableCell>
            <TableCell padding="checkbox"></TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Allowance</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {resolvers.map((resolver, i) => (
            <TableRow
              hover
              role="checkbox"
              aria-checked={selectedResolvers[i]}
              key={resolver}
              selected={selectedResolvers[i]}
            >

              {/* Toggles the editability of the resolver row, the HYDRO allowance amount becomes a text input field.
                Once you enter text in the field, "UPDATE ALLOWANCES" button appears, which you can click to SAVE the data.
                Upon savin the data MetaMask opens. Once you confirm the transaction, the button toggles to processing and an
                animation appears. Once the transaction succeeds, your ammount is reflected in the row, and your total balance is updated.
                Currently not certain if fully working/buggy. It ultimately updated buy only after page load. Could be due to confirmation times. */}
              <TableCell padding="checkbox">
                <Checkbox checked={selectedResolvers[i]} onClick={() => handleCheckboxClick(resolver, i)} />
              </TableCell>

              {/* Link to open Smart Contract in Etherscan. - potential enhancement, link to #tokentxns */}
              <TableCell>
                <a
                  href={getEtherscanLink(context.networkId, 'address', resolver)}
                  className={classes.link}
                  target="_blank" rel='noopener noreferrer'
                  >
                  {resolver}
                </a>
              </TableCell>

              {/* The name of the resolver (dApp). */}
              <TableCell>{resolverDetails[i].name}</TableCell>

              {/* Icon/link to open the resolver (dApp). */}
              <TableCell padding="checkbox">
                {resolverDetails[i].component === null ? '' :
                  <ResolverModal ein={ein}>
                    {resolverDetails[i].component}
                  </ResolverModal>
                }
              </TableCell>

              {/* The description of the resolver (dApp). */}
              <TableCell>{resolverDetails[i].description}</TableCell>

              {/* A number display of the amount of HYDRO in the resolvers (dApps) allowance. Example: 500 */}
              <TableCell >
                {!selectedResolvers[i] ? resolverAllowances[i] :
                  <TextField
                    style={{margin: 0, width: 80}}
                    id={resolver}
                    value={newAllowances[i]}
                    onChange={e => dispatchAllowance({ type: 'change', newValue: e.target.value, index: i })}
                    type="number"
                    margin="normal"
                  />
                }
              </TableCell>

              {/* Button/icon to remove resolver (dApp) from Snowflake. */}
              <TableCell padding="checkbox">
                {resolver !== clientRaindropAddress &&
                  <TransactionButton
                    readyText={<DeleteIcon />}
                    method={() => snowflakeContract.methods.removeResolver(resolver, true, '0x00')}
                    onConfirmation={context.forceAccountReRender}
                  />
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>

            {/* Button to add a resolver (dApp) - redirects to dApp store. */}
            <TableCell className={classes.addResolver}>
              <Button component={Link} to="/dapp-store" variant="fab" color="primary">
                <AddIcon />
              </Button>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}))
