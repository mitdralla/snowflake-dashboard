// Template for the global header, which includes four main sections.
// Branding logo powered by Hydro, Search Bar, Stats and FAQ Icons, And Account Details Dropdown.

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Nav, Navbar, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import config from '../../config.jsx'

class Header extends Component {
  render() {
    return (
      <header>
        <Navbar bg="light" expand="lg">
          <Link className="navbar-brand" to="/">{config.general.dappStoreName}</Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Form inline>
              <FormControl type="text" placeholder={config.general.dappSearchPlaceholderText} className="mr-sm-2 searchBar" />
            </Form>
          </Navbar.Collapse>
          <Nav className="mr-auto">
            <Link to="/stats" className="nav-link" role="button">Stats</Link>
            <Link to="/faq" className="nav-link" role="button">FAQ</Link>
            <NavDropdown title="Welcome John Smith" id="basic-nav-dropdown">
              <NavDropdown.Item href="#"><strong>0x</strong> 03FA1656038</NavDropdown.Item>
              <NavDropdown.Item href="#">External Balances</NavDropdown.Item>
              <NavDropdown.Item href="#">34 ETH</NavDropdown.Item>
              <NavDropdown.Item href="#">234,000,000 HYDRO</NavDropdown.Item>
              <NavDropdown.Item href="#">dApp Store Balance</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#"><Button>Get More Hydro</Button></NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar>
      </header>
    )
  }
}

export default Header
