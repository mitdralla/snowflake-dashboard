import React, { Component } from 'react';
import { withWeb3 } from 'web3-webpacked-react';
import { Button, TextField, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom'

import { getContract } from '../common/utilities'

import TransactionButton from './TransactionButton'

class NoHydroId extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hydroId: ''
    }

    this.getContract = getContract.bind(this)
  }

  render() {
    return (
      <div>
        <Typography variant='display1' gutterBottom color="textPrimary">
          Already Have a Snowflake?
        </Typography>

        <Typography variant='body2' gutterBottom color="textPrimary">
          Click below to link your current address to an existing Snowflake.
        </Typography>

        <Button variant="contained" color="primary" component={Link} to="/claim-address">Finalize Claim</Button>

        <Typography variant='display1' gutterBottom color="textPrimary" style={{marginTop: 20}}>
          Mint a New Snowflake
        </Typography>

        <Typography variant='body2' gutterBottom color="textPrimary">
          Otherwise, choose a Hydro ID and mint a new Snowflake below.
        </Typography>

        <TextField
          key='Hydro ID'
          label='Hydro ID'
          helperText='This is a public identifier.'
          margin="normal"
          value={this.state.hydroId}
          onChange={e => this.setState({hydroId: e.target.value})}
          fullWidth
        />
        <TransactionButton
          buttonInitial="Get Snowflake"
          method={() => this.getContract('clientRaindrop').methods.signUpUser(this.state.hydroId)}
          onConfirmation={this.props.getAccountDetails}
        />
      </div>
    )
  }
}

export default withWeb3(NoHydroId)
