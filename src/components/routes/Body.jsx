// This is the current 'Home' tab. This tab contains two modules - 'Resolvers' and 'Address Management'.

import React from 'react';
import Typography from '@material-ui/core/Typography';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { useEINDetails, useResolverDetails, useResolverAllowances } from '../../common/hooks'

import SnowflakeAddresses from './SnowflakeAddresses'
import SnowflakeResolvers from './SnowflakeResolvers'


export default function Body ({ ein, hydroIdAddress }) {
  const einDetails = useEINDetails(ein)
  const resolverDetails = useResolverDetails((einDetails && einDetails.resolvers) || [])
  const resolverAllowances = useResolverAllowances((einDetails && einDetails.resolvers) || [])

  const ready = resolverDetails && resolverAllowances

  return (
    <div className="tabbedContent home">
      {!ready ? undefined :
        <>
          <ExpansionPanel defaultExpanded>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h5">Resolver Management</Typography>
            </ExpansionPanelSummary>

            {/* Toggles all expansion of module */}
            <ExpansionPanelDetails style={{overflowX: 'auto'}}>
              <SnowflakeResolvers
                key={JSON.stringify(einDetails.resolvers)}
                ein={ein}
                resolvers={einDetails.resolvers}
                resolverDetails={resolverDetails}
                resolverAllowances={resolverAllowances}
              />
            </ExpansionPanelDetails>
          </ExpansionPanel>

          <ExpansionPanel defaultExpanded>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h5">Address Management</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails style={{overflowX: 'auto'}}>
              <SnowflakeAddresses
                key={JSON.stringify(einDetails.associatedAddresses)}
                hydroIdAddress={hydroIdAddress}
                associatedAddresses={einDetails.associatedAddresses}
              />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </>
      }
    </div>
  )
}
