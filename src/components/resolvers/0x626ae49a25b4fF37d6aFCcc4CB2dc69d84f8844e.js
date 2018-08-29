import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';
import VerifiedUser from '@material-ui/icons/VerifiedUser';

import { withWeb3 } from 'web3-webpacked-react';

class HydroKYCView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      passedStandards: [],
      standardCounts: [],
      newStandard: '',
      messageStandard: '',
      messageAttest: '',
      allStandards: [],
      attestedHydroId: '',
      attestedStandard: '',
      lookupHydroId: '',
      currentHydroId: '',
      lookupStandardCounts: [],
      messageRemoveAttest: '',
      removeAttestHydroId: '',
      removeAttestedStandard: ''
    }

    this.handleChangeStandard = this.handleChangeStandard.bind(this);
    this.handleSubmitStandard = this.handleSubmitStandard.bind(this);

    this.handleChangeHydroId = this.handleChangeHydroId.bind(this);
    this.handleChangeAttest = this.handleChangeAttest.bind(this);
    this.handleSubmitAttest = this.handleSubmitAttest.bind(this);

    this.handleChangeRemoveHydroId = this.handleChangeRemoveHydroId.bind(this);
    this.handleChangeRemoveAttest = this.handleChangeRemoveAttest.bind(this);
    this.handleSubmitRemoveAttest = this.handleSubmitRemoveAttest.bind(this);

    this.handleChangeHydroIdLookup  = this.handleChangeHydroIdLookup.bind(this);
    this.handleSubmitLoad = this.handleSubmitLoad.bind(this);
  }

  getPassedStandards(hydroId) {
    this.props.resolverContract.methods.getPassedStandards(hydroId).call()
      .then(standards => {
        var standardPromises = standards.map(standard => {
          return this.props.resolverContract.methods.getStandardString(standard).call()
        })
        Promise.all(standardPromises).then( results => {
            this.getNumberOfAttestations(results, hydroId)

            this.setState({passedStandards: results})
          })
      })
  }

  getNumberOfAttestations(standards, hydroId) {
    let standardCount = []

    var standardCountPromises = standards.map(standard => {
      return this.props.resolverContract.methods.getAttestationCountToUser(standard, hydroId).call()
    })
    Promise.all(standardCountPromises).then(results => {
      let counter = standards.length
      for (var i = 0; i < counter; i++) {
        standardCount[i] = {}
        standardCount[i]["standard"] = standards[i]
        standardCount[i]["attestations"] = parseInt(results[i], 10)
      }
      this.setState({standardCounts: standardCount})
    })

  }

  handleSubmitLoad(event) {
    event.preventDefault();
    this.getPassedStandardsLookup(this.state.lookupHydroId);
    this.setState({currentHydroId: this.state.lookupHydroId})
  }

  handleChangeHydroIdLookup(event) {
    this.setState({lookupHydroId: event.target.value})
  }

  getPassedStandardsLookup(hydroId) {
    this.props.resolverContract.methods.getPassedStandards(hydroId).call()
      .then(standards => {
        var standardPromises = standards.map(standard => {
          return this.props.resolverContract.methods.getStandardString(standard).call()
        })
        Promise.all(standardPromises).then( results => {
            this.getNumberOfAttestationsLookup(results, hydroId)
          })
      })
  }

  getNumberOfAttestationsLookup(standards, hydroId) {
    let standardCount = []

    var standardCountPromises = standards.map(standard => {
      return this.props.resolverContract.methods.getAttestationCountToUser(standard, hydroId).call()
    })
    Promise.all(standardCountPromises).then(results => {
      let counter = standards.length
      for (var i = 0; i < counter; i++) {
        standardCount[i] = {}
        standardCount[i]["standard"] = standards[i]
        standardCount[i]["attestations"] = parseInt(results[i], 10)
      }
      this.setState({lookupStandardCounts: standardCount})
    })

  }

  getAllStandards() {
    this.props.resolverContract.methods.getAllStandards().call()
      .then(standards => {
        var standardPromises = standards.map(standard => {
          return this.props.resolverContract.methods.getStandardString(standard).call()
        })
        Promise.all(standardPromises).then( results => {
            this.setState({allStandards: results, removeAttestedStandard: results[0], attestedStandard: results[0]})
          })
      })
  }

  componentDidMount() {
    this.getPassedStandards(this.props.hydroId)
    this.getAllStandards()
  }

  handleChangeStandard(event) {
    this.setState({newStandard: event.target.value})
  }

  handleSubmitStandard(event) {
    event.preventDefault();
    this.sendTransactionStandard()
  }

  sendTransactionStandard() {
    let method = this.props.resolverContract.methods.addKYCStandard(this.state.newStandard)
    this.props.w3w.sendTransaction(method, {
      error: (error, message) => {
        console.error(error)
        this.setState({messageStandard: <p>{message}</p>})
      },
      transactionHash: (transactionHash) => {
        this.setState({messageStandard: (<a href={this.props.w3w.etherscanFormat('transaction', transactionHash)} target="_blank">Pending</a>)})
      },
      confirmation: (confirmationNumber, receipt) => {
        if (confirmationNumber === 0) {
          this.setState({messageStandard: <p>Success!</p>})
          this.getAllStandards()
        }
      }
    })
  }

  handleChangeHydroId(event) {
    this.setState({attestedHydroId: event.target.value})
  }

  handleChangeAttest(event) {
    this.setState({attestedStandard: event.target.value})
  }

  handleSubmitAttest(event) {
    event.preventDefault();

    this.sendTransactionAttest()
  }

  sendTransactionAttest() {
    let method = this.props.resolverContract.methods.attestToUsersKYC(this.state.attestedStandard, this.state.attestedHydroId)
    this.props.w3w.sendTransaction(method, {
      error: (error, message) => {
        console.error(error)
        this.setState({messageAttest: <p>{message}</p>})
      },
      transactionHash: (transactionHash) => {
        this.setState({messageAttest: (<a href={this.props.w3w.etherscanFormat('transaction', transactionHash)} target="_blank">Pending</a>)})
      },
      confirmation: (confirmationNumber, receipt) => {
        if (confirmationNumber === 0) {
          this.setState({messageAttest: <p>Success!</p>})
          this.getPassedStandards()
        }
      }
    })
  }

  handleChangeRemoveHydroId(event)  {
    this.setState({removeAttestHydroId: event.target.value})
  }

  handleChangeRemoveAttest(event) {
    this.setState({removeAttestedStandard: event.target.value})
  }

  handleSubmitRemoveAttest(event) {
    event.preventDefault();
    this.sendTransactionRemoveAttest()
  }

  sendTransactionRemoveAttest() {
    let method = this.props.resolverContract.methods.removeUserKYC(this.state.removeAttestedStandard, this.state.removeAttestHydroId)
    this.props.w3w.sendTransaction(method, {
      error: (error, message) => {
        console.error(error)
        this.setState({messageRemoveAttest: <p>{message}</p>})
      },
      transactionHash: (transactionHash) => {
        this.setState({messageRemoveAttest: (<a href={this.props.w3w.etherscanFormat('transaction', transactionHash)} target="_blank">Pending</a>)})
      },
      confirmation: (confirmationNumber, receipt) => {
        if (confirmationNumber === 0) {
          this.setState({messageRemoveAttest: <p>Success!</p>})
        }
      }
    })
  }

  render() {

    let rows = this.state.standardCounts.map(standard => {
      return <CustomRow key = {
        standard.standard
      }
      data = {
        standard
      }
      />
    })

    let lookupRows = this.state.lookupStandardCounts.map(standard => {
      return <CustomRow key = {
        standard.standard
      }
      data = {
        standard
      }
      />
    })

    let options = this.state.allStandards.map(standard => {
      return <MenuItem key={standard} value={standard}>{standard}</MenuItem>
    })

    return (
      <div>

        <Typography variant='display3' gutterBottom align="center" color="textPrimary">
          Hydro KYC
        </Typography>

        <div hidden={!this.props.hydroId}>
          <Typography variant='display1' gutterBottom align="center" color="textPrimary">
            Your Passed Standards
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Standard</TableCell>
                <TableCell numeric>Attestations</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                {rows}
            </TableBody>
          </Table>
        </div>

        <Grid container spacing={16}>
          <Grid item xs={3}>
            <div>
              <Typography variant='display1' gutterBottom align="center" color="textPrimary">
                Add A Standard
              </Typography>
              <form noValidate autoComplete="off" align="center">
                <FormControl>
                  <TextField
                    onChange={this.handleChangeStandard}
                    label="New Standard"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <VerifiedUser />
                        </InputAdornment>
                      )
                    }}
                  />
                  <Button variant="contained" color="primary" onClick={this.handleSubmitStandard}>
                    Submit
                  </Button>
                  <div>
                    {this.state.messageStandard}
                  </div>
                </FormControl>
              </form>
            </div>
          </Grid>

          <Grid item xs={3}>
            <div>
              <Typography variant='display1' gutterBottom align="center" color="textPrimary">
                Attest To A Standard
              </Typography>
              <form noValidate autoComplete="off" align="center">
                <FormControl>
                  <InputLabel htmlFor="standard-simple">Standard</InputLabel>
                  <Select
                    value={this.state.attestedStandard}
                    onChange={this.handleChangeAttest}
                    inputProps={{
                      name: 'standard',
                      id: 'standard-simple',
                    }}
                  >
                    {options}
                  </Select>
                  <TextField
                    value={this.state.attestedHydroId}
                    onChange={this.handleChangeHydroId}
                    label="HydroID"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircle />
                        </InputAdornment>
                      )
                    }}
                  />
                  <Button variant="contained" color="primary" onClick={this.handleSubmitAttest}>
                    Submit
                  </Button>
                  <div>
                    {this.state.messageAttest}
                  </div>
                </FormControl>
              </form>
            </div>
          </Grid>

          <Grid item xs={3}>
            <div>
              <Typography variant='display1' gutterBottom align="center" color="textPrimary">
                Remove Attestation
              </Typography>
              <form noValidate autoComplete="off" align="center">
                <FormControl>
                  <InputLabel htmlFor="standard-remove-simple">Standard</InputLabel>
                  <Select
                    value={this.state.removeAttestedStandard}
                    onChange={this.handleChangeRemoveAttest}
                    inputProps={{
                      name: 'standard-remove',
                      id: 'standard-remove-simple',
                    }}
                  >
                    {options}
                  </Select>
                  <TextField
                    value={this.state.removeAttestHydroId}
                    onChange={this.handleChangeRemoveHydroId}
                    label="HydroID"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircle />
                        </InputAdornment>
                      )
                    }}
                  />
                  <Button variant="contained" color="primary" onClick={this.handleSubmitRemoveAttest}>
                    Submit
                  </Button>
                  <div>
                    {this.state.messageRemoveAttest}
                  </div>
                  </FormControl>
              </form>
            </div>
          </Grid>

          <Grid item xs={3}>

            <div>
              <Typography variant='display1' gutterBottom align="center" color="textPrimary">
                Load HydroID Info
              </Typography>
              <form noValidate autoComplete="off" align="center">
                <FormControl>
                  <TextField
                    value={this.state.lookupHydroId}
                    onChange={this.handleChangeHydroIdLookup}
                    label="HydroID"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircle />
                        </InputAdornment>
                      )
                    }}
                  />
                  <Button variant="contained" color="primary" onClick={this.handleSubmitLoad}>
                    Submit
                  </Button>
                </FormControl>
              </form>
            </div>
          </Grid>
        </Grid>


        <div hidden={lookupRows.length === 0}>
          <Typography variant='display1' gutterBottom align="center" color="textPrimary">
            {this.state.currentHydroId} Passed Standards
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Standard</TableCell>
                <TableCell numeric>Attestations</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                {lookupRows}
            </TableBody>
          </Table>
        </div>

      </div>
    );
  }
}

const CustomRow = (props) => {
  return (
    <TableRow>
      <TableCell>
        { props.data.standard }
      </TableCell>
      <TableCell>
        { props.data.attestations }
      </TableCell>
    </TableRow>
  );
}

export default withWeb3(HydroKYCView);
