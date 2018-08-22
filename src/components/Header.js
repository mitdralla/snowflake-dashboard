import React, { Component } from 'react';
import { withWeb3 } from 'web3-webpacked-react';
import Typography from '@material-ui/core/Typography';
import { linkify, getContract } from '../common/utilities'

class Header extends Component {
  constructor(props) {
    super(props)

    this.linkify = linkify.bind(this)
    this.getContract = getContract.bind(this)
  }

  render() {
    const networkName = this.props.w3w.getNetworkName()
    const snowflakeAddress = this.getContract('snowflake')._address

    return (
      <div>
        <Typography variant='display3' gutterBottom align="center" color="textPrimary">
          Snowflake Dashboard ({this.linkify('address', snowflakeAddress, networkName, 'display3')})
        </Typography>
        <Typography variant="subheading" gutterBottom align="center" color="textPrimary">
          {this.linkify('address', this.props.w3w.account, undefined, 'subheading')}
        </Typography>
        <Typography variant="subheading" gutterBottom align="center" color="textPrimary">
          {this.props.hydroId}
        </Typography>
        <Typography variant="subheading" gutterBottom align="center" color="textPrimary">
          Ether: {this.props.etherBalance}
        </Typography>
        <Typography variant="subheading" gutterBottom align="center" color="textPrimary">
          Hydro: {this.props.hydroBalance}
        </Typography>
      </div>
    )
  }
}

export default withWeb3(Header)
