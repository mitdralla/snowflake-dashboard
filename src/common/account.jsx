// Get users hydro balance from wallet.
// TODO: This can be made more generic by adding parameters to change the button class, color and target.
import React from 'react'
import { useWeb3Context } from 'web3-react'
import { useHydroBalance, useEtherscanLink, useNamedContract } from './hooks'
import { Chip, Avatar, SvgIcon, Typography } from '@material-ui/core';

export function GetUsersHydroBalanceFromWallet() {
  const context = useWeb3Context()
  const hydroBalance = useHydroBalance()
  const hydroAddress = useNamedContract('token')._address
  const hydroHolderLink = useEtherscanLink('token', hydroAddress)

  return (
    <Chip
      avatar={
        <Avatar>
          <SvgIcon viewBox="0 0 512 512">
            <path d="M256,512C114.62,512,0,397.38,0,256S114.62,0,256,0,512,114.62,512,256,397.38,512,256,512Zm0-89c70.69,0,128-60.08,128-134.19q0-62.17-90.1-168.44Q282.38,106.74,256,77.91q-27.8,30.42-39.84,44.71Q128,227.27,128,288.77C128,362.88,185.31,423,256,423Z" />
          </SvgIcon>
        </Avatar>
      }
      label={hydroBalance}
      color="default"
      component="a"
      href={`${hydroHolderLink}?a=${context.account}`}
      target="_blank"
      clickable
      className="dAppStoreWalletUsersHydro"
    />
  )
}
