import React, { Component } from 'react';
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

  // this.props.resolverContract

  render() {
    return (
      <div>
        <button onClick={this.openModal}>View Data</button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          contentLabel={this.props.resolver}
        >
          <div>
            {this.props.children}
            <button onClick={this.closeModal}>close</button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default ModalView;
