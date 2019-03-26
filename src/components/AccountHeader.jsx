import React from 'react';
import { useWeb3Context } from 'web3-react'
import * as classNames from "classnames"
import { Chip, Avatar, SvgIcon, Typography, withStyles } from '@material-ui/core';
import { useHydroBalance, useAccountBalance, useEtherscanLink, useNamedContract } from '../common/hooks'

const styles = theme => ({
  root: {
    display:        'flex',
    justifyContent: 'center',
    flexWrap:       'wrap'
  },
  chip: {
    margin: theme.spacing.unit
  },
  hidden: {
    visibility: 'hidden'
  }
})

function AccountHeader({ classes }) {
  const context = useWeb3Context()
  const etherBalance = useAccountBalance()
  const hydroBalance = useHydroBalance()
  const accountLink = useEtherscanLink('address', context.account)
  const hydroAddress = useNamedContract('token')._address
  const hydroHolderLink = useEtherscanLink('token', hydroAddress)
  const snowflakeAddress = useNamedContract('snowflake')._address
  const snowflakeLink = useEtherscanLink('address', snowflakeAddress)

  return (
    <>
      <Typography
        variant='h2'
        gutterBottom
        align="center"
      >
        <Typography
          style={{display: 'inline-block', textDecoration: 'none'}}
          variant='h2'
          gutterBottom
          align="center"
          color="textPrimary"
          component="a"
          href={snowflakeLink}
          target="_blank"
        >
          Snowflake
        </Typography>
        {' '}Dashboard{' '}
        <Typography
          style={{display: 'inline-block', textDecoration: 'none'}}
          color='primary'
          variant='h2'
          component="a"
          href="https://docs.google.com/a/hydrogenplatform.com/forms/d/1Nt0XfdlJIxqLm52GkV_bNZ9iw4Na3OR7yqIxyiSavks"
          target="_blank"
        >
          Beta
        </Typography>
      </Typography>

      <div className={classNames(classes.root, !etherBalance || !hydroBalance ? classes.hidden : false)}>
        <Chip
          avatar={<Avatar>0x</Avatar>}
          color="primary"
          label={context.account.slice(2)}
          component="a"
          href={accountLink}
          target="_blank"
          clickable
          className={classes.chip}
        />


        <Chip
          avatar={
            <Avatar>
              <SvgIcon viewBox="0 0 320 512">
                <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z" />
              </SvgIcon>
            </Avatar>
          }
          label={etherBalance}
          className={classes.chip}
        />

        <Chip
          avatar={
            <Avatar>
              <SvgIcon viewBox="0 0 512 512">
                <path d="M256,512C114.62,512,0,397.38,0,256S114.62,0,256,0,512,114.62,512,256,397.38,512,256,512Zm0-89c70.69,0,128-60.08,128-134.19q0-62.17-90.1-168.44Q282.38,106.74,256,77.91q-27.8,30.42-39.84,44.71Q128,227.27,128,288.77C128,362.88,185.31,423,256,423Z" />
              </SvgIcon>
            </Avatar>
          }
          label={hydroBalance}
          color="primary"
          component="a"
          href={`${hydroHolderLink}?a=${context.account}`}
          target="_blank"
          clickable
          className={classes.chip}
        />
      </div>
    </>
  )
}

export default withStyles(styles)(AccountHeader)
