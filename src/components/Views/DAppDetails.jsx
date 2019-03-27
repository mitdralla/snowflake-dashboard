// Submit dApp page

import React, { Component } from 'react'
import { Button } from 'react-bootstrap';
import { titalizeText } from '../../common/utilities';

//import config from '../config.jsx'
//const faqItems = config.faqs.items;

class DAppDetails extends Component {

  render() {
    return (
      <div>
        <h2>DApp Details: {titalizeText(this.props.match.params[0])}</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <Button>Add dApp</Button>
      </div>
    )
  }
}

export default DAppDetails
