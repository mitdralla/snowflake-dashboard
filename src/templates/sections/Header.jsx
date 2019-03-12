// Template for the global header, which includes four main sections.
// Branding logo powered by Hydro, Search Bar, Stats and FAQ Icons, And Account Details Dropdown.

import React from 'react';
import { useWeb3Context } from 'web3-react'
import * as classNames from "classnames"
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import SvgIcon from '@material-ui/core/SvgIcon';
import { withStyles } from '@material-ui/core/styles';

import { useHydroBalance, useAccountBalance, useEtherscanLink, useNamedContract } from '../../common/hooks'
import { Nav, Navbar, NavDropdown, Form, FormControl, Jumbotron, Button } from 'react-bootstrap';

const USER_SNOWFLAKE_IMG = '';

const styles = theme => ({
  root: {
    display:        'flex',
    justifyContent: 'center',
    flexWrap:       'wrap'
  },
  chip: {
    margin: theme.spacing.unit
  }
})

function Header({ classes }) {

  const context = useWeb3Context()
  const etherBalance = useAccountBalance()
  const hydroBalance = useHydroBalance()
  const accountLink = useEtherscanLink('address', context.account)
  const hydroAddress = useNamedContract('token')._address
  const hydroHolderLink = useEtherscanLink('token', hydroAddress)
  const snowflakeAddress = useNamedContract('snowflake')._address
  const snowflakeLink = useEtherscanLink('address', snowflakeAddress)

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">SNOWFLAKE</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Form inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
            <Button variant="outline-success">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Navbar>
    </>
  )
}

export default withStyles(styles)(Header)
