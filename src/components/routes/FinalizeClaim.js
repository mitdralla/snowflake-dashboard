import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router'
import { withStyles } from '@material-ui/core/styles';
import { getEtherscanLink } from 'web3-react/utilities'
import { useAccountEffect, useWeb3Context } from 'web3-react/hooks'
import { Link, Redirect } from 'react-router-dom'
import { TextField } from '@material-ui/core';
import { fromRpcSig, toRpcSig, isValidChecksumAddress } from 'ethereumjs-util'

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import DeleteIcon from '@material-ui/icons/Delete';
import { Typography } from '@material-ui/core';
import { Button } from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';

import { useNamedContract, useEIN, useSessionStorageState } from '../../common/hooks'
import TransactionButton from '../common/TransactionButton'
import SignatureButton from '../common/SignatureButton'
import Copyable from '../common/Copyable'

const styles = theme => ({
  snackbar: {
    maxWidth: '45%'
  },
  warning: {
    backgroundColor: theme.palette.error.main
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  white: {
    color: "white"
  }
})

const SECONDS_IN_DAY = 60 * 60 * 24

function SignWithApproving ({ ein, setCurrentClaim }) {
  const context = useWeb3Context()
  const _1484Contract = useNamedContract('1484')

  const [targetAddress, setTargetAddress] = useState('')
  const [targetAddressError, setTargetAddressError] = useState(undefined)

  useAccountEffect(() => {
    if (targetAddress === '') {
      setTargetAddressError(undefined)
      return
    }
    else {
      if (!isValidChecksumAddress(targetAddress)) {
        setTargetAddressError('Invalid address.')
        return
      }

      _1484Contract.methods.hasIdentity(targetAddress).call()
        .then(result => {
          if (result)
            setTargetAddressError('Address is already associated with an Identity.')
          else
            setTargetAddressError(null)
        })
    }
  }, [targetAddress])

  const [activeStep, setActiveStep] = useState(0)

  function stepBack () { setActiveStep(activeStep - 1) }
  function stepForward () { setActiveStep(activeStep + 1) }

  const timestamp = useRef(Math.round(new Date() / 1000) - 120)
  const message = targetAddressError !== null ? null : context.library.utils.soliditySha3(
    '0x19', '0x00', _1484Contract._address,
    'I authorize adding this address to my Identity.',
    ein,
    targetAddress,
    timestamp.current
  )

  return (
    <>
      <Typography variant='h4' gutterBottom color="textPrimary">
        Link a new address to your EIN.
      </Typography>

      <Stepper activeStep={activeStep} orientation="vertical">
        <Step key={0}>
          <StepLabel>{activeStep === 0 ? 'Address to Add' : `Address to Add: ${targetAddress}`}</StepLabel>
          <StepContent>
            Enter the address you wish to claim under your current identity. You need to be able to transact from this address.
            <TextField
              key='Address to Add'
              label='Address to Add'
              helperText={!targetAddressError ? 'You will need to transact from this address.' : targetAddressError}
              error={!!targetAddressError}
              required
              margin="normal"
              value={targetAddress}
              onChange={e => setTargetAddress(e.target.value)}
              fullWidth
            />
            <Button
              variant="contained"
              disabled={targetAddress === '' || targetAddressError !== null}
              onClick={stepForward}
            >
              Next
            </Button>
          </StepContent>
        </Step>

        <Step key={1}>
          <StepLabel>Give Permission</StepLabel>
          <StepContent>
            The next step is for you to give us permission to link this address to your Identity. This requires your signature of a hashed permission string.
            <br />
            <Button
              variant="contained"
              style={{marginRight: '15px'}}
              onClick={stepBack}
            >
              Back
            </Button>
            <SignatureButton
              readyText='Sign'
              message={message}
              onSuccess={signature => {
                setCurrentClaim({
                  targetAddress: targetAddress,
                  targetIsApproving: 0,
                  signingAddress: context.account,
                  signature: signature,
                  timestamp: timestamp.current
                })
              }}
            />
          </StepContent>
        </Step>
      </Stepper>
    </>
  )
}

const ApproveClaim = withStyles(styles)(function ApproveClaim ({ classes, location, claim, deleteCurrentClaim, setRedirect }) {
  const context = useWeb3Context()
  const _1484Contract = useNamedContract('1484')
  const ein = useEIN(claim.targetIsApproving ? claim.targetAddress : claim.signingAddress)

  function getUrlFromClaim ({ targetAddress, targetIsApproving, signingAddress, signature, timestamp}) {
    const { v, r, s } = signature
    const encodedSignature = toRpcSig(v, r, s)
    return [
      window.location.origin,
      process.env.PUBLIC_URL,
      location.pathname,
      `/${targetAddress}/${Number(targetIsApproving)}/${signingAddress}/${encodedSignature}/${timestamp}`
    ].join('')
  }

  if (!ein) return null

  if (context.account.toLowerCase() === claim.targetAddress.toLowerCase())
    return (
      <>
        <Typography gutterBottom color="textPrimary">
          Finalize the link between this address (
          <a
            href={getEtherscanLink(context.networkId, 'address', context.account)}
            className={classes.link}
            target="_blank" rel='noopener noreferrer'
          >
            {context.account}
          </a>
          ) and your EIN ({ein}).
        </Typography>

        <TransactionButton
          readyText='Finalize'
          method={() => _1484Contract.methods.addAssociatedAddress(
            claim.targetIsApproving ? claim.targetAddress : claim.signingAddress,
            claim.targetIsApproving ? claim.signingAddress : claim.targetAddress,
            claim.signature.v, claim.signature.r, claim.signature.s, claim.timestamp
          )}
          onConfirmation={() => {
            setRedirect(true)
            deleteCurrentClaim()
            context.forceAccountReRender()
          }}
        />

        <Button onClick={deleteCurrentClaim}>
          Delete Claim
          <DeleteIcon className={classes.rightIcon} />
        </Button>
      </>
    )

  return (
    <>
      <Typography gutterBottom color="textPrimary">
        Claim detected! Please switch to{' '}
        <a
          href={getEtherscanLink(context.networkId, 'address', claim.targetAddress)}
          className={classes.link}
          target="_blank" rel='noopener noreferrer'
          >
          {claim.targetAddress}
        </a>
        {' '}to finalize your claim.
      </Typography>

      <Typography gutterBottom color="textPrimary">
        If that account is only available on another devices, you may finalize the claim by visiting this URL:
      </Typography>
      <Copyable key="copy" placement="top" value={getUrlFromClaim(claim)}>
        <Button>
          Copy Link
          <FileCopyIcon className={classes.rightIcon} />
        </Button>
      </Copyable>
      <Typography gutterBottom color="textPrimary">
        You may also delete this claim if you no longer wish to link your address:
      </Typography>
      <Button onClick={deleteCurrentClaim}>
        Delete Claim
        <DeleteIcon className={classes.rightIcon} />
      </Button>
    </>
  )
})

export default withRouter(function FinalizeClaim ({ ein, location, history }) {
  const context = useWeb3Context()
  const [currentClaim, setCurrentClaim, deleteCurrentClaim] = useSessionStorageState(
    null, `SnowflakeClaim|${context.networkId}`
  )
  const [redirect, setRedirect] = useState(false)

  // one-time state initialization
  useEffect(() => {
    if (location.state) {
      try {
        if (!isValidChecksumAddress(location.state.targetAddress)) throw Error('Invalid target address.')
        if (![0, 1].includes(Number(location.state.targetIsApproving))) throw Error('Invalid targetIsApproving flag.')
        if (!isValidChecksumAddress(location.state.signingAddress)) throw Error('Invalid signing address.')
        if (!Number.isInteger(Number(location.state.timestamp))) throw Error('Invalid timestamp.')
        const now = Math.round(Date.now() / 1000)
        if (Number(location.state.timestamp) < now - (SECONDS_IN_DAY * .95)) throw Error('Timestamp too old.')
        if (Number(location.state.timestamp) > now) throw Error('Timestamp in the future.')

        setCurrentClaim({
          targetAddress: location.state.targetAddress,
          targetIsApproving: !!Number(location.state.targetIsApproving),
          signingAddress: location.state.signingAddress,
          signature: fromRpcSig(location.state.signature),
          timestamp: Number(location.state.timestamp)
        })
      } catch (e) {
        console.error('Error parsing arguments passed in the URL.', e) // eslint-disable-line no-console
      } finally {
        history.replace({...location, state: undefined})
      }
    }
  }, [])

  if (redirect) return <Redirect to='/'/>

  return (
    <>
      {!ein && !currentClaim &&
        <>
          <Typography gutterBottom color="textPrimary">
            If you are trying to link your current account to an existing identity, you need a signature! Visit your existing Provider to get one.
          </Typography>
          <Button component={Link} to="/">Creating a new Identity?</Button>
        </>
      }
      {ein && !currentClaim &&
        <SignWithApproving ein={ein} setCurrentClaim={setCurrentClaim} deleteCurrentClaim={deleteCurrentClaim} />
      }
      {currentClaim &&
        <ApproveClaim
          claim={currentClaim} location={location} deleteCurrentClaim={deleteCurrentClaim} setRedirect={setRedirect}
        />
      }
    </>
  )
})
