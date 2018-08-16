import React, { Component } from 'react';

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
      attestedStandard: ''
    }

    this.handleChangeStandard = this.handleChangeStandard.bind(this);
    this.handleSubmitStandard = this.handleSubmitStandard.bind(this);

    this.handleChangeHydroId = this.handleChangeHydroId.bind(this);
    this.handleChangeAttest = this.handleChangeAttest.bind(this);
    this.handleSubmitAttest = this.handleSubmitAttest.bind(this);
  }

  getPassedStandards() {
    this.props.resolverContract.methods.getPassedStandards(this.props.hydroId).call()
      .then(standards => {
        var standardPromises = standards.map(standard => {
          return this.props.resolverContract.methods.getStandardString(standard).call()
        })
        Promise.all(standardPromises).then( results => {
            this.getNumberOfAttestations(results)

            this.setState({passedStandards: results})
          })
      })
  }

  getNumberOfAttestations(standards) {
    let standardCount = []

    var standardCountPromises = standards.map(standard => {
      return this.props.resolverContract.methods.getAttestationCountToUser(standard, this.props.hydroId).call()
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

  getAllStandards() {
    this.props.resolverContract.methods.getAllStandards().call()
      .then(standards => {
        var standardPromises = standards.map(standard => {
          return this.props.resolverContract.methods.getStandardString(standard).call()
        })
        Promise.all(standardPromises).then( results => {
            this.setState({allStandards: results})
          })
      })
  }

  componentDidMount() {
    this.getPassedStandards()
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
    window.w3w.sendTransaction(method, {
      error: (error, message) => {
        console.error(error)
        this.setState({messageStandard: <p>{message}</p>})
      },
      transactionHash: (transactionHash) => {
        this.setState({messageStandard: (<a href={window.w3w.etherscanFormat('transaction', transactionHash)} target="_blank">Pending</a>)})
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
    window.w3w.sendTransaction(method, {
      error: (error, message) => {
        console.error(error)
        this.setState({messageAttest: <p>{message}</p>})
      },
      transactionHash: (transactionHash) => {
        this.setState({messageAttest: (<a href={window.w3w.etherscanFormat('transaction', transactionHash)} target="_blank">Pending</a>)})
      },
      confirmation: (confirmationNumber, receipt) => {
        if (confirmationNumber === 0) {
          this.setState({messageAttest: <p>Success!</p>})
          this.getPassedStandards()
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

    let options = this.state.allStandards.map(standard => {
      return <CustomOption key = {
        standard
      }
      data = {
        standard
      }
      />
    })

    return (
      <div>

        <h1>Hydro KYC</h1>

        <div hidden={!this.props.hydroId}>
          <h2>Passed Standards</h2>
          <table>
            <tbody>
              <tr>
                <th>Standard</th>
                <th>Attestations</th>
              </tr>
              {rows}
            </tbody>
          </table>
        </div>

        <div>
          <h2>Add A Standard</h2>
          <form onSubmit={this.handleSubmitStandard}>
            <input type="text" value={this.state.newStatus} onChange={this.handleChangeStandard} placeholder="New Standard" />
            <input type="submit" value="Add New Standard" />
            <div>
              {this.state.messageStandard}
            </div>
          </form>
        </div>

        <div>
          <h2>Attest To A Standard</h2>
          <form onSubmit={this.handleSubmitAttest}>
            <select onChange={this.handleChangeAttest}>
              {options}
            </select>
            <input type="text" value={this.state.attestedHydroId} onChange={this.handleChangeHydroId} placeholder="Hydro ID" />
            <input type="submit" value="Attest A Standard" />
            <div>
              {this.state.messageAttest}
            </div>
          </form>
        </div>

      </div>
    );
  }
}

const CustomRow = (props) => {
  return (
    <tr>
      <td>
        { props.data.standard }
      </td>
      <td>
        { props.data.attestations }
      </td>
    </tr>
  );
}

const CustomOption = (props) => {
  return (
    <option value={props.data}>{props.data}</option>
  );
}

export default HydroKYCView;
