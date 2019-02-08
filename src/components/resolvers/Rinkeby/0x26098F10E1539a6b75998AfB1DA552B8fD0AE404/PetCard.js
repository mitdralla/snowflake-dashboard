import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import PetIcon from '@material-ui/icons/Pets';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import yellow from '@material-ui/core/colors/yellow';

import EditPetDialog from './EditPetDialog';
import EditReportDialog from './EditReportDialog';
import ReportHistoryTable from './ReportHistoryTable';


export default class PetCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openEdit: false,
			openReport:false,
			openHistory:false,
			petType: '',
			name: '',
            desc: '',
			imgUrl: '',
			reportStatus:0,
			reportStatusTxt:'',
			reportSceneDescription:'',
			reportReward:'',
			reportClaimerHydroId:''  ,
			chipId:''			
		};
	}
	
	getStatusColor() {
		if(this.state.reportStatus ==="1")
			return {backgroundColor: red[500]}
		else if(this.state.reportStatus === "2")
			return {backgroundColor: yellow[500]}
		else
			return {backgroundColor: green[500]};
	}
	
	componentDidMount() {
		//this.props.reportStatus = props.reportStatus;
		this.getPet();
		this.getActiveReport();
	}
	
	UNSAFE_componentWillReceiveProps(){
		this.getPet();
		this.getActiveReport();
  }
  
  

	
	getPet(){
		//let aPet = this.props.resolverContract.methods.getPet('jzafra2').call()
		this.props.resolverContract.methods.getPet(this.props.petId).call()
			.then(aPet =>{
				this.setState(
				{
					petType: aPet.petType,
					name: aPet.name,
					desc: aPet.desc,
					imgUrl: aPet.imgUrl,
					chipId: aPet.chipId
				});
				//this.refreshReportList();
		})
	}

   getActiveReport(){
	this.props.resolverContract.methods.getLostReport(this.props.petId).call()
    .then(aReport =>{
      this.setState({hasActiveReport: true,
		reportStartDate: this.formatTimestamp(aReport.startDate),
		reportSceneDescription: aReport.sceneDesc,
		reportStatus: aReport.status,
		reportStatusTxt: this.props.getStatusTxt(aReport.status),
		reportReward: aReport.reward,
        reportClaimerHydroId: aReport.claimerHydroId});
		
    })
  
   }

	formatTimestamp(timestamp){
		var date = new Date(parseInt(timestamp)*1000);
		var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		var year = date.getFullYear();
		var month = months[date.getMonth()];
		var day = ('0' + date.getDate() ).substr(-2);
		var hour = date.getHours();
		var min = date.getMinutes();
		var sec = date.getSeconds();
		var time = month + ' ' + day + ' ' + year + ', ' + hour + ':' + min + ':' + sec ;
		return time;
	}
	
	handleClickOpenEdit = () => {
		this.setState({ openEdit: true });
	};
	
	handleClickOpenReport = () => {
		this.setState({ openReport: true });
	};
	
	handleClickOpenHistory = () => {
		this.setState({ openHistory: true });
	};

  handleCloseEdit = () => {
	this.setState({ openEdit: false });
	//callback for refreshing pet data
	this.props.refreshPets();
    
  };
  
   handleCloseReport = () => {
	this.setState({ openReport: false });
	//callback for refreshing active report data
	//this.props.getActiveReport();
	this.props.refreshPets();
    
  };

	handleCloseHistory = () => {
		this.setState({ openHistory: false });
	};
  
	render() {

		return(
		<div>

			<Card style={{ maxWidth: 300}} elevation={3}>
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
						//image= {require ("./logo.png")}
						image ={this.state.imgUrl===''?require ("./noImage.png"):this.state.imgUrl}
						title="pet image"
					/>
					<CardContent>
						<Typography component="p">{this.state.desc}</Typography>
					</CardContent>
				</CardActionArea>
				<CardActions style={{justifyContent: 'center'}}>
					<Button size="small" color="primary" onClick={this.handleClickOpenEdit}>
						Edit
					</Button>
					<EditPetDialog 
						hydroId={this.props.hydroId}
						petId={this.props.petId}
						chipId={this.state.chipId}
						petType={this.state.petType}
						name={this.state.name}
						timestamp={this.state.timestamp}
						desc={this.state.desc}
						imgUrl={this.state.imgUrl}
						//contactName={this.props.contactName}
						//contactData={this.props.contactData}
						onModifyPet={this.onModifyPet}
						open={this.state.openEdit}
						resolverContract={this.props.resolverContract}
						handleClose={this.handleCloseEdit}
					/>
					<Button size="small" color="primary" onClick={this.handleClickOpenReport}>
						Report
					</Button>
					<EditReportDialog 
						hydroId={this.props.hydroId}
						petId={this.props.petId}
						chipId={this.state.chipId}
						reportStatus ={this.state.reportStatus}
						reportStatusTxt ={this.state.reportStatusTxt}
						reportSceneDescription={this.state.reportSceneDescription}
						//contactName={this.state.contactName}
						//contactData={this.state.contactData}
						reportReward={this.state.reportReward}
						open={this.state.openReport}
						resolverContract={this.props.resolverContract}
						handleClose={this.handleCloseReport}
						reportClaimerHydroId ={this.state.reportClaimerHydroId}
					/>
					<Button size="small" color="primary" onClick={this.handleClickOpenHistory}>
						History
					</Button>
					{this.state.openHistory?( 
						<ReportHistoryTable 
							key={'history_'+this.props.petId}
							hydroId={this.props.hydroId}
							petId={this.props.petId}
							chipId={this.state.chipId}
							name={this.state.name}
							open={this.state.openHistory}
							resolverContract={this.props.resolverContract}
							handleClose={this.handleCloseHistory}
							getStatusTxt ={this.props.getStatusTxt}
							w3w = {this.props.w3w}
								
						/>
					):''}
				</CardActions>
			</Card>
		</div>
    )
  }
}

