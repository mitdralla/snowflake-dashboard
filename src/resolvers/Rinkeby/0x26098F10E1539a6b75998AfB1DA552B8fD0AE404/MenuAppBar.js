import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
import EditAccountDialog from './EditAccountDialog';
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

class MenuAppBar extends React.Component {
  state = {
   
    openMyAccount:false,
	openAbout:false,
	openMenu:false,
	contactName:'',
	contactData:''
  };

	componentDidMount(){
		this.props.resolverContract.methods.getOwner(this.props.hydroId).call()
			.then(anOwner =>{
				this.setState(
					{
						contactName:anOwner.contactName,
						contactData:anOwner.contactData
					})
			})
	}

	handleOpenMenu = () => {
		this.setState({ openMenu:true});
	};

	handleCloseMenu = () => {
		this.setState({ openMenu: false });
	}

	handleMyAccount = () => {
		this.setState({ openMyAccount: true ,  openMenu: false});
	}; 

	handleAbout = () => {
		this.setState({ openAbout: true });
	};
  
	handleCloseMyAccount = () => {
		this.setState({ openMyAccount: false });
	};

	handleCloseAbout = () => {
		this.setState({ openAbout: false });
	};
  
	render() {

	const { classes } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
		<div className={classes.root}>
			<AppBar position="static">
				<Toolbar>
					<IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" color="inherit" className={classes.grow}>
						{"Pet Friend v1.0.1"}
					</Typography>
					<div>
						<IconButton
							aria-owns={open ? 'menu-appbar' : undefined}
							aria-haspopup="true"
							onClick={this.handleOpenMenu}
							color="inherit"
						>
							<AccountCircle />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							open={this.state.openMenu}
							//onClose={this.handleCloseMenu}
						>
							<MenuItem onClick={this.handleMyAccount}>My account...</MenuItem>
							<EditAccountDialog 
								hydroId={this.props.hydroId}
								open={this.state.openMyAccount}
								resolverContract={this.props.resolverContract}
								handleClose={this.handleCloseMyAccount}
								contactName={this.state.contactName}
								contactData={this.state.contactData}
							/>
							<MenuItem onClick={this.handleAbout}>About...</MenuItem>
							<Dialog
								open={this.state.openAbout}
								onClose={this.handleCloseAbout}
								aria-labelledby="alert-dialog-title"
								aria-describedby="alert-dialog-description"
								modal={true}
							>
								<DialogTitle id="alert-dialog-title">{"FriendOfPets, a PocC of Snowflake Resolver"}</DialogTitle>
								<DialogContent>
									<DialogContentText id="alert-dialog-description">
							This is a PoC of Snowflake Resolver, a DApp made for Snowflake Dashboard. This DApp allow to register several pets of your own, 
							make a report in case of pet lost, and helping others finding their pets, contributing to Community of Friend of Pets, and 
							earning a symbolic reward by the way! Please give me feedback at jzafradelpozo@gmail.com.
									</DialogContentText>
								</DialogContent>
								<DialogActions>
									<Button onClick={this.handleCloseAbout} color="primary" autoFocus>
										Ok
									</Button>
								</DialogActions>
							</Dialog>
						</Menu>
					</div>
				</Toolbar>
			</AppBar>
		</div>
	);
	}
}

MenuAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MenuAppBar);