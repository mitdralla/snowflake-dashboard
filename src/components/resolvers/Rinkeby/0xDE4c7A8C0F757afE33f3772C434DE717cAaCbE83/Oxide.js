import React, { useState } from 'react'
import { TextField, Typography, Button } from '@material-ui/core'

import { useAccountEffect, useWeb3Context } from 'web3-react/hooks'

import { useGenericContract, useNamedContract } from '../../../../common/hooks'
import TransactionButton from '../../../common/TransactionButton'

import { ABI } from './index'

export default function Oxide ({ ein }) {
  const context = useWeb3Context()
  const [activePot, setPot]  = useState('')
  const [rollResult, setRoll]  = useState('')
  const [oxideBalance, setOxide]  = useState('')
  const [activeRound, setRound]  = useState('')
  const [committedWager, setWager]  = useState('')
  const [activePunters, setPunters]  = useState('')
  const [leaderboardData, setLeaderboard]  = useState('')
  const clientRaindropContract = useNamedContract('clientRaindrop')
  const oxideContract = useGenericContract('0xDE4c7A8C0F757afE33f3772C434DE717cAaCbE83', ABI)

  function componentDidMount() {
      oxideBalance(context.selectedAccount).then((oxide) => setOxide(oxide))
      getRound().then(() => refreshLeaderboard())
      getParticipants()
      getPot()
  }

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

  function placeWager() {
    oxideContract.methods.placeWager(committedWager)
    .send({ from: context.selectedAccount })
      .catch(() => {
        setWager('Error cannot submit wager')
      })
  }

  function getParticipants() {
    oxideContract.methods.getParticipants().call()
    .then(punters => setPunters(punters))
  }

  function getRound() {
    oxideContract.methods.getRound().call()
    .then(round => setRound(round))
  }

  function getPot() {
    oxideContract.methods.getPot().call()
    .then(pot => activePot(pot))
  }

  function oxideBalance(_address) {
    return oxideContract.methods.oxideBalance(_address).call()
  }

return (
    <div>

    <Typography variant='h3' gutterBottom align="center" color="textPrimary">
    Pot: {activePot}
    </Typography>

    <Typography variant='h3' gutterBottom align="center" color="textPrimary">
    Round:  {activeRound}
    </Typography>

    <Typography variant='h3' gutterBottom align="center" color="textPrimary">
    Punters: {activePunters}
    </Typography>

    <TextField
      label="Wager Amount"
      helperText="Disclaimer: You are placing a bet and could possibly lose your funds."
      margin="normal"
      value={committedWager}
      onChange={e => setWager(e.target.value)}
      fullWidth
    />

    <Button
        onClick={placeWager}
        onConfirmation={context.forceAccountReRender}
      >
      wager !
      </Button>

        </div>
  )
}
