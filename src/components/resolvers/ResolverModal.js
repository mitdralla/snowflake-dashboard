import React, { Component } from 'react';
import { IconButton } from '@material-ui/core';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

import Modal from '../common/Modal';

class ResolverModal extends Component {
  render() {
    return (
      <div>
        <Modal
          fullScreen
          opener={(props) => {
            return <IconButton {...props}> <OpenInNewIcon /> </IconButton>
          }}
          title={this.props.resolverName}
        >
          {this.props.children}
        </Modal>
      </div>
    )
  }
}

export default ResolverModal;
