import React from 'react';
import ReactDOM from 'react-dom';
import Web3Provider, { AccountUpdater } from 'web3-webpacked-react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import App from './components/App'

const theme = createMuiTheme({
  typography: {
    fontWeightLight: 100,
    fontWeightRegular: 200,
    fontWeightMedium: 300
  },
});

const Page = (
  <MuiThemeProvider theme={theme}>
    <Web3Provider supportedNetworks={[4]}>
      <AccountUpdater>
        <App />
      </AccountUpdater>
    </Web3Provider>
  </MuiThemeProvider>
)

ReactDOM.render(Page, document.getElementById('root'));
