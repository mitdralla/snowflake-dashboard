import React, { useState, useRef } from 'react';
import { Typography } from '@material-ui/core'
import { useWeb3Context } from 'web3-react/hooks'
import { Button } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';

import { useNamedContract } from '../common/hooks'
import SignatureButton from './common/SignatureButton'
import TransactionButton from './common/TransactionButton'

export default function NoEIN () {
  const [hydroId, setHydroId] = useState('')
  const [signature, setSignature] = useState('')
  const [activeStep, setActiveStep] = useState(0)
  const context = useWeb3Context()
  const snowflakeContract = useNamedContract('snowflake')
  const _1484Address = useNamedContract('1484')._address

  function stepBack () {
    setActiveStep(activeStep - 1)
  }

  function stepForward () {
    setActiveStep(activeStep + 1)
  }

  const timestamp = useRef(Math.round(new Date() / 1000) - 120)
  const message = context.web3js.utils.soliditySha3(
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

      <Stepper activeStep={activeStep} orientation="vertical">
        <Step key={0}>
          <StepLabel>{activeStep === 0 ? 'Pick a Hydro ID' : `Hydro ID: ${hydroId}`}</StepLabel>
          <StepContent>
            <TextField
              key='Hydro ID'
              label='Hydro ID'
              helperText='This is a public identifier.'
              margin="normal"
              value={hydroId}
              onChange={e => setHydroId(e.target.value)}
              fullWidth
            />
            <Button
              variant="contained"
              onClick={stepForward}
            >
              Next
            </Button>
          </StepContent>
        </Step>

        <Step key={1}>
          <StepLabel>Give permission</StepLabel>
          <StepContent>
            <Button
              variant="contained"
              onClick={stepBack}
            >
              Back
            </Button>
            <br />
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

        <Step key={2}>
          <StepLabel>Claim your Identity</StepLabel>
          <StepContent>
            <Button
              variant="contained"
              onClick={stepBack}
            >
              Back
            </Button>
            <br />
            <TransactionButton
              readyText='Send'
              method={() => snowflakeContract.methods.createIdentityDelegated(
                signature.from, signature.from, [], hydroId, signature.v, signature.r, signature.s, timestamp.current
              )}
              onConfirmation={context.reRenderers.forceAccountReRender}
            />
          </StepContent>
        </Step>
      </Stepper>

      <Typography variant='body2' gutterBottom color="textPrimary">
        Already have an Identity and just want to use it with your current address? Linking is coming soon!
      </Typography>

      {/*<Router basename={process.env.PUBLIC_URL}>
        <div className={classes.width} style={{margin: "0 auto", marginBottom: 100}}>
          <Button variant="contained" color="primary" component={Link} to="/claim-address">Finalize Claim</Button>
        </div>
      </Router>*/}
    </div>
  )
}
