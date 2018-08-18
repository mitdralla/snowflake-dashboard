import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Modal from 'react-modal';

Modal.setAppElement('#root')

class ModalView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  render() {
    return (
      <div>
        <Button variant="outlined" onClick={this.openModal}>View Data</Button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          contentLabel={this.props.resolver}
        >
          <div>
            {this.props.children}
            <Button variant="outlined" onClick={this.closeModal}>Close</Button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default ModalView;
