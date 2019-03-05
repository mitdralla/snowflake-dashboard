import React from 'react';
import Web3Provider, { Connectors } from 'web3-react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { BrowserRouter as Router } from 'react-router-dom';
import green from '@material-ui/core/colors/green';

import InitializingWeb3 from './networkConnectors/InitializingWeb3'

import App from './App'

const theme = createMuiTheme({
  overrides: {
    MuiDialog: {
      paperFullScreen: {
        width: '100%',
        height: '100%'
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

const { MetaMaskConnector } = Connectors
const metamask = new MetaMaskConnector({ supportedNetworks: [4] })
const connectors = { metamask }

export default function AppWrapper () {
  return (
    <MuiThemeProvider theme={theme}>
      <Web3Provider connectors={connectors}>
        <InitializingWeb3 connectors={connectors}>
          <Router basename={process.env.PUBLIC_URL}>
            <App />
          </Router>
        </InitializingWeb3>
      </Web3Provider>
    </MuiThemeProvider>
  )
}
