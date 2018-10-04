import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import TransactionButton from '../../TransactionButton'
import { withWeb3 } from 'web3-webpacked-react';

class Snowflake725View extends Component {
  constructor(props) {
    super(props)

    this.state = {
      contractAddress: "",
      claimContract: "",
    }

  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  componentDidMount() {
    this.get725Contract();
  }

  get725Contract = ()  => {
    this.props.resolverContract.methods.get725(this.props.hydroId).call()
      .then(contract => {
        this.setState({contractAddress: contract});
      })
  }

  render() {
    const need725 = this.state.contractAddress === "0x0000000000000000000000000000000000000000" ? "block" : "none";
    const have725 = this.state.contractAddress != "0x0000000000000000000000000000000000000000" ? "block" : "none";

    return (
      <div>
        <div id="get725" style={{display: need725}}>
          <p>Looks like you dont have a 725 yet. Lets get one</p>
          <form noValidate autoComplete="off">
            <TransactionButton
              buttonInitial = 'Mint a 725 Contract'
              method={this.props.resolverContract.methods.create725()}
              onConfirmation={() => {
                this.get725Contract()
              }}
            />
          </form>
          <h2>OR</h2>
          <form noValidate autoComplete="off">
            <TextField
              id="claim-contract"
              helperText="Claim a contract you already own"
              label="Contract Address"
              value={this.state.claimContract}
              onChange={this.handleChange('claimContract')}
              margin="normal"
              fullWidth
            />
            <TransactionButton
              buttonInitial = 'Claim a 725 Contract'
              method={this.props.resolverContract.methods.claim725(this.state.claimContract)}
              onConfirmation={() => {
                this.get725Contract()
              }}
            />
          </form>
        </div>
        <div style={{display: have725}}>
          <p>Your contract is at address {this.state.contractAddress}!</p>
          <TransactionButton
            buttonInitial = 'Unclaim your 725 Contract'
            method={this.props.resolverContract.methods.remove725()}
            onConfirmation={() => {
              this.get725Contract()
            }}
          />
        </div>
      </div>
    );
  }
}

export default withWeb3(Snowflake725View);
