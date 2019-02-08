import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';
import MoneyIcon from '@material-ui/icons/AttachMoney';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';


const circularProgressStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  };
  
export default class ReportHistoryTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {events:[],
			petId:props.petId,
			loading:true
					
			
		}
	}
	
	
	formatTimestamp(timestamp){
		var date = new Date(parseInt(timestamp)*1000);
		var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		var year = date.getFullYear();
		var month = months[date.getMonth()];
		var day = ('0' + date.getDate() ).substr(-2);
		var hour = date.getHours();
		var min = ('0' + date.getMinutes() ).substr(-2);
		var sec = ('0' + date.getSeconds() ).substr(-2); 
		var time = month + ' ' + day + ' ' + year + ', ' + hour + ':' + min + ':' + sec ;
		return time;
	}
	
	
	
	componentDidMount() {
	
		var _this = this;
		//var shaPetId = this.props.w3w.web3js.utils.sha3(this.state.petId);
		//var shaPetId = this.props.w3w.web3js.utils.sha3(this.props.w3w.web3js.eth.abi.encodeParameter("string",this.state.petId));
		this.props.resolverContract.getPastEvents('LostReportChanged', 
			{
				filter: {petId:this.state.petId},
				fromBlock: 0, 
				toBlock: 'latest'
				//topics: [null,shaPetId]
				//topics:[this.state.petId]
			}, 
			function(e,l){
				
				_this.setState({
					events: l,
					loading:false
				})
			}
		)
	}

	render() {
		return(
			<div>
				<Dialog
					open={this.props.open}
					fullScreen={true}
					//TransitionComponent={Transition}
					onClose={this.handleClose}
					aria-labelledby="alert-dialog-slide-title"
					aria-describedby="alert-dialog-slide-description"
				>
				<DialogTitle id="alert-dialog-slide-title">
					{"Report history of Pet ID:"+this.props.chipId+", Name: "+this.props.name}
				</DialogTitle>
				<DialogContent>
					<div>
						<Table>
							<TableHead>
								<TableRow >
									<TableCell>Date</TableCell>
									<TableCell >Status</TableCell>
									<TableCell >Scene Desc</TableCell>
									<TableCell >Claimer EIN</TableCell>
									<TableCell ><MoneyIcon/></TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{this.state.events.map( ev => 
									<TableRow key={this.props.petId+'_'+ev.returnValues.date}>
										<TableCell>{this.formatTimestamp(ev.returnValues[2])}</TableCell>
										<TableCell>{this.props.getStatusTxt(ev.returnValues[3])}</TableCell>
										<TableCell>{ev.returnValues[4]}</TableCell>
										<TableCell>{ev.returnValues[6]!==0?ev.returnValues[6]:''}</TableCell>
										<TableCell>{ev.returnValues[5]}</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					{this.state.loading && <CircularProgress size={68} style={circularProgressStyle} />}
					</div>
				</DialogContent>
				<DialogActions>
					<Button onClick={this.props.handleClose} color="primary">
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</div>
		)
	}
}

