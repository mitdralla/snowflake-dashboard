import React, { Component } from 'react';

import Button from '@material-ui/core/Button';

import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import VerifiedUser from '@material-ui/icons/VerifiedUser';
import TransactionButton from '../../../common/TransactionButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

function Transition(props) {
	return <Slide direction="up" {...props} />;
}




class ClaimReportDialog extends Component {
  
  
	constructor(props) {
		super(props)
		this.state = {
			messageStandard: '',
			reportStatus: props.reportStatus,
			reportStatusTxt: props.reportStatusTxt,
			reportSceneDescription: props.reportSceneDescription,
			reportReward: props.reportReward,
			contactName: props.contactName,
			contactData: props.contactData,
			ownerId: props.ownerId,
			hydroId: props.hydroId,
			open:false,
			petId: props.petId
		}
	}


	UNSAFE_componentWillReceiveProps(nextProps){
		this.setState({
			reportStatus: nextProps.reportStatus,
			reportStatusTxt: nextProps.reportStatusTxt,
			reportSceneDescription: nextProps.reportSceneDescription,
			reportReward: nextProps.reportReward,
			contactName: nextProps.contactName,
			contactData: nextProps.contactData,
			ownerId: nextProps.ownerId,
			hydroId: nextProps.hydroId,
			open:nextProps.open,
			petId: nextProps.petId
		})
	}

	UNSAFE_componentWillMount(){
		this.setState({
			reportStatus: this.props.reportStatus,
			reportStatusTxt: this.props.reportStatusTxt,
			reportSceneDescription: this.props.reportSceneDescription,
			reportReward: this.props.reportReward,
			contactName: this.props.contactName,
			contactData: this.props.contactData,
			ownerId:this.props.ownerId,
			hydroId: this.props.hydroId,
			open:false,
			petId: this.props.petId
		})
	}
  
	componentDidMount(){
		this.setState({
			reportStatus: this.props.reportStatus,
			reportStatusTxt: this.props.reportStatusTxt,
			reportSceneDescription: this.props.reportSceneDescription,
			reportReward: this.props.reportReward,
			contactName: this.props.contactName,
			contactData: this.props.contactData,
			ownerId: this.props.ownerId,
			hydroId: this.props.hydroId,
			open:false,
			petId: this.props.petId
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


	handleChangeReportReward(event){
		this.setState({reportReward: event.target.value}) 
	}
  
	handleReportSceneDesc(event){
		this.setState({reportSceneDescription: event.target.value}) 
	}


	handleClose = () => {
		this.setState({ open: false });
	}
 
  
	render() {

		return (
		<div>
			<Dialog
				open={this.props.open}
				TransitionComponent={Transition}
				onClose={this.handleClose}
				aria-labelledby="alert-dialog-slide-title"
				aria-describedby="alert-dialog-slide-description"
			>
				<DialogTitle id="alert-dialog-slide-title">
					{"Found Pet Report details..."}
				</DialogTitle>
				<DialogContent>
					<form noValidate autoComplete="off">
						<TextField
							margin="normal"
							label="status"
							helperText="Report Status"
							value={this.state.reportStatusTxt}
							InputProps={{
								readOnly: true,
								startAdornment: (
									<InputAdornment position="start">
										<VerifiedUser />
									</InputAdornment>
								)
							}}
							fullWidth
						/>
						<TextField
							margin="normal"
							label="Scene description"
							helperText="Description of scene"
							value={this.state.reportSceneDescription}
							InputProps={{
								readOnly: true,
								startAdornment: (
								<InputAdornment position="start">
									<VerifiedUser />
								</InputAdornment>
								)
							}}
							fullWidth
						/>
						<TextField
							margin="normal"
							label="Reward"
							helperText="Reward in HYDRO"
							value={this.state.reportReward}
							type="number"
							InputProps={{
								readOnly: true,
								startAdornment: (
								<InputAdornment position="start">
									<VerifiedUser />
								</InputAdornment>
								)
							}}
							fullWidth
						/>
						<TextField
							margin="normal"
							label="Owner's Name or Alias"
							helperText="Owner's Name or Alias"
							value={this.state.contactName}
							InputProps={{
								readOnly: true,
								startAdornment: (
									<InputAdornment position="start">
										<VerifiedUser />
									</InputAdornment>
								)
							}}
						fullWidth
						/>
						<TextField
							margin="normal"
							label="Owner's public contact (email,twitter,telegram,facebook...)"
							helperText="Owner's Contact details"
							value={this.state.contactData}
							InputProps={{
								readOnly: true,
								startAdornment: (
								<InputAdornment position="start">
									<VerifiedUser />
								</InputAdornment>
								)
							}}
							fullWidth
						/>
						<TextField
							margin="normal"
							label="Report Claimer SnowFlake ID (if already claimed)"
							helperText="Report Claimer SnowFlake ID"
							value={this.state.reportClaimedHydroId}
							InputProps={{
								readOnly: true,
								startAdornment: (
								<InputAdornment position="start">
									<VerifiedUser />
								</InputAdornment>
								)
							}}
							fullWidth
						/>
					</form>
				</DialogContent>
				<DialogActions>
					{this.state.reportStatus==="1"?(
						<TransactionButton 
							readyText='Claim Pet Found...'
							method = { this.props.resolverContract.methods.claimLostReport(this.props.petId,this.props.hydroId)}
							onConfirmation={() => {
								this.props.handleClose()
							}}
						/>
					):''}
					<Button onClick={this.props.handleClose} color="primary">
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</div>
		);
	}
}


export default ClaimReportDialog;




