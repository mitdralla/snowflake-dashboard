import React, { Component } from 'react';
import WyreVerification from 'wyre-react-library';
import Button from '@material-ui/core/Button';
import { withWeb3 } from 'web3-webpacked-react';

class WyreVerificationView extends Component {
  constructor(props) {
    super(props)

    this.state = {}

  }

  render() {
    const myButton = OurButton
    const apiKey  = "AK-PXV2BMYR-QHCMMQUQ-8YN98EEL-WMCZ3UQ7";
    return (
      <WyreVerification myButton={myButton} apiKey={apiKey}/>
    ); }

}

const OurButton = (props) => {
  return (
    <Button {...props} variant="contained" color="primary">Open Wyre</Button>
  );
}

export default withWeb3(WyreVerificationView);
