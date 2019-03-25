// Template for a featured hero section of rotating dApps.

import React from 'react';
import config from '../../config.jsx'
import { withStyles } from '@material-ui/core/styles';
import OwlCarousel from 'react-owl-carousel2'
import '../../../node_modules/react-owl-carousel2/src/owl.carousel.css';
import '../../../node_modules/react-owl-carousel2/src/owl.theme.green.css';
import '../../../node_modules/react-owl-carousel2/src/owl.carousel.js';
import '../../components/Dashboard/Dashboard.css';

// Placeholder Images
import demoBG1 from './../../assets/img/angry_birds_logo.jpg'
import demoBG2 from './../../assets/img/paypal_logo.jpg'
import demoBG3 from './../../assets/img/cryptokitties_logo.jpg'
import demoBG4 from './../../assets/img/firefox_logo.png'
import demoBG5 from './../../assets/img/subway_surfers_logo.png'
import demoBG6 from './../../assets/img/uber_logo.jpg'
import demoBG7 from './../../assets/img/uno_logo.jpg'
import demoBG8 from './../../assets/img/temple_run_logo.png'

// Owl Carousel Config.
const options = {
  items: config.heroCarousel.maxItems,
  loop: true,
  margin: 20,
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
          items: 4,
          nav: true,
          loop: true,
      }
  },
  autoplay: true,
  autoplayTimeout: 3000,
  autoplayHoverPause: false,
  autoWidth: false,
  navigation: false
};

// Owl Events.
const events = {
  onDragged: function(event) {},
  onChanged: function(event) {}
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

var slideBG1 = {
  backgroundImage: "url(" + demoBG1 + ")",
};

var slideBG2 = {
  backgroundImage: "url(" + demoBG2 + ")"
};

var slideBG3 = {
  backgroundImage: "url(" + demoBG3 + ")"
};

var slideBG4 = {
  backgroundImage: "url(" + demoBG4 + ")"
};

var slideBG5 = {
  backgroundImage: "url(" + demoBG5 + ")"
};

var slideBG6 = {
  backgroundImage: "url(" + demoBG6 + ")"
};

var slideBG7 = {
  backgroundImage: "url(" + demoBG7 + ")"
};

var slideBG8 = {
  backgroundImage: "url(" + demoBG8 + ")"
};

function HeroCarousel({ classes }) {
  return (
    <OwlCarousel options={options} events={events} >
      <div className="item dAppCarouselItem" style={slideBG1}>
        <div className="itemContent slideWidth">
          <h4>Title</h4>
        </div>
      </div>
      <div className="item dAppCarouselItem" style={slideBG2}>
        <div className="itemContent slideWidth">
          <h4>Title</h4>
        </div>
      </div>
      <div className="item dAppCarouselItem" style={slideBG3}>
        <div className="itemContent slideWidth">
          <h4>Title</h4>
        </div>
      </div>
      <div className="item dAppCarouselItem" style={slideBG4}>
        <div className="itemContent slideWidth">
          <h4>Title</h4>
        </div>
      </div>
      <div className="item dAppCarouselItem" style={slideBG5}>
        <div className="itemContent slideWidth">
          <h4>Title</h4>
        </div>
      </div>
      <div className="item dAppCarouselItem" style={slideBG6}>
        <div className="itemContent slideWidth">
          <h4>Title</h4>
        </div>
      </div>
      <div className="item dAppCarouselItem" style={slideBG7}>
        <div className="itemContent slideWidth">
          <h4>Title</h4>
        </div>
      </div>
      <div className="item dAppCarouselItem" style={slideBG8}>
        <div className="itemContent slideWidth">
          <h4>Title</h4>
        </div>
      </div>
    </OwlCarousel>
  )
}

export default withStyles(styles)(HeroCarousel)
