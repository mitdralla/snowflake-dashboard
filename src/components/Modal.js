import React, { Component } from 'react';
import { Button, Dialog, DialogActions, DialogTitle, DialogContent } from '@material-ui/core';

class Modal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    }
  }

  render() {
    return (
      <div>
        {this.props.opener({onClick: () => this.setState({open: true})})}

        <Dialog
          fullScreen={this.props.fullScreen}
          open={this.state.open}
          onClose={() => this.setState({open: false})}
        >
          <DialogTitle>
            {this.props.title}
          </DialogTitle>

          <DialogContent>
            {this.props.children}
          </DialogContent>

          <DialogActions>
            <Button onClick={() => this.setState({open: false})} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default Modal
