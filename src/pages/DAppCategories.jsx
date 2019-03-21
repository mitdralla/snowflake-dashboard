// dApp Categories landing page

import React, { Component } from 'react'
import { Button, Card, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { titalizeText } from '../common/utilities'

//import config from '../config.jsx'
//const faqItems = config.faqs.items;

class DAppCategories extends Component {

  render() {
    return (
      <div>
        <h2>DApp Category: {titalizeText(this.props.match.params[0])}</h2>
        <div className="dappWrapper">
          <Row>
          <Card style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>Hello World</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up the bulk of
                the card's content.
              </Card.Text>
              <Link to="/dapp/hello-world"><Button>View dApp</Button></Link>
            </Card.Body>
          </Card>

          <Card style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>Uber</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up the bulk of
                the card's content.
              </Card.Text>
              <Link to="/dapp/hello-world"><Button>View dApp</Button></Link>
            </Card.Body>
          </Card>

          <Card style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>Crypto Kitties</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up the bulk of
                the card's content.
              </Card.Text>
              <Link to="/dapp/crypto-kitties"><Button>View dApp</Button></Link>
            </Card.Body>
          </Card>

          <Card style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>Robinhood</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up the bulk of
                the card's content.
              </Card.Text>
              <Link to="/dapp/robinhood"><Button>View dApp</Button></Link>
            </Card.Body>
          </Card>
          </Row>
        </div>
      </div>
    )
  }
}

export default DAppCategories
