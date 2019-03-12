// Template for a featured hero section of rotating dApps.

import React from 'react';
import * as config from '../../config.jsx'
import { useWeb3Context } from 'web3-react'
import * as classNames from "classnames"
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import SvgIcon from '@material-ui/core/SvgIcon';
import { withStyles } from '@material-ui/core/styles';

import { useHydroBalance, useAccountBalance, useEtherscanLink, useNamedContract } from '../../common/hooks'
import { Nav, Navbar, NavDropdown, Form, FormControl, Jumbotron, Button, Container, Row, Column } from 'react-bootstrap'

// Owl Carousel Config.
const options = {
    items: config.HERO_CAROUSEL_MAX_ITEMS,
};

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

function HeroCarousel({ classes }) {

  return (
    <>
      <div class="HeroCarouselWrapper">
        <div class="HeroCarousel">
          <div class="ItemWrapper">
            <h4>Item 1</h4>
          </div>
          <div class="ItemWrapper">
            <h4>Item 2</h4>
          </div>
          <div class="ItemWrapper">
            <h4>Item 3</h4>
          </div>
          <div class="ItemWrapper">
            <h4>Item 4</h4>
          </div>
          <div class="ItemWrapper">
            <h4>Item 5</h4>
          </div>
          <div class="ItemWrapper">
            <h4>Item 6</h4>
          </div>
          <div class="ItemWrapper">
            <h4>Item 7</h4>
          </div>
          <div class="ItemWrapper">
            <h4>Item 8</h4>
          </div>
          <div class="ItemWrapper">
            <h4>Item 9</h4>
          </div>
          <div class="ItemWrapper">
            <h4>Item 10</h4>
          </div>
        </div>
      </div>
    </>
  )
}

export default withStyles(styles)(HeroCarousel)
