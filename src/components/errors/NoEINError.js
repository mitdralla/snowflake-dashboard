import React, { useState, useRef } from 'react';
import { Typography } from '@material-ui/core'
import { useWeb3Context, useAccountEffect } from 'web3-react/hooks'
import { Button } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import { Link } from 'react-router-dom'

import { useNamedContract, useDebounce } from '../../common/hooks'
import SignatureButton from '../common/SignatureButton'
import TransactionButton from '../common/TransactionButton'

export default function NoEIN () {
  const context = useWeb3Context()

  const oldClientRaindropContract = useNamedContract('oldClientRaindrop')
  const clientRaindropContract = useNamedContract('clientRaindrop')

  const [hydroId, setHydroId] = useState('')
  function wrappedSetHydroId (hydroId) {
    setHydroIdError(undefined)
    setHydroId(hydroId)
  }
  const debouncedHydroId = useDebounce(hydroId, 500)
  const [hydroIdError, setHydroIdError] = useState(undefined)

  function validateNewClientRaindrop() {
    clientRaindropContract.methods.hydroIDAvailable(debouncedHydroId).call()
      .then(result => result ? setHydroIdError(null) : setHydroIdError('Name is already reserved.'))
  }

  useAccountEffect(() => {
    if (debouncedHydroId === '') {
      setHydroIdError(undefined)
      return
    }
    else {
      if (!(Buffer.from(debouncedHydroId).length > 2)) {
        setHydroIdError('Too short.')
        return
      }

      if (!(Buffer.from(debouncedHydroId).length < 33)) {
        setHydroIdError('Too long.')
        return
      }

      oldClientRaindropContract.methods.getUserByName(debouncedHydroId).call()
        .then(result => {
          if (result.userAddress !== context.account) setHydroIdError('Name is already reserved.')
          else validateNewClientRaindrop()
        })
        .catch(() => {
          validateNewClientRaindrop() // errors just mean that the function threw i.e. the name is untaken in old CR
        })
    }
  }, [debouncedHydroId])

  const [signature, setSignature] = useState('')
  const [activeStep, setActiveStep] = useState(0)
  const snowflakeContract = useNamedContract('snowflake')
  const _1484Address = useNamedContract('1484')._address

  function stepBack () { setActiveStep(activeStep - 1) }
  function stepForward () { setActiveStep(activeStep + 1) }

  const timestamp = useRef(Math.round(new Date() / 1000) - 120)
  const message = context.library.utils.soliditySha3(
    '0x19', '0x00', _1484Address,
    'I authorize the creation of an Identity on my behalf.',
    context.account,
    context.account,
    { t: 'address[]', v: [snowflakeContract._address] },
    { t: 'address[]', v: [] },
    timestamp.current
  )

  return (
    <div>
      <Typography variant="h3" gutterBottom color="textPrimary">
        Follow the steps below to claim your Snowflake Identity, powered by{' '}
        <Typography
          style={{display: 'inline-block', textDecoration: 'none'}}
          color='primary'
          variant='h3'
          component="a"
          href="https://erc1484.org/"
          target="_blank"
        >
          ERC-1484
        </Typography>
        !
      </Typography>


      {/* When a user comes to the site for the first time and they have not set their EIN they are presented with this step.
        A user then clicks a 'next' button.
        IMO this should not be an error,.. but a possible state a user is in.
        The user here is asked to pick a HydroID, a unique identifier. */}
      <Stepper activeStep={activeStep} orientation="vertical">
        <Step key={0}>
          <StepLabel>{activeStep === 0 ? 'Pick a Hydro ID' : `Hydro ID: ${hydroId}`}</StepLabel>
          <StepContent>
            Before claiming your identity, you need to pick a Hydro ID. This is a public, on-chain identifier that will be linked to and identify your account.
            <TextField
              key='Hydro ID'
              label='Hydro ID'
              helperText={!hydroIdError ? 'This is a public identifier.' : hydroIdError}
              error={!!hydroIdError}
              required
              margin="normal"
              value={hydroId}
              onChange={e => wrappedSetHydroId(e.target.value)}
              fullWidth
            />

            {/* Clicking this button brings the user to step 2. */}
            <Button
              variant="contained"
              disabled={hydroId === '' || hydroIdError !== null}
              onClick={stepForward}
            >
              Next
            </Button>
          </StepContent>
        </Step>

        {/* A user is then presented with a 'back' button and a 'sign button', the user
        can click 'back' and it returns them back to the text box where they picked their ID and can make modifications.
        When a user clicks 'sign' it creates a MetaMAsk transaction you need to confirm (which is not obvious!!
        You need to open MetaMask and SIGN the transaction.) You then move to step 3.
         */}
        <Step key={1}>
          <StepLabel>Give Permission</StepLabel>
          <StepContent>
            The next step is for you to give us permission to create your account. This requires your signature of a hashed permission string.
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
                setSignature(signature)
                stepForward()
              }}
            />
          </StepContent>
        </Step>

        {/* Once a user has signed the transaction, they could either go back to to step2, and step 1, or click 'claim' to claim it. */}
        <Step key={2}>
          <StepLabel>Claim your Identity</StepLabel>
          <StepContent>
            Click below to claim your new on-chain identity!
            <br />
            <Button
              variant="contained"
              style={{marginRight: '15px'}}
              onClick={stepBack}
            >
              Back
            </Button>

            {/* The final button in the process of claiming an identity. */}
            <TransactionButton
              readyText='Send'
              method={() => snowflakeContract.methods.createIdentityDelegated(
                signature.from, signature.from, [], hydroId, signature.v, signature.r, signature.s, timestamp.current
              )}
              onConfirmation={context.forceAccountReRender}
            />
          </StepContent>
        </Step>
      </Stepper>

      <Button component={Link} to="/claim-address">Linking your address to an existing Identity?</Button>
    </div>
  )
}
