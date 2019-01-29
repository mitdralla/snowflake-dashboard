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
  const oxideContract = useGenericContract('0x16fD6e2E1C4afB9C4e7B901141706596317e4ceB', ABI)
  useAccountEffect(() => {
      getParticipants()
      getPot()
  })

  function refreshLeaderboard () {
    oxideContract.getPastEvents("scoreLog", { fromBlock: 0, toBlock: 'latest' })
      .then(result => {
        var leaderboard = { account: [], wager: [] , roll: [] }
        for(var x = 0; x < result.length; x++){
          if(JSON.stringify(result[x].args.wagerRound) === activeRound){
            leaderboard[account].push(JSON.stringify(result[x].args.wagerUser))
            leaderboard[wager].push(JSON.stringify(result[x].args.wagerAmount))
            leaderboard[roll].push(JSON.stringify(result[x].args.wagerRoll))
          }
        }
        setLeaderboard(leaderboard)
      })
      .catch(() => {
        setLeaderboard('Error cannot get leaderboard data')
      })
  }

  function placeWager () {
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

  function getPot() {
    oxideContract.methods.getPot().call()
    .then(pot => activePot(punters))
  }

return (
    <div>
     I'm BLANK !
    </div>
  )
}
