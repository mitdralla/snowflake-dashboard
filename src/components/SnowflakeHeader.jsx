import React from 'react'
import { Chip, Avatar, SvgIcon, withStyles } from '@material-ui/core'
import { Fingerprint, AccountCircle } from '@material-ui/icons'
import { useSnowflakeBalance } from '../common/hooks'
import Copyable from './common/Copyable'

const styles = theme => ({
  root: {
    display:        'flex',
    justifyContent: 'center',
    flexWrap:       'wrap'
  },
  chip: {
    margin: theme.spacing.unit
  }
})

export default withStyles(styles)(function SnowflakeHeader ({ classes, ein, hydroId }) {
  // SnowflakeHeader
  const snowflakeBalance = useSnowflakeBalance(ein)

  if (!ein || ! hydroId) return ''

  return (
    <div className={classes.root}>
      <>
        <Copyable value={ein} placement='top'>
          <Chip
            avatar={<Avatar><Fingerprint /></Avatar>}
            color='primary'
            label={ein}
            className={classes.chip}
            clickable
          />
        </Copyable>

        <Copyable value={hydroId} placement='top'>
          <Chip
            avatar={<Avatar><AccountCircle /></Avatar>}
            color='primary'
            label={hydroId}
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
          label={snowflakeBalance}
          className={classes.chip}
        />
      </>
    </div>
  )
})
