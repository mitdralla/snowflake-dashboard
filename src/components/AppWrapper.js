import React from 'react';
import Web3Provider from 'web3-react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';

import App from './App'

const theme = createMuiTheme({
  overrides: {
    MuiDialog: {
      paperFullScreen: {
        width: '90%',
        height: '90%'
      }
    }
  },
  palette: {
    primary: {
      main: "#0971f5"
    },
    secondary: {
      main: "#2C90B8"
    },
    success: {
      light: green[300],
      main:  green[500],
      dark:  green[700]
    }
  },
  typography: {
    useNextVariants: true,
    fontWeightLight:   200,
    fontWeightRegular: 200,
    fontWeightMedium:  300
  }
})
theme.palette.success.contrastText = theme.palette.getContrastText(green[700])

export default function AppWrapper () {
  return (
    <MuiThemeProvider theme={theme}>
      <Web3Provider supportedNetworks={[4]}>
        <App />
      </Web3Provider>
    </MuiThemeProvider>
  )
}
