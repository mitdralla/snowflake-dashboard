import React, { Component, Fragment } from 'react';
import { withWeb3 } from 'web3-webpacked-react';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import SvgIcon from '@material-ui/core/SvgIcon';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { withStyles } from '@material-ui/core/styles';

import Copyable from './Copyable'

const styles = theme => ({
  root: {
    display:        'flex',
    justifyContent: 'center',
    flexWrap:       'wrap',
  },
  chip: {
    margin: theme.spacing.unit,
  }
})

class SnowflakeHeader extends Component {
  constructor(props) {
    super(props)

    this.state = {
      copyOpen:    false,
      copyMessage: ''
    }
  }

  render() {
    const { classes, snowflakeBalance } = this.props

    return (
      <div className={classes.root}>
        {snowflakeBalance === undefined ? '' : (
          <Fragment>
            <Copyable value={this.props.hydroId}>
              <Chip
                avatar={<Avatar><AccountCircle /></Avatar>}
                color='primary'
                label={this.props.hydroId}
                className={classes.chip}
                clickable
              />
            </Copyable>

            <Chip
              avatar={
                <Avatar>
                  <SvgIcon viewBox="0 0 512 512">
                    <path d="M256,512C114.62,512,0,397.38,0,256S114.62,0,256,0,512,114.62,512,256,397.38,512,256,512Zm0-89c70.69,0,128-60.08,128-134.19q0-62.17-90.1-168.44Q282.38,106.74,256,77.91q-27.8,30.42-39.84,44.71Q128,227.27,128,288.77C128,362.88,185.31,423,256,423Z" />
                  </SvgIcon>
                </Avatar>
              }
              label={
                Number(this.props.w3w.toDecimal(snowflakeBalance, 18))
                  .toLocaleString(undefined, { maximumFractionDigits: 3 })
              }
              className={classes.chip}
            />
          </Fragment>
        )}
      </div>
    )
  }
}

export default withStyles(styles)(withWeb3(SnowflakeHeader))
