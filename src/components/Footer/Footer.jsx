// Template for the global Footer, which includes three main sections:
// Powered by Hydro, Footer Links, and Github powered and hosted line.

import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, Navbar, Button, Container, Jumbotron } from 'react-bootstrap'
import './Footer.css'
import config from '../../config.jsx'

// List of footer navigation items and jumbotron config.
const footerNavItems = config.dappFooterNavigation.items;
const jumbotron = config.jumbotrons.items[0];

export default (function Footer() {
  return (
    <footer>
      {/** Dynamic Jumbotron: Content configured by config.js **/}
      <Jumbotron fluid className="text-center">
        <Container>
          <h1>{jumbotron.title}</h1>
          <p>{jumbotron.description}</p>
          <Button variant="outline-primary" to={jumbotron.buttonLink}>{jumbotron.buttonText}</Button>
        </Container>
      </Jumbotron>

      {/** Footer Navigation: Links configured by config.js **/}
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
})
