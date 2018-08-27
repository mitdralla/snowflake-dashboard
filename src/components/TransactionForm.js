import React, { Component } from 'react';
import { withWeb3 } from 'web3-webpacked-react';
import { TextField, Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import { withTheme } from '@material-ui/core/styles';

import { linkify } from '../common/utilities'

const ProgressIcon = (props) => <CircularProgress {...props} />

const styles = theme => ({
  ready: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark
    }
  },
  loading: {
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

class TransactionForm extends Component {
  constructor(props) {
    super(props)

    const initialValues = {}
    this.props.fields.forEach(field => {
      initialValues[field.label] = ''
    })

    this.state = {
      values: initialValues,
      message: this.props.buttonInitial,
      buttonState: 'ready',
      buttonDisabled: false,
      linkProps: {}
    }

    this.linkify = linkify.bind(this)
  }

  sendTransaction = () => {
    if (this.state.buttonState === 'error') {
      this.setState({
        message: this.props.buttonInitial,
        buttonState: 'ready',
        buttonDisabled: false,
        linkProps: {}
      })
      return
    }

    if (this.state.buttonState === 'ready') {
      this.setState({
        message: <ProgressIcon size={this.props.theme.typography.button.fontSize} />,
        buttonState:
        'loading',
        buttonDisabled: true,
        linkProps: {}
      })

      const args = this.props.methodArgs.map(arg => {
        return arg.lookup === undefined ? arg.value : this.state.values[arg.lookup]
      })

      this.props.w3w.sendTransaction(this.props.method(...args), {
        error: (error, message) => {
          console.error(error.message)
          this.setState({
            message: 'Transaction Error. Retry?',
            buttonState: 'error',
            buttonDisabled: false,
            linkProps: {}
          })
        },
        transactionHash: (transactionHash) => {
          this.setState({
            message: <span>Awaiting Confirmation <ProgressIcon size={this.props.theme.typography.button.fontSize} /></span>,
            buttonState: 'loading',
            buttonDisabled: false,
            linkProps: {
              component: "a",
              href: this.props.w3w.etherscanFormat('transaction', transactionHash),
              target: "_blank"
            }
          })
          if (this.props.onTransactionHash !== undefined) this.props.onTransactionHash()
        },
        confirmation: (confirmationNumber, receipt) => {
          if (confirmationNumber === 0) {
            this.setState({
              message: 'Success!',
              buttonState: 'success',
              buttonDisabled: false,
              linkProps: {
                component: "a",
                href: this.props.w3w.etherscanFormat('transaction', receipt.transactionHash),
                target: "_blank"
              }
            })
            if (this.props.onConfirmation !== undefined) this.props.onConfirmation()
          }
        }
      })
    }
  }

  handleChange = (e, label) => {
    const value = e.target.value
    this.setState(oldState => {
      return { values: {...oldState.values, [label]: value} }
    })
  }

  render() {
    const { classes } = this.props

    return (
      <form noValidate autoComplete="off">
        {
          this.props.fields.map((field, index) => {
            return (
              <TextField
                key={index}
                label={field.label}
                helperText={field.helperText}
                margin="normal"
                value={this.state.values[field.label]}
                onChange={(e) => this.handleChange(e, field.label)}
                fullWidth
              />
            )
          })
        }
        <Button
          variant="contained"
          disabled={this.state.buttonDisabled}
          onClick={this.sendTransaction}
          color="primary"
          {...this.state.linkProps}
          className={classes[this.state.buttonState]}
        >
          {this.state.message}
        </Button>
      </form>
    )
  }
}

export default withTheme()(withStyles(styles)(withWeb3(TransactionForm)))
