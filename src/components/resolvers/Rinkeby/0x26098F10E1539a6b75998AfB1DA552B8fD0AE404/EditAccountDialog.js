import React, { Component } from 'react';

import Button from '@material-ui/core/Button';

import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import TransactionButton from '../../../common/TransactionButton';
import Info from '@material-ui/icons/Info';
import AboutDialog from './AboutDialog';



export default class EditAccountDialog extends Component {
  
  
	constructor(props) {
		super(props)
			this.state = {
			contactName: '',
			contactData: '',
			openAbout:false
		}
	}
  
  
	componentDidMount(){
		this.props.resolverContract.methods.getOwner(this.props.hydroId).call()
			.then(anOwner =>{
				this.setState(
				{
					contactName:anOwner.contactName,
					contactData:anOwner.contactData,
					openAbout:false
				})
			})
	}


  
	handleChangeContactName(event){
		this.setState({contactName: event.target.value})
	}
   
	handleChangeContactData(event){
		this.setState({contactData: event.target.value})
	}
  
	handleOpenAbout(){
		this.setState({openAbout:true});
	}
	
	handleCloseAbout(){
		this.setState({openAbout:false});
	}
  
  render() {

    return (

	

            <div style={{width: '100%'}}>
			
			<form noValidate autoComplete="off">

                <TextField
                  margin="normal"
                  label="Contact Name"
                  helperText="Introduce Contact Name or Alias"
                  onChange={this.handleChangeContactName.bind(this)}
                  value={this.state.contactName}
                  InputProps={{
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
                  label="Contact Data"
                  helperText="Introduce public Contact Data, as facebook Id, telegram Id or public email"
                  onChange={this.handleChangeContactData.bind(this)}
                  value={this.state.contactData}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                         <Info />
                      </InputAdornment>
                    )
                  }}
                  fullWidth
                />
                
                 
				
			</form>
			<div>
				</div>
					<TransactionButton
						readyText='Update account details...'
						method = { () => this.props.resolverContract.methods.updateOwner(this.props.hydroId,this.state.contactName,this.state.contactData)}
						onConfirmation={() => {
							this.props.handleSubmit()
						}}
					/>
					<Button onClick={this.handleOpenAbout.bind(this)} color="primary" autoFocus>
						About...
					</Button>
					<AboutDialog
						openAbout={this.state.openAbout}
						onClose={this.handleCloseAbout.bind(this)}
					/>
            </div>
		);
	}
}






