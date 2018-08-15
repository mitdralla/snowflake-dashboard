import React from 'react';
import ReactDOM from 'react-dom';
import Web3Provider from 'web3-webpacked-react';
import App from './App'

const Page = (
  <Web3Provider>
    <App />
  </Web3Provider>
)

ReactDOM.render(Page, document.getElementById('root'));
