import React, { Component } from 'react';
import { withWeb3 } from 'web3-webpacked-react';

import NoHydroId from './NoHydroId'
import NoSnowflake from './NoSnowflake'
import Snowflake from './Snowflake'

class Body extends Component {
  render() {
    if (this.props.hydroId == null) {
      return (
        <NoHydroId getHydroId={this.props.getHydroId} />
      )
    } else if (this.props.raindropOnly) {
      return (
        <NoSnowflake hydroId={this.props.hydroId} />
      )
    } else {
      return (
        <Snowflake hydroId={this.props.getHydroId} />
      )
    }
  }
}

export default withWeb3(Body)
