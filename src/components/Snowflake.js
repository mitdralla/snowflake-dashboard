import React, { Component } from 'react';
import { withWeb3 } from 'web3-webpacked-react';
import Typography from '@material-ui/core/Typography';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import SnowflakeAddresses from './SnowflakeAddresses'
import SnowflakeTokens from './SnowflakeTokens'
import SnowflakeResolvers from './SnowflakeResolvers'

class Snowflake extends Component {
  render() {
    const { hydroId, snowflakeDetails, getAccountDetails, addClaim } = this.props

    return (
      <div>
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="headline">Resolver Management</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails style={{overflowX: 'auto'}}>
            <SnowflakeResolvers
              resolvers={snowflakeDetails.resolvers}
              resolverDetails={snowflakeDetails.resolverDetails}
              hydroId={hydroId}
              getAccountDetails={getAccountDetails}
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="headline">Address Management</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails style={{overflowX: 'auto'}}>
            <SnowflakeAddresses
              getAccountDetails={getAccountDetails}
              owner={snowflakeDetails.owner}
              ownedAddresses={snowflakeDetails.ownedAddresses}
              hydroId={hydroId}
              addClaim={addClaim}
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="headline">Token Management</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <SnowflakeTokens
              hydroId={hydroId}
              getAccountDetails={getAccountDetails}
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    )
  }
}

export default withWeb3(Snowflake)
