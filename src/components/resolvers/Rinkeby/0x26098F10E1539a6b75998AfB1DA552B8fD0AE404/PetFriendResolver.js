import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PetCard from './PetCard';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import EditAccountDialog from './EditAccountDialog';
import Button from '@material-ui/core/Button';
import EditPetDialog from './EditPetDialog';
import LostReportCardv2 from './LostReportCardv2';

import { ABI } from './index'
import { useGenericContract, useAccountEffect } from '../../../../common/hooks'
import { useWeb3Context } from 'web3-react'


const reportStatusResources=['Lively', 'Lost', 'Found', 'Removed', 'Rewarded'];


export default function PetOwnerView ({ ein }) {

	const context = useWeb3Context()

  const resolverContract = useGenericContract('0x26098F10E1539a6b75998AfB1DA552B8fD0AE404', ABI)

  const [ownerPets, setOwnerPets] = useState([])
  const [lostReportKeys, setLostReportKeys] = useState([])
  const [openNewPet, setOpenNewPet] = useState(false)

  useAccountEffect(() => {
    resolverContract.methods.getAllLostReportKeys().call().then(theKeys => setLostReportKeys(theKeys))
	resolverContract.methods.getOwnerPets(ein).call().then(theKeys => setOwnerPets(theKeys))
  })


	function getStatusTxt(status){
		return reportStatusResources[status];

	}

	function handleClickOpenNewPet(){
		setOpenNewPet(true);
	}

	function handleCloseNewPet(){
		setOpenNewPet(false);
		refreshPets()
	}


	function handleRefreshOwnerData(){
		//nothing to do
		context.forceAccountReRender();
	}

	function handleModifyPet(){
		//nothing to do
		context.forceAccountReRender();
	}

	function refreshPets(){
		//no nothing at the moment
		context.forceAccountReRender();
	}

	function refreshReports(){
		context.forceAccountReRender();
	}

    return (
		<div>
			<ExpansionPanel elevation={3}>
				<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
					<Typography variant={"h6"}>Your Account details</Typography>
				</ExpansionPanelSummary>
				<ExpansionPanelDetails>
				<EditAccountDialog
						hydroId={ein}
						resolverContract={resolverContract}
						handleSubmit= {handleRefreshOwnerData}
				/>
				</ExpansionPanelDetails>
			</ExpansionPanel>
			<ExpansionPanel elevation={3} defaultExpanded={true}>
				<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
					<Typography variant={"h6"}>Your Pet Details</Typography>
				</ExpansionPanelSummary>
				<ExpansionPanelDetails>
					<div style={{width: '100%'}}>
						<div>
							<GridList
								spacing={3}
								cellHeight={'auto'}
								cols={3}
							>
							{ownerPets.map( aPetId =>
								<GridListTile key={aPetId}>
									<PetCard
										key ={aPetId}
										petId={aPetId}
										resolverContract={resolverContract}
										hydroId = {ein}
										refreshPets = {refreshPets}
										getStatusTxt = {getStatusTxt}
										w3w = {context}
									/>
								</GridListTile>
							)}
							</GridList>
						</div>
						<div>
							<Button variant="outlined" size="medium" color="default" onClick={handleClickOpenNewPet}>
								Register New Pet...
							</Button>
							<EditPetDialog
								hydroId={ein}
								petId={''}
								petType={''}
								name={''}
								desc={''}
								imgUrl={''}
								onModifyPet={handleModifyPet}
								open={openNewPet}
								resolverContract={resolverContract}
								handleClose={handleCloseNewPet}
							/>
						</div>
					</div>
				</ExpansionPanelDetails>
			</ExpansionPanel>
			<ExpansionPanel elevation={3}  >
				<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
					<Typography variant={"h6"}>List of Lost Pets. Have you found any of this? Help Us!</Typography>
				</ExpansionPanelSummary>
				<ExpansionPanelDetails>
					<div style={{width: '100%'}}>
						<GridList
							spacing={3}
							cellHeight={'auto'}
							cols={3}
						>
						{lostReportKeys.map( akey =>
							<GridListTile key={'lost_'+akey}>
								<LostReportCardv2
									key={akey}
									petId={akey}
									resolverContract={resolverContract}
									hydroId = {ein}
									getStatusTxt = {getStatusTxt}
									refreshReports = {refreshReports}
								/>
							</GridListTile>
						)}
						</GridList>
					</div>
				</ExpansionPanelDetails>
			</ExpansionPanel>
        </div>
	);
}
