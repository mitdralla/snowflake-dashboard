import React, { Component } from 'react';
import { Web3Consumer } from 'web3-webpacked-react';
import { Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import { withTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import { linkify } from '../common/utilities'

class TransactionManager extends Component {
  constructor(props) {
    super(props)

    this.defaultState = {
      transactionState:        'ready',
      transactionHash:         undefined,
      transactionError:        undefined,
      transactionErrorMessage: undefined
    }

    this.state = this.defaultState
  }

  reset = () => {
    if (this.state.transactionState !== 'error')
      throw Error('reset can only be called when the transaction state is \'error\'.')
    this.setState(this.defaultState)
  }

  sendTransaction = () => {
    if (this.state.transactionState !== 'ready')
      throw Error('reset can only be called when the transaction state is \'ready\'.')

    this.setState({
      transactionState: 'sending'
    }, () => {
      const method = typeof this.props.method === 'function' ? this.props.method() : this.props.method
      this.props.w3w.sendTransaction(method, {
        error: (error, message) => {
          console.error(error.message) // eslint-disable-line no-console
          this.setState({
            buttonState: 'error',
            transactionError: error,
            transactionErrorMessage: message
          })
        },
        transactionHash: (transactionHash) => {
          this.setState(
            {transactionState: 'pending', transactionHash: transactionHash},
            () => this.props.onTransactionHash()
          )
        },
        confirmation: (confirmationNumber) => {
          if (confirmationNumber === 0)
            this.setState(
              {transactionState: 'success'},
              () => this.props.onConfirmation()
            )
        }
      })
    })
  }

  render() {
    return this.props.children({
      ...this.state,
      key: this.state.transactionState,
      sendTransaction: this.sendTransaction,
      reset: this.reset
    })
  }
}

TransactionManager.propTypes = {
  children:          PropTypes.func.isRequired,
  method:            PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func
  ]).isRequired,
  w3w:               PropTypes.object.isRequired,
  onTransactionHash: PropTypes.func,
  onConfirmation:    PropTypes.func
}

TransactionManager.defaultProps = {
  onTransactionHash: () => {},
  onConfirmation:    () => {}
}

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

const ProgressIcon = (props) => <CircularProgress {...props} />

class _SnowflakeButton extends Component {
  constructor(props) {
    super(props)

    const transactionStateToState = {
      ready: {
        text:      this.props.buttonInitial,
        className: 'ready',
        onClick:   this.props.sendTransaction
      },
      sending: {
        text:      <ProgressIcon size={this.props.theme.typography.button.fontSize} />,
        className: 'sendingPending',
        disabled:  true
      },
      pending: {
        text:      <span>Pending Confirmation <ProgressIcon size={this.props.theme.typography.button.fontSize} /></span>,
        className: 'sendingPending',
        linkProps: {
          component: "a",
          href:      this.props.w3w.etherscanFormat('transaction', this.props.transactionHash),
          target:    "_blank"
        }
      },
      error: {
        text:      'Error',
        className: 'error',
        onClick:   this.props.reset,
      },
      success: {
        text:      'Success',
        className: 'success',
        linkProps: {
          component: "a",
          href:      this.props.w3w.etherscanFormat('transaction', this.props.transactionHash),
          target:    "_blank"
        }
      }
    }

    this.state = {
      disabled:  false,
      linkProps: {},
      onClick:   () => {},
      ...transactionStateToState[this.props.transactionState]
    }

    this.linkify = linkify.bind(this)
  }

  render() {
    return (
      <Button
        variant="contained"
        disabled={this.state.disabled}
        onClick={this.state.onClick}
        className={this.props.classes[this.state.className]}
        {...this.state.linkProps}
      >
        {this.state.text}
      </Button>
    )
  }
}

_SnowflakeButton.propTypes = {
  buttonInitial: PropTypes.node.isRequired,
  classes:       PropTypes.object.isRequired,
  theme:         PropTypes.object.isRequired
}

const SnowflakeButton = withTheme()(withStyles(styles)(_SnowflakeButton))

class TransactionButton extends Component {
  render() {
    const { buttonInitial, ...rest } = this.props

    return (
      <Web3Consumer>
        {context =>
          <TransactionManager w3w={context} {...rest}>
            {transactionProps => <SnowflakeButton buttonInitial={buttonInitial} w3w={context} {...transactionProps} />}
          </TransactionManager>
        }
      </Web3Consumer>
    )
  }
}

TransactionButton.propTypes = {
  buttonInitial:     PropTypes.node.isRequired,
  method:            PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func
  ]).isRequired,
  onTransactionHash: PropTypes.func,
  onConfirmation:    PropTypes.func
}

TransactionButton.defaultProps = {
  onTransactionHash: () => {},
  onConfirmation:    () => {}
}

export default TransactionButton
