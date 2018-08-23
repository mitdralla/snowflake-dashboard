import React, { Component } from 'react';
import { withWeb3 } from 'web3-webpacked-react';
import Tooltip from '@material-ui/core/Tooltip';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import SvgIcon from '@material-ui/core/SvgIcon';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { withStyles } from '@material-ui/core/styles';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import SnowflakeAddresses from './SnowflakeAddresses'
import SnowflakeTokens from './SnowflakeTokens'
import SnowflakeResolvers from './SnowflakeResolvers'
import StoreModal from './StoreModal'

import { getContract } from '../common/utilities'

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

class Snowflake extends Component {
  constructor(props) {
    super(props)

    this.state = {
      copyOpen:         false,
      copyMessage:      '',
      owner:            undefined,
      ownedAddresses:   [],
      resolvers:        [],
      snowflakeBalance: undefined,
      resolverDetails:  null
    }

    this.getResolverDetails = this.getResolverDetails.bind(this)
    this.getSnowflakeDetails = this.getSnowflakeDetails.bind(this)

    this.getContract = getContract.bind(this)
    this.hydroContract = this.getContract('token')
    this.snowflakeContract = this.getContract('snowflake')
    this.resolverContract = resolver => this.getContract(resolver, true)
  }

  componentDidMount() {
    this.getSnowflakeDetails()
  }

  getSnowflakeDetails () {
    this.snowflakeContract.methods.getDetails(this.props.hydroId).call()
      .then(details => {
        let resolverDetails = details.resolvers.map(resolver => {
          return this.getResolverDetails(resolver)
        })

        Promise.all(resolverDetails)
          .then(results => {
            const extractedDetails = {}
            for (let i = 0; i < details.resolvers.length; i++) {
              extractedDetails[details.resolvers[i]] = results[i]
            }

            this.setState({resolverDetails: extractedDetails, ...{
              owner:            details.owner,
              ownedAddresses:   details.ownedAddresses,
              resolvers:        details.resolvers,
              snowflakeBalance: this.props.w3w.toDecimal(details.balance, 18)
            }})
          })
      })
  }

  getResolverDetails (resolver) {
    const resolverContract = this.resolverContract(resolver)

    const name = resolverContract.methods.snowflakeName().call()
      .catch(() => '')
    const description = resolverContract.methods.snowflakeDescription().call()
      .catch(() => '')
    const allowance = this.snowflakeContract.methods.getResolverAllowance(this.props.hydroId, resolver).call()
      .then(allowance => {
        return this.props.w3w.toDecimal(allowance, 18)
      })
      .catch(() => '')

    // this should never throw
    return Promise.all([name, description, allowance])
      .then(([name, description, allowance]) => {
        return {
          name:        name,
          description: description,
          allowance:   allowance
        }
      })
  }

  render() {
    const { classes } = this.props

    return (
      <React.Fragment>

        <div className={classes.root}>
          <Tooltip
            title={this.state.copyMessage}
            placement="top"
            onOpen={() => { if (!this.state.copyOpen) this.setState({copyOpen: true, copyMessage: 'Copy'})}}
            onClose={() => this.setState({copyOpen: false})}
            open={this.state.copyOpen}
          >
            <CopyToClipboard
              text={this.props.hydroId}
              onCopy={() => {
                this.setState({copyMessage: 'Copied!'})
                setTimeout(() => this.setState({copyOpen: false}), 750)
              }}
            >
              <Chip
                avatar={<Avatar><AccountCircle /></Avatar>}
                label={this.props.hydroId}
                className={classes.chip}
                clickable
              />
            </CopyToClipboard>
          </Tooltip>

          {this.state.snowflakeBalance === undefined ? '' :
            <Chip
              avatar={
                <Avatar>
                  <SvgIcon viewBox="0 0 512 512">
                    <path d="M256,512C114.62,512,0,397.38,0,256S114.62,0,256,0,512,114.62,512,256,397.38,512,256,512Zm0-89c70.69,0,128-60.08,128-134.19q0-62.17-90.1-168.44Q282.38,106.74,256,77.91q-27.8,30.42-39.84,44.71Q128,227.27,128,288.77C128,362.88,185.31,423,256,423Z" />
                  </SvgIcon>
                </Avatar>
              }
              label={this.state.snowflakeBalance}
              className={classes.chip}
            />
          }
        </div>

        <SnowflakeAddresses
          getAccountDetails={this.props.getAccountDetails}
          owner={this.state.owner}
          ownedAddresses={this.state.ownedAddresses}
          hydroId={this.props.hydroId}
          addClaim={this.props.addClaim}
        />
        <SnowflakeTokens
          hydroId={this.props.hydroId}
          getAccountDetails={this.props.getAccountDetails}
        />
        <SnowflakeResolvers
          resolvers={this.state.resolvers}
          resolverDetails={this.state.resolverDetails}
          hydroId={this.props.hydroId}
          getAccountDetails={this.props.getAccountDetails}
        />
        <StoreModal addedResolvers={this.state.resolvers} getAccountDetails={this.props.getAccountDetails} />
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(withWeb3(Snowflake))
