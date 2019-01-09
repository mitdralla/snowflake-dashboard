import React, { useState, useReducer, Suspense } from 'react';
import { TextField, Button, GridList, GridListTile, GridListTileBar } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import DoneIcon from '@material-ui/icons/Done';
import { Snackbar, SnackbarContent } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { Link } from 'react-router-dom'
import { useWeb3Context, useNetworkName } from 'web3-react/hooks'
import { fromDecimal } from 'web3-react/utilities'
import { Dialog, DialogActions, DialogContent } from '@material-ui/core';

import ALL_SNOWFLAKE_RESOLVERS from '../resolvers'

import { useEINDetails, useResolverDetails, useSnowflakeBalance, useNamedContract } from '../../common/hooks'

import TransactionButton from '../common/TransactionButton'

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 618,
    height: 618,
  },
  subheader: {
    width: '100%',
  },
  icon: {
    color: 'rgba(255, 255, 255, 1)',
  },
  modal: {
    top: '50%',
    left: '50%',
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  }
})

const initialHydroSnackbar = {
  show: false,
  allowance: ''
}

function hydroSnackbarReducer (state, action) {
  switch (action.type) {
    case 'show':
      return { show: true, allowance: action.allowance }
    case 'hide':
      return { ...state, show: false }
    default:
      return initialHydroSnackbar
  }
}

export default withStyles(styles)(function DAppStore ({ classes, ein }) {
  const [resolverAddress, setResolverAddress] = useState('')
  const [allowance, setAllowance] = useState('')
  const [hydroSnackbar, dispatchHydroSnackbar] = useReducer(hydroSnackbarReducer, initialHydroSnackbar)
  const [alreadySetSnackbar, setAlreadySetSnackbar] = useState(false)

  const [extraDataModalOpen, setExtraDataModalOpen] = useState(true)
  const [extraData, setExtraData] = useState('0x00')

  const context = useWeb3Context()
  const networkName = useNetworkName()
  const snowflakeContract = useNamedContract('snowflake')

  const allResolvers = ALL_SNOWFLAKE_RESOLVERS[networkName]

  const einDetails = useEINDetails(ein)
  const snowflakeBalance = useSnowflakeBalance(ein)
  const resolverDetails = useResolverDetails(allResolvers)

  const ready = einDetails && resolverDetails && snowflakeBalance

  function receiveExtraData(extraData) {
    setExtraData(extraData)
    setExtraDataModalOpen(false)
  }

  const recognizedResolver = allResolvers.includes(resolverAddress)
  const recognizedResolverIndex = allResolvers.findIndex(e => e === resolverAddress)

  return (
    <div>
      {!ready ? undefined : (
        <>
          <TextField
            label="Resolver Address"
            helperText="A Resolver address."
            margin="normal"
            value={resolverAddress}
            onChange={e => setResolverAddress(e.target.value)}
            fullWidth
          />
          <TextField
            label="Allowance"
            type="number"
            helperText="The amount of Hydro this Resolver may withdraw on your behalf."
            margin="normal"
            value={allowance}
            onChange={e => setAllowance(e.target.value)}
            fullWidth
          />

        {recognizedResolver && resolverDetails[recognizedResolverIndex].extraDataComponent &&
            <Dialog
              fullScreen
              open={extraDataModalOpen}
              onClose={() => {
                setResolverAddress('')
                setAllowance('')
              }}
            >
              <DialogContent>
                <Suspense fallback={<div />}>
                  {React.createElement(
                    resolverDetails[recognizedResolverIndex].extraDataComponent,
                    { ein: ein, sendExtraData: receiveExtraData }
                  )}
                </Suspense>
              </DialogContent>

              <DialogActions>
                <Button onClick={() => {
                    setResolverAddress('')
                    setAllowance('')
                  }}
                  color="primary"
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          }

          <TransactionButton
            show={resolverAddress !== '' && context.library.utils.checkAddressChecksum(resolverAddress)}
            readyText='Set Resolver'
            method={() => snowflakeContract.methods.addResolver(
              resolverAddress, true, fromDecimal(allowance, 18), extraData
            )}
            onConfirmation={context.forceAccountReRender}
          />

          <div className={classes.root}>
            <GridList className={classes.gridList} spacing={6} cellHeight={200} cols={3}>
              {allResolvers.map((resolver, i) => (
                <GridListTile
                  style={{cursor: 'pointer'}}
                  cols={1}
                  key={resolver}
                  onClick={() => {
                    if (einDetails.resolvers.includes(resolver)) {
                      setResolverAddress('')
                      setAllowance('')
                      setAlreadySetSnackbar(true)
                    } else if (Number(snowflakeBalance) < Number(resolverDetails[i].requiredAllowance)) {
                      setResolverAddress('')
                      setAllowance('')
                      dispatchHydroSnackbar({ type: 'show', allowance: resolverDetails[i].requiredAllowance })
                    } else {
                      setResolverAddress(resolver)
                      setAllowance(resolverDetails[i].requiredAllowance)
                    }
                  }}
                  >
                  <img src={resolverDetails[i].logo} alt={resolverDetails[i].name}/>
                  <GridListTileBar
                    title={resolverDetails[i].name}
                    subtitle={<span>{resolverDetails[i].description}</span>}
                    actionIcon={
                      <DoneIcon
                        style={einDetails.resolvers.includes(resolver) ? {} : { display: 'none' }}
                        className={classes.icon}
                      />
                    }
                    />
                </GridListTile>
              ))}
            </GridList>
          </div>

          <div>
            <Snackbar
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              open={alreadySetSnackbar}
              autoHideDuration={5000}
              onClose={(e, reason) => reason === "clickaway" ? null : setAlreadySetSnackbar(true)}
              ContentProps={{
                'aria-describedby': 'message-id',
              }}
              message={<span id="message-id">You have already added this resolver.</span>}
              action={[
                <IconButton
                  key="close"
                  color="inherit"
                  className={classes.close}
                  onClick={() => setAlreadySetSnackbar(false)}
                  >
                  <CloseIcon />
                </IconButton>,
              ]}
              />

            <Snackbar
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
              }}
              autoHideDuration={10000}
              open={hydroSnackbar.show}
              onClose={(e, reason) => reason === "clickaway" ? null : dispatchHydroSnackbar({ type: 'hide' })}
              >
              <SnackbarContent
                className={classes.success}
                message={<p>Insufficient Balance. Required: {hydroSnackbar.allowance} HYDRO.</p>}
                action={[
                  <Button
                    component={Link}
                    to="/get-hydro"
                    key="get"
                    size="small"
                    color="primary"
                    >
                    Get HYDRO
                  </Button>,
                  <IconButton
                    key="close"
                    color="inherit"
                    className={classes.close}
                    onClick={() => dispatchHydroSnackbar({ type: 'hide' })}
                    >
                    <CloseIcon />
                  </IconButton>
                ]}
                />
            </Snackbar>
          </div>
        </>
      )}
    </div>
  )
})
