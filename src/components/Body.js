import React, { Component } from 'react';
import { withWeb3 } from 'web3-webpacked-react';

import NoHydroId from './NoHydroId'
import NoSnowflake from './NoSnowflake'
import Snowflake from './Snowflake'

class Body extends Component {
  render() {
    // don't display anything until the hydroID has been fetched
    if (this.props.hydroId === undefined) {
      return ''
    }

    if (this.props.hydroId == null) {
      return (
        <NoHydroId getHydroId={this.props.getHydroId} />
      )
    } else if (this.props.raindropOnly) {
      return (
        <NoSnowflake />
      )
    } else {
      return (
        <Snowflake hydroId={this.props.hydroId} addClaim={this.props.addClaim} />
      )
    }
  }
}

export default withWeb3(Body)
