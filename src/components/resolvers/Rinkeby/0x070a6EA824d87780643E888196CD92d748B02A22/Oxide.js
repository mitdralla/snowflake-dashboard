/* eslint-disable no-console */

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
import WinnerIcon from '@material-ui/icons/Whatshot';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

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

import { useSnowflakeBalance, useGenericContract } from '../../../../common/hooks'
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
  const [activePot, setPot]  = useState(0)
  const [activeRound, setRound]  = useState(0)
  const [activeWinner, setWinner]  = useState(0)
  const [oxideBalance, setOxide]  = useState(0)
  const [committedWager, setWager]  = useState(0)
  const [activePunters, setPunters]  = useState(0)
  const [open, setOpen] = useState(false);
  const [leaderboardData, setLeaderboard]  = useState([])
  const oxideContract = useGenericContract('0x070a6EA824d87780643E888196CD92d748B02A22', ABI)
  const snowflakeBalance = useSnowflakeBalance(ein)

  function refreshLeaderboard(_round)  {
    oxideContract.getPastEvents("scoreLog", { fromBlock: 0, toBlock: 'latest' })
    .then((result) => {
        var leaderboard = [];
        for(var x = 0; x < result.length; x++){
          var round = parseInt(parseObject(result[x].returnValues.round))
           _round = parseInt(parseObject(_round))
          if(round === _round){
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
  }

  function getWinner(_round){
    oxideContract.getPastEvents("winnerAlert", { fromBlock: 0, toBlock: 'latest' })
    .then((result) => {
      for(var x = 0; x < result.length; x++){
        var round = parseInt(parseObject(result[x].returnValues.round))
        if(round === _round){
          setWinner(parseInt(parseObject(result[x].returnValues.ein)))
        }
      }
    })
  }

  function watchWinner() {
    oxideContract.events.winnerAlert({ fromBlock: 0 },
    () => { })
    .on('data', (event) => {
      setWinner(event.returnValues.ein)
    })
  }

  function watchScores(_round){
    oxideContract.events.scoreLog({ fromBlock: 0 },
    () => { })
    .on('data', () => {
      refreshLeaderboard(_round)
      })
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

  function handleClickOpen() {
      setOpen(true);
  }

    function handleClose() {
      setOpen(false);
    }

  useAccountEffect(() => {
      oxideContract.methods.oxideBalance(context.account).call()
      .then((oxide) => setOxide(parseNumber(oxide)))
      oxideContract.methods.getParticipants().call()
      .then((punters) => setPunters(punters))
      oxideContract.methods.getPot().call()
      .then((pot) => setPot(toDecimal(pot, 18)))
      oxideContract.methods.getRound().call()
      .then((round) => {
        refreshLeaderboard(round)
        watchScores(round)
        getWinner(round)
        setRound(round)
        watchWinner()
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
             avatar={<Avatar><WinnerIcon/></Avatar>}
             color='primary'
             label={activeWinner}
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
                     <TableRow component="div" style={createMuiTheme({ display: 'flex' })} key={data.ein}>
                       <CustomTableCell style={createMuiTheme({ height: 25, width: '15vw' })} align="right">
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
         <Grid item xs={4}>
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
              &nbsp;&nbsp;
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
         <Grid item xs={3}>
         </Grid>
         <Grid item >
           <Typography variant='h5' gutterBottom align="left" className="OxideLegend">
           Legend
           </Typography>
           <p className="OxideLegend"><UsersIcon/> Punters</p>
           <p className="OxideLegend"><WinnerIcon/> Winner</p>
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
          &nbsp;&nbsp;
            &nbsp;&nbsp;
              &nbsp;&nbsp;
        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
           How to play?
       </Button>
        </Grid>
        </Grid>


        <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">{"How to play?"}</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                  <p> Approve a specified amount of HYDRO via your resolver management </p>
                  <p> Place your wager and wait until your roll and oxide (H20) amount show on the leaderboard
                      the results shall be determined with every week or so based on demand.</p>
                  <p> The max wager is 50,000 HYDRO and the punter who <span style={{ fontWeight: 'bold' }}> first </span> hits the highest oxide amount, takes all the pot. </p>
                  <p>So meaning if someone rolls a <span style={{ fontWeight: 'bold' }}> 15 </span> and a correlating <span style={{ fontWeight: 'bold' }}> 50,000 HYDRO </span> wager, it&apos;s not worth your time because they have
                  <span style={{ fontWeight: 'bold' }}> already won!</span></p>
                  <p><span style={{ fontWeight: 'bold' }}> Operating fee per round and minimum wager: 500 HYDRO</span> </p>
                  <p>Created for HDCP task #228 by <span style={{ fontWeight: 'bold' }}>Gozzy</span> </p>
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary" autoFocus>
                    Ok, let me play!
                  </Button>
                </DialogActions>
              </Dialog>

    </div>
  )
}
