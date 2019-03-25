import React, { Component } from 'react';
import { Web3Wrapper } from './Web3Wrapper'
import { Dashboard } from './Dashboard'

class App extends Component {
    render() {
        return (
          <Web3Wrapper>
            <Dashboard/>
          </Web3Wrapper>
        );
    }
}

export default App;
