import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Info from '@material-ui/icons/Info';
import { useWeb3Context } from 'web3-react/hooks'

export default function extraDataComponent ({ ein , sendExtraData}) {
  
  const context = useWeb3Context()
  const [contactName, setContactName]  = useState('')
  const [contactData, setContactData]  = useState('')
  
  function handleClick(){
		var extradata = context.library.eth.abi.encodeParameters(['string','string'], [contactName, contactData]);
		sendExtraData(extradata);
	}

    return (
		<div style={{width: '100%'}}>
		<form noValidate autoComplete="off">
			<TextField
			  margin="normal"
			  label="Contact Name"
			  helperText="Introduce Contact Name or Alias"
			  onChange={(event) => setContactName(event.target.value)}
			  value={contactName}
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
			  onChange={(event) => setContactData(event.target.value)}
			  value={contactData}
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
		  <Button onClick={handleClick} color="primary" autoFocus>
				  Submit...
		 </Button>
		</div>
    )
}






