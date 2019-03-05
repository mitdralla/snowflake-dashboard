// Utility for click to copy functionality, currently used on hover of the users EIN, SnowflakeID and Hydro total.

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import { CopyToClipboard } from 'react-copy-to-clipboard';

class Copyable extends Component {
  constructor(props) {
    super(props)

    this.state = {
      copyOpen:    false,
      copyMessage: ''
    }
  }

  render() {
    const { children } = this.props

    return (
      <Fragment>
        <Tooltip
          title={this.state.copyMessage}
          placement={this.props.placement}
          onOpen={() => { if (!this.state.copyOpen) this.setState({copyOpen: true, copyMessage: 'Copy'})}}
          onClose={() => this.setState({copyOpen: false})}
          open={this.state.copyOpen}
        >
          <CopyToClipboard
            text={this.props.value}
            onCopy={() => this.setState({copyMessage: 'Copied!'}) }
          >
            {children}
          </CopyToClipboard>
        </Tooltip>
      </Fragment>
    )
  }
}

Copyable.propTypes = {
  value:     PropTypes.string.isRequired,
  placement: PropTypes.string,
}

Copyable.defaultProps = {
  placement: 'left',
}

export default Copyable
