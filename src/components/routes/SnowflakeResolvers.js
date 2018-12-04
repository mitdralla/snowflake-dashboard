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
        <TransactionButton
          show={allowanceChanged}
          readyText={<React.Fragment>Update Allowances<SwapVertIcon/></React.Fragment>}
          method={() => snowflakeContract.methods.changeResolverAllowances(
            resolvers.filter((r, i) => selectedResolvers[i]),
            newAllowances.filter((r, i) => selectedResolvers[i])
          )}
          onConfirmation={context.reRenderers.forceAccountReRender}
        />
      </Toolbar>

      <Table>
        <TableHead>
          <TableRow>
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
              <TableCell padding="checkbox">
                <Checkbox checked={selectedResolvers[i]} onClick={() => handleCheckboxClick(resolver, i)} />
              </TableCell>
              <TableCell>
                <a
                  href={getEtherscanLink(context.networkId, 'address', resolver)}
                  className={classes.link}
                  target="_blank" rel='noopener noreferrer'
                  >
                  {resolver}
                </a>
              </TableCell>
              <TableCell>{resolverDetails[i].name}</TableCell>
              <TableCell padding="checkbox">
                {resolverDetails[i].component === null ? '' :
                  <ResolverModal ein={ein}>
                    {resolverDetails[i].component}
                  </ResolverModal>
                }
              </TableCell>
              <TableCell>{resolverDetails[i].description}</TableCell>
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
              <TableCell padding="checkbox">
                {resolver !== clientRaindropAddress &&
                  <TransactionButton
                    readyText={<DeleteIcon />}
                    method={() => snowflakeContract.methods.removeResolver(
                      resolver, true, '0x00'
                    )}
                    onConfirmation={context.reRenderers.forceAccountReRender}
                  />
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
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
