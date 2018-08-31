import React from 'react';
import ReactDOM from 'react-dom';
import Web3Provider, { NetworkUpdater } from 'web3-webpacked-react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';

import App from './components/App'


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
      main: "#0971f5",
    },
    secondary: {
      main: "#2C90B8",
    },
    success: {
      light: green[300],
      main:  green[500],
      dark:  green[700]
    }
  },
  typography: {
    fontWeightLight: 200,
    fontWeightRegular: 200,
    fontWeightMedium: 300
  },
});

theme.palette.success.contrastText = theme.palette.getContrastText(green[700])

const UnsupportedNetwork = <div><h1>Unsupported Network</h1><p>Please switch to Rinkeby</p></div>

const Page = (
  <MuiThemeProvider theme={theme}>
    <Web3Provider supportedNetworks={[4]} screens={{unsupportedNetwork: UnsupportedNetwork}}>
      <NetworkUpdater>
        <App />
      </NetworkUpdater>
    </Web3Provider>
  </MuiThemeProvider>
)

ReactDOM.render(Page, document.getElementById('root'));
