import React, { Component } from 'react';
import { IconButton } from '@material-ui/core';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

import Modal from '../Modal';

class ResolverModal extends Component {
  render() {
    return (
      <div>
        <Modal
          opener={(props) => {
            return <IconButton {...props}> <OpenInNewIcon /> </IconButton>
          }}
        >
          {this.props.children}
        </Modal>
      </div>
    )
  }
}

export default ResolverModal;
