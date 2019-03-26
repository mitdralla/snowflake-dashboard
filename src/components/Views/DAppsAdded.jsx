// Manage DApps page

import React, { Component } from 'react'
import { Button, Card, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

//import config from '../config.jsx'
//const statsConfig = config.stats.config;

class ManageDApps extends Component {

  render() {
    return (
      <div>
        <h2>Manage Your dApps</h2>
        <div className="dappWrapper">
          <Row>
          <Card style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>Hello World</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up the bulk of
                the card's content.
              </Card.Text>
              <Link to="/dapp/hello-world"><Button variant="success">Open</Button></Link> <Button variant="danger">Remove</Button>
            </Card.Body>
          </Card>

          <Card style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>Uber</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up the bulk of
                the card's content.
              </Card.Text>
              <Link to="/dapp/uber"><Button variant="success">Open</Button></Link> <Button variant="danger">Remove</Button>
            </Card.Body>
          </Card>

          <Card style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>Crypto Kitties</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up the bulk of
                the card's content.
              </Card.Text>
              <Link to="/dapp/crypto-kitties"><Button variant="success">Open</Button></Link> <Button variant="danger">Remove</Button>
            </Card.Body>
          </Card>

          <Card style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>Robinhood</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up the bulk of
                the card's content.
              </Card.Text>
              <Link to="/dapp/robinhood"><Button variant="success">Open</Button></Link> <Button variant="danger">Remove</Button>
            </Card.Body>
          </Card>
          </Row>
        </div>
      </div>
    )
  }
}

export default ManageDApps
