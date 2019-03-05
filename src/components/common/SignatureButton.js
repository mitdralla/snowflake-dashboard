// Button used when transacting. Can be used in multiple places where signing transations, but currently is generic. Has states for ready, sending, error and success.

import React from 'react';
import { Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress'
import { withTheme, withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types';
import { useSignPersonalManager } from 'web3-react/hooks'

const styles = theme => ({
  ready: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark
    }
  },
  sendingPending: {
    backgroundColor: theme.palette.grey[300],
    color: theme.palette.getContrastText(theme.palette.grey[300]),
    '&:hover': {
      backgroundColor: theme.palette.grey[500]
    }
  },
  error: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.error.dark
    }
  },
  success: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.success.dark
    }
  }
})

const ProgressIcon = withTheme()(({ theme }) => <CircularProgress size={theme.typography.button.fontSize} />)

function SignatureButton ({ show, message, readyText, classes, onSuccess }) {
  // eslint-disable-next-line no-unused-vars
  const [signatureState, _, signPersonal, resetSignature] = useSignPersonalManager(
    message, { handlers: { success: onSuccess } }
  )

  switch (signatureState) {
    case 'ready':
      return (
        <Button
          style={show ? undefined : {display: 'none'}}
          variant="contained"
          onClick={signPersonal}
          className={classes.ready}
        >
          {readyText}
        </Button>
      )
    case 'pending':
      return (
        <Button
          style={show ? undefined : {display: 'none'}}
          variant="contained"
          disabled={true}
          className={classes.sendingPending}
        >
          <ProgressIcon />
        </Button>
      )
    case 'success':
      return (
        <Button
          style={show ? undefined : {display: 'none'}}
          variant="contained"
          className={classes.success}
        >
          <span>Success!</span>
        </Button>
      )
    case 'error':
      return (
        <Button
          style={show ? undefined : {display: 'none'}}
          variant="contained"
          onClick={resetSignature}
          className={classes.error}
        >
          <span>Error. Retry?</span>
        </Button>
      )
    default:
      throw Error('This should not happen™.')
  }
}

SignatureButton.propTypes = {
  show:              PropTypes.bool,
  message:           PropTypes.string.isRequired,
  readyText:         PropTypes.node.isRequired,
  classes:           PropTypes.object.isRequired,
  onSuccess:         PropTypes.func
}

SignatureButton.defaultProps = {
  show:              true,
  onSuccess: () => {},
}

export default withStyles(styles)(SignatureButton)
