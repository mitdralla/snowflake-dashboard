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
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import AccountCircle from '@material-ui/icons/AccountCircle';
import VerifiedUser from '@material-ui/icons/VerifiedUser';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import TransactionButton from '../../TransactionButton'

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

        <ExpansionPanel hidden={!this.props.hydroId}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Your Passed Standards</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div style={{width: '100%'}}>
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
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Add A Standard</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div style={{width: '100%'}}>
              <form noValidate autoComplete="off">
                <TextField
                  margin="normal"
                  onChange={this.handleChangeStandard}
                  label="Standard"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <VerifiedUser />
                      </InputAdornment>
                    )
                  }}
                  fullWidth
                />
                <TransactionButton
                  buttonInitial='Add A Standard'
                  method={this.props.resolverContract.methods.addKYCStandard(this.state.newStandard)}
                  onConfirmation={() => {
                    this.getAllStandards()
                  }}
                />
              </form>
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Attest To A Standard</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div style={{width: '100%'}}>
              <form noValidate autoComplete="off">
                <InputLabel htmlFor="standard-simple">Standard</InputLabel>
                <Select
                  value={this.state.attestedStandard}
                  onChange={this.handleChangeAttest}
                  inputProps={{
                    name: 'standard',
                    id: 'standard-simple',
                  }}
                  fullWidth
                >
                  {options}
                </Select>
                <TextField
                  margin="normal"
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
                  fullWidth
                />
                <TransactionButton
                  buttonInitial='Attest To A Standard'
                  method={this.props.resolverContract.methods.attestToUsersKYC(this.state.attestedStandard, this.state.attestedHydroId)}
                  onConfirmation={() => {
                    this.getPassedStandards()
                  }}
                />
              </form>
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Remove Attestation To A Standard</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div style={{width: '100%'}}>
              <form noValidate autoComplete="off">
                <InputLabel htmlFor="standard-remove-simple">Standard</InputLabel>
                <Select
                  value={this.state.removeAttestedStandard}
                  onChange={this.handleChangeRemoveAttest}
                  inputProps={{
                    name: 'standard-remove',
                    id: 'standard-remove-simple',
                  }}
                  fullWidth
                >
                  {options}
                </Select>
                <TextField
                  margin="normal"
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
                  fullWidth
                />
                <TransactionButton
                  buttonInitial='Remove Attestation'
                  method={this.props.resolverContract.methods.removeUserKYC(this.state.removeAttestedStandard, this.state.removeAttestHydroId)}
                  onConfirmation={() => {
                    this.getPassedStandards()
                  }}
                />
              </form>
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Load HydroID Info</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div style={{width: '100%'}}>
              <form noValidate autoComplete="off">
                <TextField
                  margin="normal"
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
                  fullWidth
                />
                <Button variant="contained" color="primary" onClick={this.handleSubmitLoad}>
                  Load HydroID Info
                </Button>
              </form>

              <div style={{width: '100%'}} hidden={lookupRows.length === 0}>
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
          </ExpansionPanelDetails>
        </ExpansionPanel>



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
      <TableCell numeric>
        { props.data.attestations }
      </TableCell>
    </TableRow>
  );
}

export default withWeb3(HydroKYCView);
