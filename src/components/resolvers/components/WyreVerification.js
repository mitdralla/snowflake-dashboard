import React, { Component } from 'react';
import Iframe from 'react-iframe';
import Button from '@material-ui/core/Button';
import { withWeb3 } from 'web3-webpacked-react';

const styles = {
  zIndex: "999999",
  backgroundColor: "transparent",
  top: "0",
  bottom: "0",
  left: "0",
  right: "0",
}

class WyreVerification extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hasToken: false,
      wyreIframeOpen: false,
    }

  }

  componentDidMount() {
    let eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    let messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";
    window[eventMethod](messageEvent, (e) => {
        switch (e.data) {
            case "close":
                this.setState({wyreIframeOpen: false})
                break;
            case "complete":
                this.setState({wyreIframeOpen: false})
                break;
            default:
        }
    }, false);
  }

  render() {
    const apiKey  = this.props.apiKey;
    const url = this.props.w3w.networkId === "1" ? "https://verify.sendwyre.com/?apiKey=" : "https://verify.testwyre.com/?apiKey="
    const buttonDisplay = this.state.hasToken || !this.state.wyreIframeOpen ? "block" : "none"
    const display = this.state.wyreIframeOpen ? "block" : "none"

    return (
    <div id="wyre-div" style={{height: "570px"}}>
      <Button
        variant="contained"
        color="primary"
        style={{ display: buttonDisplay }}
        onClick={() => { this.setState({wyreIframeOpen: true}); }}
      >
        Open Wyre
      </Button>
      <Iframe
        url={url + apiKey}
        display={display}
        styles={{styles}}
        position="relative"
      />
    </div>
  ); }

}

export default withWeb3(WyreVerification);
