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
import PetIcon from '@material-ui/icons/Pets';
import InsertPhoto from '@material-ui/icons/InsertPhoto';
import ShortText from '@material-ui/icons/ShortText';
import Info from '@material-ui/icons/Info';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const textField = {
    marginLeft: 8,
    marginRight: 8,
    width: 400,
  };
  


class EditPetDialog extends Component {
  
  
  constructor(props) {
    super(props)
     this.state = {
      messageStandard: '',
      petType: props.petType,
      name: props.name,
      desc: props.desc,
      chipId: props.chipId,
      //timestamp: props.timestamp,
	  imgUrl: props.imgUrl,
	  open:false
    }
	
  }
  
 
  componentWillReceiveProps(nextProps){
	   this.setState({
		   petType: nextProps.petType,
		  name: nextProps.name,
		  desc: nextProps.desc,
		  chipId: nextProps.chipId,
		   imgUrl: nextProps.imgUrl,
		  open:nextProps.open
    })
  }
  
  componentWillMount(){
	   this.setState({
		   petType: this.props.petType,
		  name: this.props.name,
		  desc: this.props.desc,
		  chipId: this.props.chipId,
		  imgUrl: this.props.imgUrl,
		  open:false
    })
  }
  
  componentDidMount(){
	   this.setState({
		   petType: this.props.petType,
		  name: this.props.name,
		  desc: this.props.desc,
		  chipId: this.props.chipId,
		  imgUrl: this.props.imgUrl,
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
  
  
	handleReportSceneDesc(event){
		this.setState({reportSceneDescription: event.target.value}) 
	}
  
  
	handleChangeImgUrl(event){
		this.setState({imgUrl: event.target.value})
	}
  
	handleChangePetType(event){
		this.setState({petType: event.target.value})
	}

	handleChangeName(event){
		this.setState({name: event.target.value})
	}

	handleChangeDesc(event){
		this.setState({desc: event.target.value})
	}

	handleChangePetId(event){
		this.setState({chipId: event.target.value})
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
            {"Edit Pet details..."}
          </DialogTitle>
          <DialogContent>
             <form noValidate autoComplete="off">
			    <TextField
                  margin="normal"
                  label="Pet Identification Id"
                  helperText="Introduce Pet Identification ID (as seen in plate or docs)"
                  onChange={this.handleChangePetId.bind(this)}
				  value={this.state.chipId}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PetIcon />
                      </InputAdornment>
                    )
                  }}
                  fullWidth
                />
                 
				
				
               
				<TextField
                  margin="normal"
                  label="Pet Type"
                  helperText="Introduce Pet Type (cat, dog, etc)"
                  onChange={this.handleChangePetType.bind(this)}
                  value={this.state.petType}
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
                  label="Pet Name"
                  helperText="Introduce Pet Name"
                  onChange={this.handleChangeName.bind(this)}
                  value={this.state.name}
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
                  label="Pet Details"
                  helperText="Introduce Pet Details: breed, size, color,... (max two lines)"
				  multiline
				  rows={2}
                  onChange={this.handleChangeDesc.bind(this)}
                  value={this.state.desc}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ShortText />
                      </InputAdornment>
                    )
                  }}
                  fullWidth
                />
                 <TextField
				  style={textField}
                  margin="normal"
                  label="Pet Img url"
                  helperText="Introduce url image of your pet (must be a public image url on internet)"
                  onChange={this.handleChangeImgUrl.bind(this)}
                  value={this.state.imgUrl}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <InsertPhoto />
                      </InputAdornment>
                    )
                  }}
                />
                 
				
              </form>
          </DialogContent>
          <DialogActions>
		  {this.props.petId===''?(
			 
           <TransactionButton
                  readyText='Submit new Pet Details...'
               
				 method = { () => this.props.resolverContract.methods.addPet(this.props.hydroId,this.state.chipId,this.state.petType,this.state.name,this.state.desc,this.state.imgUrl)}
                 onConfirmation={() => {
					this.props.handleClose()
                  }}
			/>
		  ):(
			   <TransactionButton
                  readyText='Submit updated Pet Details...'
               
				 method = {() => this.props.resolverContract.methods.updatePet(this.props.petId,this.state.chipId,this.state.petType,this.state.name,this.state.desc,this.state.imgUrl)}
                 onConfirmation={() => {
					this.props.handleClose()
                  }}
				/>
		  )}
			<Button onClick={this.props.handleClose} color="primary">
              Close
            </Button>
          
          </DialogActions>
        </Dialog>
      </div>
	  
     
    );
  }
}



export default EditPetDialog;




