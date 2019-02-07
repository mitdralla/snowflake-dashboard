import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import TransactionButton from '../../../common/TransactionButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import MoneyIcon from '@material-ui/icons/AttachMoney';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import yellow from '@material-ui/core/colors/yellow';
import RecordVoiceOver from '@material-ui/icons/RecordVoiceOver';
import CalendarToday from '@material-ui/icons/CalendarToday';
import Info from '@material-ui/icons/Info';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}


class EditReportDialog extends Component {
  
  
	constructor(props) {
		super(props)
		this.state = {
			messageStandard: '',
			reportStatus: props.reportStatus,
			reportStatusTxt: props.reportStatusTxt,
			//reportStartDate: props.reportStartDate,
			reportSceneDescription: props.reportSceneDescription,
			reportReward: props.reportReward,
			//contactName: props.contactName,
			//contactData: props.contactData,
			reportClaimerHydroId: props.reportClaimerHydroId,
			open:false
		}
	
	}
  
 getStatusColor() {
		if(this.state.reportStatus ==="1")
			return {backgroundColor: red[500]}
		else if(this.state.reportStatus === "2")
			return {backgroundColor: yellow[500]}
		else
			return {backgroundColor: green[500]};
	}
	componentWillReceiveProps(nextProps){
		this.setState({
			reportStatus: nextProps.reportStatus,
			reportStatusTxt: nextProps.reportStatusTxt,
			reportStartDate: nextProps.reportStartDate,
			reportSceneDescription: nextProps.reportSceneDescription,
			reportReward: nextProps.reportReward,
			//contactName: nextProps.contactName,
			//contactData: nextProps.contactData,
			reportClaimerHydroId: nextProps.reportClaimerHydroId,
			open:nextProps.open
		})
	}
  
	componentWillMount(){
		this.setState({
			reportStatus: this.props.reportStatus,
			reportStatusTxt: this.props.reportStatusTxt,
			reportStartDate: this.props.reportStartDate,
			reportSceneDescription: this.props.reportSceneDescription,
			reportReward: this.props.reportReward,
			//contactName: this.props.contactName,
			//contactData: this.props.contactData,
			reportClaimerHydroId: this.props.reportClaimerHydroId,
			open:false
		})
	}
  
	componentDidMount(){
		this.setState({
			reportStatus: this.props.reportStatus,
			reportStatusTxt: this.props.reportStatusTxt,
			reportStartDate: this.props.reportStartDate,
			reportSceneDescription: this.props.reportSceneDescription,
			reportReward: this.props.reportReward,
			//contactName: this.props.contactName,
			//contactData: this.props.contactData,
			reportClaimerHydroId: this.props.reportClaimerHydroId,
			open:false
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
            {"Report details..."}
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
                        <Info />
                      </InputAdornment>
                    )
                  }}
                  fullWidth
                />
	    
         
			   <TextField
                  margin="normal"
                  onChange={this.handleReportSceneDesc.bind(this)}
                  multiline
				  rows={2}
				  label="When and where get lost"
                  helperText="Describe when and where the pet get lost (max two lines)"
                  value={this.state.reportSceneDescription}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday />
                      </InputAdornment>
                    )
                  }}
                  fullWidth
                />
			
				
				<TextField
                  margin="normal"
                  label="Reward"
                  helperText="Introduce Reward in HYDRO"
                  onChange={this.handleChangeReportReward.bind(this)}
                  value={this.state.reportReward}
				  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MoneyIcon />
                      </InputAdornment>
                    )
                  }}
                  fullWidth
                />
				
				
				<TextField
                  margin="normal"
                  label="Report Claimer Hydro ID"
                  helperText="Report Claimer HydroID"
                  value={this.state.reportClaimerHydroId}
                  InputProps={{
					  readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <RecordVoiceOver />
                      </InputAdornment>
                    )
                  }}
                  fullWidth
                />
				
				
              </form>
          </DialogContent>
          <DialogActions>
		  {
			  //new, removed or rewarded are states that allow new report creation
		  }
           {this.state.reportStatus==="0" || this.state.reportStatus==="3" || this.state.reportStatus==="4"?(
                <TransactionButton 
                  readyText='Submit New Report Details...'
                 method = {() => this.props.resolverContract.methods.putLostReport(this.props.hydroId,this.props.petId,this.state.reportSceneDescription, this.state.reportReward)}
                 onConfirmation={() => {
					this.props.handleClose()
                  }}
                />
				):''}
				{
					//Pending (lost) can only remove by the owner
				}
				{this.state.reportStatus==="1"?(
				<div>
				 <TransactionButton 
                  readyText='Update Report...'
                 method = { () => this.props.resolverContract.methods.updateLostReport(this.props.hydroId,this.props.petId,this.state.reportSceneDescription, this.state.reportReward)}
                 onConfirmation={() => {
					this.props.handleClose()
                  }}
                />
				<TransactionButton 
                  readyText='Remove Report...'
                 method = {() =>  this.props.resolverContract.methods.removeLostReport(this.props.hydroId,this.props.petId)}
                 onConfirmation={() => {
                    this.props.handleClose()
                  }}
                /> 
				</div>
				):''}
				{
					//Found by other can only transit to confirm or pending
				}
				{this.state.reportStatus==="2"?(
				<div>
				<TransactionButton 
                  readyText='Confirm Reward...'
                 method = { () => this.props.resolverContract.methods.confirmReward(this.props.hydroId,this.props.petId)}
                 onConfirmation={() => {
                    this.props.handleClose()
                  }}
                />
				<TransactionButton 
                  readyText=' Wrong Alert!  Revert Pet Found...'
                 method = { this.props.resolverContract.methods.unclaimLostReport(this.props.petId)}
                 onConfirmation={() => {
                    this.handleClickUnclaimReport()
                  }}
                />
				</div>
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

export default EditReportDialog;




