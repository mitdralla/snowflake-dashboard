import React, { useState } from 'react'
import { Grid, TextField, Typography, Button } from '@material-ui/core'
import Chip from '@material-ui/core/Chip'
import SvgIcon from '@material-ui/core/SvgIcon'
import Avatar from '@material-ui/core/Avatar'
import OxideIcon from '@material-ui/icons/InvertColors';
import TimerIcon from '@material-ui/icons/HourglassEmpty';
import UsersIcon from '@material-ui/icons/People';
import StarIcon from '@material-ui/icons/StarBorder';

import { useAccountEffect, useWeb3Context } from 'web3-react/hooks'

import { useHydroId, useEINDetails, useSnowflakeBalance, useGenericContract, useNamedContract } from '../../../../common/hooks'
import TransactionButton from '../../../common/TransactionButton'

import { ABI } from './index'

export default function Oxide ({ ein }) {
  const context = useWeb3Context()
  const einDetails = useEINDetails(ein)
  const [activePot, setPot]  = useState(0)
  const [rollResult, setRoll]  = useState(0)
  const [activeRound, setRound]  = useState(0)
  const [oxideBalance, setOxide]  = useState(0)
  const [committedWager, setWager]  = useState(0)
  const [activePunters, setPunters]  = useState(0)
  const [hydroId, hydroIdAddress] = useHydroId()
  const [leaderboardData, setLeaderboard]  = useState('')
  const clientRaindropContract = useNamedContract('clientRaindrop')
  const oxideContract = useGenericContract('0xDE4c7A8C0F757afE33f3772C434DE717cAaCbE83', ABI)
  const snowflakeBalance = useSnowflakeBalance(ein)

  function refreshLeaderboard() {
    oxideContract.getPastEvents("scoreLog", { fromBlock: 0, toBlock: 'latest' })
      .then(result => {
        var leaderboard = { account: [], wager: [] , roll: [] }
        for(var x = 0; x < result.length; x++){
          if(JSON.stringify(result[x].args.wagerRound) === activeRound){
            leaderboard.account.push(JSON.stringify(result[x].args.wagerUser))
            leaderboard.wager.push(JSON.stringify(result[x].args.wagerAmount))
            leaderboard.roll.push(JSON.stringify(result[x].args.wagerRoll))
          }
        }
        setLeaderboard(leaderboard)
      })
      .catch(() => {
        setLeaderboard('Error cannot get leaderboard data')
      })
  }

  useAccountEffect(() => {
      oxideContract.methods.oxideBalance(context.account).call()
      .then((oxide) => setOxide(oxide.toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")))
      oxideContract.methods.getParticipants().call()
      .then((punters) => setPunters(punters))
      oxideContract.methods.getRound().call()
      .then(round => setRound(round))
      oxideContract.methods.getPot().call()
      .then(pot => activePot(pot))
  })


return (
    <div>
         <Grid container spacing={12}>
           <Grid item xs>
           </Grid>
           <Grid item xs={3}>
           <Chip
             avatar={<Avatar><UsersIcon/></Avatar>}
             color='primary'
             label={activePunters}
           />
           </Grid>
           <Grid item xs={3}>
           <Chip
             avatar={<Avatar><StarIcon/></Avatar>}
             color='primary'
             label={activePot}
           />
           </Grid>
           <Grid item xs={3}>
           <Chip
             avatar={<Avatar><TimerIcon/></Avatar>}
             color='primary'
             label={activeRound}
           />
           </Grid>
           <Grid item xs>
           </Grid>
        </Grid>

         <Grid container spacing={12}>
         <Grid item xs>
         </Grid>
         <Grid item xs={3}>
         <Chip
           avatar={
             <Avatar>
             <SvgIcon viewBox="0 0 512 512">
               <path d="M256,512C114.62,512,0,397.38,0,256S114.62,0,256,0,512,114.62,512,256,397.38,512,256,512Zm0-89c70.69,0,128-60.08,128-134.19q0-62.17-90.1-168.44Q282.38,106.74,256,77.91q-27.8,30.42-39.84,44.71Q128,227.27,128,288.77C128,362.88,185.31,423,256,423Z" />
             </SvgIcon>
             </Avatar>
           }
           label={snowflakeBalance}
         />
         </Grid>
         <Grid item xs={3}>
         <Chip
           avatar={
             <Avatar>
             <OxideIcon/>
             </Avatar>
           }
           color='primary'
           label={oxideBalance}
         />
         </Grid>
         <Grid item xs>
         </Grid>
         </Grid>

         <Grid container spacing={12}>
           <Grid item xs={3}>
           </Grid>
           <Grid item xs={6}>
           <TextField
             label="Wager Amount"
             helperText="Disclaimer: You are placing a bet and could possibly lose your funds."
             margin="normal"
             value={committedWager}
             onChange={e => setWager(e.target.value)}
             halfWidth
           />
           </Grid>
           <Grid item xs={3}>
           </Grid>
         </Grid>

         <Grid container spacing={12}>
           <Grid item xs={3}>
           </Grid>
           <Grid item xs={3}>
           </Grid>
           <Grid item xs={3}>
         <TransactionButton
           readyText='Wager'
           method={() => oxideContract.methods.placeWager(committedWager)}
           onConfirmation={context.forceAccountReRender}
          />
          </Grid>
          <Grid item xs={3}>
          </Grid>
        </Grid>
       </div>
  )
}
