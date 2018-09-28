import React, { Component } from 'react';
// import WyreVerification from './WyreVerification';
import WyreVerification from 'wyre-react-library';
import { withWeb3 } from 'web3-webpacked-react';

class WyreVerificationView extends Component {
  constructor(props) {
    super(props)

    this.state = {}

  }

  render() {
    const apiKey  = "AK-PXV2BMYR-QHCMMQUQ-8YN98EEL-WMCZ3UQ7";
    return (
      <WyreVerification apiKey={apiKey}/>
    ); }

}

export default withWeb3(WyreVerificationView);
