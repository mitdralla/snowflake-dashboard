import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class AboutDialog extends React.Component {

  
 
  
  render() {
	 

    return (<div>
				  <Dialog
					  open={this.props.openAbout}
					  onClose={this.props.onClose}
					  aria-labelledby="alert-dialog-title"
					  aria-describedby="alert-dialog-description"
					   modal={true}
				   >
				  <DialogTitle id="alert-dialog-title">{"About..."}</DialogTitle>
				  <DialogContent>
					<DialogContentText id="alert-dialog-description">
					  This is a PoC of Snowflake Resolver, a DApp made for Snowflake Dashboard. This DApp allow to register several pets of your own, 
					  make a report in case of pet lost, and helping others finding their pets, contributing to Community of Friend of Pets, and 
					  earning a symbolic reward by the way! Please give me feedback at jzafradelpozo@gmail.com.
				  
					</DialogContentText>
				  </DialogContent>
				  <DialogActions>
					<Button onClick={this.props.onClose} color="primary" autoFocus>
					  Close
					</Button>
					
				  </DialogActions>
				</Dialog>
                </div>
    );
  }
}

AboutDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AboutDialog);