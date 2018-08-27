import React, { Component } from 'react';
import { withWeb3 } from 'web3-webpacked-react';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import SvgIcon from '@material-ui/core/SvgIcon';
import { withStyles } from '@material-ui/core/styles';

import { linkify, getContract } from '../common/utilities'

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

class Header extends Component {
  constructor(props) {
    super(props)

    this.state = {
      copyOpen: false,
      copyMessage: ''
    }

    this.linkify = linkify.bind(this)
    this.getContract = getContract.bind(this)
  }

  render() {
    const { classes } = this.props
    const networkName = this.props.w3w.getNetworkName()
    const snowflakeAddress = this.getContract('snowflake')._address
    const hydroAddress = this.getContract('token')._address
    const hydroHolderLink = `${this.props.w3w.etherscanFormat('token', hydroAddress)}?a=${this.props.w3w.account}`

    return (
      <React.Fragment>
        <Typography variant='display3' gutterBottom align="center" color="textPrimary">
          Snowflake Dashboard - {this.linkify('address', snowflakeAddress, networkName, 'display3')}
        </Typography>

        <div className={classes.root}>
          <Chip
            avatar={<Avatar>0x</Avatar>}
            color="primary"
            label={this.props.w3w.account.slice(2)}
            component="a"
            href={this.props.w3w.etherscanFormat('address', this.props.w3w.account)}
            target="_blank"
            clickable
            className={classes.chip}
          />

          {this.props.etherBalance === undefined ? '' :
            <Chip
              avatar={
                <Avatar>
                  <SvgIcon viewBox="0 0 320 512">
                    <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z" />
                  </SvgIcon>
                </Avatar>
              }
              label={this.props.etherBalance}
              className={classes.chip}
            />
          }

          {this.props.hydroBalance === undefined ? '' :
            <Chip
              avatar={
                <Avatar>
                  <SvgIcon viewBox="0 0 512 512">
                    <path d="M256,512C114.62,512,0,397.38,0,256S114.62,0,256,0,512,114.62,512,256,397.38,512,256,512Zm0-89c70.69,0,128-60.08,128-134.19q0-62.17-90.1-168.44Q282.38,106.74,256,77.91q-27.8,30.42-39.84,44.71Q128,227.27,128,288.77C128,362.88,185.31,423,256,423Z" />
                  </SvgIcon>
                </Avatar>
              }
              label={this.props.hydroBalance}
              color="primary"
              component="a"
              href={hydroHolderLink}
              target="_blank"
              clickable
              className={classes.chip}
            />
          }
        </div>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(withWeb3(Header))
