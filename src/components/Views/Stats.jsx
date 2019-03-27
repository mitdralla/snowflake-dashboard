// Stats page

import React, { Component } from 'react'
import { Card, Row } from 'react-bootstrap';

//import config from '../config.jsx'
//const statsConfig = config.stats.config;

class Stats extends Component {

  render() {
    return (
      <div>
        <h2>Stats</h2>
        <>
        <Row>
        <Card style={{ width: '18rem' }}>
          <Card.Body>
            <Card.Title>Total dApps</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the bulk of
              the card's content.
            </Card.Text>
          </Card.Body>
        </Card>

        <Card style={{ width: '18rem' }}>
          <Card.Body>
            <Card.Title>Daily Users</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the bulk of
              the card's content.
            </Card.Text>
          </Card.Body>
        </Card>

        <Card style={{ width: '18rem' }}>
          <Card.Body>
            <Card.Title>24 Hr. Txns</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the bulk of
              the card's content.
            </Card.Text>
          </Card.Body>
        </Card>

        <Card style={{ width: '18rem' }}>
          <Card.Body>
            <Card.Title>24 Hr. Txns in Hydro</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the bulk of
              the card's content.
            </Card.Text>
          </Card.Body>
        </Card>
        </Row>
        </>
      </div>
    )
  }
}

export default Stats
