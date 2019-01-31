import React, { useState } from 'react'
import { Grid, TextField, Typography, Button } from '@material-ui/core'
import Chip from '@material-ui/core/Chip'
import SvgIcon from '@material-ui/core/SvgIcon'
import Avatar from '@material-ui/core/Avatar'
import OxideIcon from '@material-ui/icons/InvertColors';
import TimerIcon from '@material-ui/icons/HourglassEmpty';
import UsersIcon from '@material-ui/icons/People';
import WagerIcon from '@material-ui/icons/LocalDrink';
import DiceIcon from '@material-ui/icons/Casino';
import { createMuiTheme } from '@material-ui/core/styles';

import FingerprintIcon from '@material-ui/icons/Fingerprint';
import { withStyles } from '@material-ui/core/styles';
import StarIcon from '@material-ui/icons/StarBorder';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { useAccountEffect, useWeb3Context } from 'web3-react/hooks'
import { toDecimal, fromDecimal } from 'web3-react/utilities'

import { useHydroId, useEINDetails, useSnowflakeBalance, useGenericContract, useNamedContract } from '../../../../common/hooks'
import TransactionButton from '../../../common/TransactionButton'

import { ABI } from './index'

import './Oxide.css'

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: '#0971f5',
    color: theme.palette.common.white,
    fontSize: 20,

  },
  body: {
    fontSize: 14,
  },
}))(TableCell);


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
  const [waitForRender, setInit]  = useState(false)
  const [leaderboardData, setLeaderboard]  = useState([])
  const clientRaindropContract = useNamedContract('clientRaindrop')
  const oxideContract = useGenericContract('0xa8033faC7cC8E8f650e1405493D4f1317E7dE9BB', ABI)
  const snowflakeBalance = useSnowflakeBalance(ein)

  function refreshLeaderboard(_round)  {
    setLeaderboard([])
    oxideContract.getPastEvents("scoreLog", { fromBlock: 0, toBlock: 'latest' })
    .then((result) => {
        var leaderboard = [];
        for(var x = 0; x < result.length; x++){
          var round = parseInt(parseObject(result[x].returnValues.round))
          console.log(round , _round);
          if(round == _round){
            leaderboard.push(createData(
            parseObject(result[x].returnValues.ein),
            parseNumber(parseObject(result[x].returnValues.amount)),
            parseNumber(parseObject(result[x].returnValues.roll)),
            parseNumber(Math.pow(
              parseObject(result[x].returnValues.roll),
              parseObject(result[x].returnValues.roll))
              *parseObject(result[x].returnValues.amount),
            )))
          }
        }
        setLeaderboard(leaderboard)
      })
      setInit(true)
  }

  function parseObject(_object) {
      return JSON.stringify(_object).replace(/["]+/g, '')
  }

  function parseNumber(_value) {
      return _value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

function createData(ein, wager, roll, oxide) {
  return { ein, wager, roll, oxide };
}

  useAccountEffect(() => {
      oxideContract.methods.oxideBalance(context.account).call()
      .then((oxide) => setOxide(parseNumber(oxide)))
      oxideContract.methods.getPot().call()
      .then((pot) => setPot(parseNumber(parseInt(pot/Math.pow(10,18)))))
      oxideContract.methods.getParticipants().call()
      .then((punters) => setPunters(punters))
      oxideContract.methods.getRound().call()
      .then((round) => {
        refreshLeaderboard(round)
        setRound(round)
      })
  })


    return (

  <div>

         <Grid container direction="row" justify="center" alignItems="center" className="OxideStats">
          <Grid item xs={2}>
           </Grid>
           <Grid item>
           <Chip
             avatar={<Avatar><UsersIcon/></Avatar>}
             color='primary'
             label={activePunters}
           />
           </Grid>
           <Grid item xs={1}>
           </Grid>
           <Grid item >
           <Chip
             avatar={<Avatar><StarIcon/></Avatar>}
             color='primary'
             label={activePot}
           />
           </Grid>
           <Grid item xs={1}>
           </Grid>
           <Grid item >
           <Chip
             avatar={<Avatar><TimerIcon/></Avatar>}
             color='primary'
             label={activeRound}
           />
           </Grid>
           <Grid item xs={2}>
           </Grid>
        </Grid>
        <br></br><br></br>
        <Grid container direction="row" justify="center" alignItems="center">
        <Grid item >
          <Table component="div" style={createMuiTheme({ display: 'block' })}>
                 <TableHead component="div" style={createMuiTheme({  width: '60vw', display: 'block' })}>
                   <TableRow component="div" style={createMuiTheme({ display: 'block' })}>
                     <CustomTableCell  style={createMuiTheme({ width: '15vw' })} align="right"> <FingerprintIcon/> EIN</CustomTableCell>
                     <CustomTableCell  style={createMuiTheme({ width: '15vw' })} align="right"> <WagerIcon/> Wager</CustomTableCell>
                     <CustomTableCell  style={createMuiTheme({ width: '15vw' })} align="right"> <DiceIcon/> Roll</CustomTableCell>
                     <CustomTableCell  style={createMuiTheme({ width: '15vw' })} align="right"> <OxideIcon/> H20</CustomTableCell>
                   </TableRow>
                 </TableHead>
                 <TableBody component="div" style={createMuiTheme({ width: '60vw' , height: '20vh', overflow: 'auto', display: 'block' })}>
                 {leaderboardData.map(data => (
                     <TableRow component="div" style={createMuiTheme({ display: 'flex' })}>
                       <CustomTableCell style={createMuiTheme({ height: 25, width: '15vw' })} align="right" key={data.ein}>
                         {data.ein}
                       </CustomTableCell>
                       <CustomTableCell style={createMuiTheme({ height: 25, width: '15vw' })}  align="right">{data.wager}</CustomTableCell>
                       <CustomTableCell style={createMuiTheme({ height: 25, width: '15vw' })}  align="right">{data.roll}</CustomTableCell>
                       <CustomTableCell style={createMuiTheme({ height: 25, width: '15vw' })}  align="right">{data.oxide}</CustomTableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
               </Grid>
               </Grid>
         <Grid container direction="row" justify="center" alignItems="center"  className="OxideWager">
         <Grid item xs={5}>
         </Grid>
         <Grid item >
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
         <Grid item>
          &nbsp;&nbsp;
            &nbsp;&nbsp;
              &nbsp;&nbsp;<Chip
           avatar={
             <Avatar>
             <OxideIcon/>
             </Avatar>
           }
           color='primary'
           label={oxideBalance}
         />
         </Grid>
         <Grid item xs={4}>
         </Grid>
         <Grid item >
           <Typography variant='h5' gutterBottom align="right" className="OxideLegend">
           Legend
           </Typography>
           <p className="OxideLegend"><UsersIcon/> Punters</p>
           <p className="OxideLegend"><OxideIcon/> Oxide</p>
           <p className="OxideLegend"><TimerIcon/> Round</p>
           <p className="OxideLegend"><StarIcon/> Pot</p>
         </Grid>
         </Grid>

         <Grid container direction="row" justify="center" alignItems="center">
           <Grid item >
           <TextField
             label="Wager Amount"
             helperText="Disclaimer: You are placing a bet and could possibly lose your funds."
             margin="normal"
             value={committedWager}
             onChange={e => setWager(e.target.value)}
             halfWidth
           />
           </Grid>
         </Grid>

         <Grid container direction="row" justify="center" alignItems="center"  className="OxideButton">
           <Grid item >
         <TransactionButton
           readyText='Wager'
           method={() => oxideContract.methods.placeWager(
             fromDecimal(committedWager.toString(), 18))}
          />
          </Grid>
        </Grid>


   </div>
  )
}
