import React, { Component } from 'react';
import { IconButton } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import CloseIcon from '@material-ui/icons/Close';

import ReactModal from 'react-modal';

const customStyles = {
  content: {
    background: 'none',
    border:     'none',
    padding:    '5px'
  }
}

ReactModal.setAppElement('#root')

class Modal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.props.opener({onClick: () => this.setState({modalIsOpen: true})})}

        <ReactModal
          isOpen={this.state.modalIsOpen}
          onRequestClose={() => this.setState({modalIsOpen: false})}
          style={customStyles}
        >
          <Paper style={{height: "100%"}}>
            <IconButton style={{float: "right", margin: '5px'}} onClick={() => this.setState({modalIsOpen: false})}>
              <CloseIcon />
            </IconButton>

            <div>
              {this.props.children}
            </div>
          </Paper>
        </ReactModal>
      </React.Fragment>
    )
  }
}

export default Modal;
