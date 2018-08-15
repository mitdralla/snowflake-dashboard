import React, { Component } from 'react';

class HydroKYCView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      passedStandards: [],
      // newStatus: '',
      // message: ''
    }

    // this.handleChange = this.handleChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
  }

  getPassedStandards() {
    this.props.resolverContract.methods.getPassedStandards(this.props.hydroId).call()
      .then(standards => {
        this.setState({passedStandards: standards})
      })
  }

  componentDidMount() {
    this.getPassedStandards()
  }

  // handleChange(event) {
  //   this.setState({newStatus: event.target.value})
  // }

  // handleSubmit(event) {
  //   event.preventDefault();
  //   this.sendTransaction()
  // }

  // sendTransaction() {
  //   let method = this.props.resolverContract.methods.setStatus(this.state.newStatus)
  //   window.w3w.sendTransaction(method, {
  //     error: (error, message) => {
  //       console.error(error)
  //       this.setState({message: <p>{message}</p>})
  //     },
  //     transactionHash: (transactionHash) => {
  //       this.setState({message: (<a href={window.w3w.etherscanFormat('transaction', transactionHash)} target="_blank">Pending</a>)})
  //     },
  //     confirmation: (confirmationNumber, receipt) => {
  //       if (confirmationNumber === 0) {
  //         this.setState({message: <p>Success!</p>})
  //         this.getCurrentStatus()
  //       }
  //     }
  //   })
  // }

  render() {
    return (
      <div>
        <h1>Current Status</h1>
        <p>{this.state.passedStandards}</p>
        // <form onSubmit={this.handleSubmit}>
        //   <input type="text" value={this.state.newStatus} onChange={this.handleChange} placeholder="New Status" />
        //   <input type="submit" value="Set New Status" />
        //   <div>
        //     {this.state.message}
        //   </div>
        // </form>
      </div>
    );
  }
}

export default HydroKYCView;
