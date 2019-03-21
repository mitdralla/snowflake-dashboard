// Template for the global Footer, which includes three main sections:
// Powered by Hydro, Footer Links, and Github powered and hosted line.

import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { Nav, Navbar, Button, Container, Jumbotron } from 'react-bootstrap'
import config from '../../config.jsx'

const footerNavItems = config.dappFooterNavigation.items;
const jumbotron = config.jumbotrons.items[0];

class Footer extends Component {
  render() {
    return (
      <footer>

        <Jumbotron fluid className="text-center">
          <Container>
            <h1>{jumbotron.title}</h1>
            <p>{jumbotron.description}</p>
            <Button variant="outline-primary" to={jumbotron.buttonLink}>{jumbotron.buttonText}</Button>
          </Container>
        </Jumbotron>

        <Navbar bg="light" expand="lg">
          <Navbar.Brand href="#home">Powered by HYDRO</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              {footerNavItems.map((item, i) => {
                return <Link className="nav-link" role="button" to={item.link} key={i}>{item.name}</Link>
              })}
            </Nav>
          </Navbar.Collapse>
          <Navbar.Brand href="#home">Maintained and hosted on Github</Navbar.Brand>
        </Navbar>

      </footer>
    )
  }
}

export default Footer
