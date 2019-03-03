import React from 'react';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import MoneyIcon from '@material-ui/icons/AttachMoney';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Avatar from '@material-ui/core/Avatar';
import PetIcon from '@material-ui/icons/Pets';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import yellow from '@material-ui/core/colors/yellow';

import ClaimReportDialog from './ClaimReportDialog';
import Tooltip from '@material-ui/core/Tooltip';
import TransactionButton from '../../../common/TransactionButton';



export default class LostReportCardv2 extends React.Component {
	constructor(props) {
		super(props);
		this.state = {	
			openReport:false,
			petId:'',
			chipId:'',
			reportStatus:0,
							reportStatusTxt:'',
							petType:'',
							name:'',
							sceneDesc:'',
							desc:'',
							claimerHydroId:'',
							//petIdentification={this.props.petId}
							contactName:'',
							contactData:'',
							reward:'',
							imgUrl:'',
							ownerId:''							
		}
	}
	
	componentDidMount() {
		this.refreshLostReport();
	}
	
	refreshLostReport(){
		const _this = this;
		const lr =_this.props.resolverContract.methods.getLostReport(this.props.petId).call();
		const pt =_this.props.resolverContract.methods.getPet(this.props.petId).call();
		const ow = _this.props.resolverContract.methods.getPetOwner(this.props.petId).call();
		Promise.all([lr,pt,ow]).then(([lr,pt,ow]) => {
			_this.setState({
					reportStatus:lr.status,
					reportStatusTxt:_this.props.getStatusTxt(lr.status),
					petType:pt.petType,
					name:pt.name,
					sceneDesc:lr.sceneDesc,
					desc:pt.desc,
					claimerHydroId:lr.claimerHydroId,
					//petIdentification={this.props.petId}
					contactName:ow.contactName,
					contactData:ow.contactData,
					reward:lr.reward,
					resolverContract:_this.props.resolverContract,
					hydroId:_this.props.hydroId,
					imgUrl:pt.imgUrl,
					ownerId:ow.ownerId,
					chipId:pt.chipId
			})
					
		});
	}
	
	handleClickOpenReport = () => {
		this.setState({ openReport: true });
	};
	
	handleCloseReport = () => {
		this.setState({ openReport: false });
		//callback for refreshing active report data
		//this.props.getActiveReport();
	};
  
	//Refresh table after changed state
	handleClickUnclaimReport = ()=>{
		this.refreshLostReport();
	}
  
	getStatusColor() {
		if(this.state.reportStatus ==="1")
			return {backgroundColor: red[500]}
		else if(this.state.reportStatus === "2")
			return {backgroundColor: yellow[500]}
		else
			return {backgroundColor: green[500]};
	}

	render() {
    return(
		<Card style={{maxWidth: 300}}>
			<CardActionArea>
				<CardHeader
					avatar={
						<Avatar aria-label={this.state.petType} style={this.getStatusColor()}>
							<Tooltip title={this.state.reportStatusTxt}>
								<PetIcon/>
							</Tooltip>
						</Avatar>
					}
					title={this.state.name+ ' - ' +this.state.petType}
					subheader={'Pet ID: '+this.state.chipId}
				/>
				<CardMedia   style={{ height: 0, paddingTop: '56%'}}
					//className={styles.media}
					//image="https://upload.wikimedia.org/wikipedia/commons/d/db/Pet_Discount_Logo.jpg"
					image ={this.state.imgUrl===''?require ("./noImage.png"):this.state.imgUrl}
					title="pet image"
				/>
				<CardContent>
					<Typography component="p">{this.state.sceneDesc}</Typography>
					<Typography component="p">{'Pet desc: '+this.state.desc}</Typography>
					<Typography component="p">{'Owner: '+this.state.contactName+'  ,Contact Info: '+this.state.contactData}</Typography>
					<Typography component="p"><MoneyIcon/> {this.state.reward +' HYDRO'} </Typography>
				</CardContent>
			</CardActionArea>
			<CardActions style={{justifyContent: 'center'}}>
				{this.state.reportStatus==="1" && this.state.hydroId !== this.state.ownerId?(
					<Button size="small" color="primary"  onClick={this.handleClickOpenReport}>
						Report Pet Found!
					</Button>
				):''}
				{this.state.reportStatus==="2" && this.state.hydroId === this.state.claimerHydroId?(
					<TransactionButton 
						readyText=' Sorry!  Unreport Pet Found'
						method = { this.props.resolverContract.methods.unclaimLostReport(this.props.petId)}
						onConfirmation={() => {
							this.handleClickUnclaimReport()
						}}
					/>
				):''}
				<ClaimReportDialog 
					OwnerHydroId={this.props.OwnerHydroId}
					reportStatus ={this.state.reportStatus}
					reportStatusTxt ={this.state.reportStatusTxt}
					reportSceneDescription={this.state.sceneDesc}
					contactName={this.state.contactName}
					contactData={this.state.contactData}
					reportReward={this.state.reward}
					open={this.state.openReport}
					resolverContract={this.props.resolverContract}
					handleClose={this.handleCloseReport}
					hydroId={this.props.hydroId}
					petId={this.props.petId}
					ownerId={this.state.ownerId}
				/>
			</CardActions>
		</Card>
	)
}

}

