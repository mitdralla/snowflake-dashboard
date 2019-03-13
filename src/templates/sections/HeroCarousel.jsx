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
import OwlCarousel from 'react-owl-carousel2'
import '../../index.css';
import '../../../node_modules/react-owl-carousel2/src/owl.carousel.css';
import '../../../node_modules/react-owl-carousel2/src/owl.theme.green.css';
import '../../../node_modules/react-owl-carousel2/src/owl.carousel.js';

import { useHydroBalance, useAccountBalance, useEtherscanLink, useNamedContract } from '../../common/hooks'
import { Nav, Navbar, NavDropdown, Form, FormControl, Jumbotron, Button, Grid, Container, Row, Column } from 'react-bootstrap'

// Owl Carousel Config.
const options = {
  items: config.HERO_CAROUSEL_MAX_ITEMS,
  loop: true,
  margin: 10,
  responsiveClass: true,
  responsive:{
      0:{
          items: 1,
          nav: true,
          loop: true
      },
      600:{
          items: 3,
          nav: false,
          loop: true
      },
      1000:{
          items: 5,
          nav: true,
          loop: true
      }
  },
  autoplay: false,
  autoplayTimeout: 3000,
  autoplayHoverPause: false,
  autoWidth: true,
  navigation: false
};

// Owl Events.
const events = {
  onDragged: function(event) {},
  onChanged: function(event) {}
}



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
    <OwlCarousel options={options} events={events} >
      <div className="item dAppCarouselItem"><img src="" alt=""/></div>
      <div className="item dAppCarouselItem"><img src="" alt=""/></div>
      <div className="item dAppCarouselItem"><img src="" alt=""/></div>
      <div className="item dAppCarouselItem"><img src="" alt=""/></div>
      <div className="item dAppCarouselItem"><img src="" alt=""/></div>
      <div className="item dAppCarouselItem"><img src="" alt=""/></div>
      <div className="item dAppCarouselItem"><img src="" alt=""/></div>
      <div className="item dAppCarouselItem"><img src="" alt=""/></div>
      <div className="item dAppCarouselItem"><img src="" alt=""/></div>
      <div className="item dAppCarouselItem"><img src="" alt=""/></div>
    </OwlCarousel>
  )
}

export default withStyles(styles)(HeroCarousel)
