import React, { useEffect } from 'react';
import Web3Provider from 'web3-react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { BrowserRouter as Router } from 'react-router-dom'
import green from '@material-ui/core/colors/green';
import { MetaMaskConnector } from 'web3-react/connectors'
import { useWeb3Context } from 'web3-react/hooks'

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

const metamask = new MetaMaskConnector({ supportedNetworks: [4] })
const connectors = { metamask }

function Web3Switch () {
  const context = useWeb3Context()

  useEffect(() => {
    context.setConnector('metamask')
      .catch(() => console.error('unable to activate')) // eslint-disable-line no-console
  }, [])

  return !context.active ? null :
    <Router basename={process.env.PUBLIC_URL}>
      <App />
    </Router>
}

export default function AppWrapper () {
  return (
    <MuiThemeProvider theme={theme}>
      <Web3Provider connectors={connectors}>
        <Web3Switch />
      </Web3Provider>
    </MuiThemeProvider>
  )
}
