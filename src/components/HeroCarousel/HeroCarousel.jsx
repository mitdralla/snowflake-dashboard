// Template for a featured hero section of rotating dApps.

import React from 'react';
import './HeroCarousel.css'
import config from '../../config.jsx'

import OwlCarousel from 'react-owl-carousel2'
import '../../../node_modules/react-owl-carousel2/src/owl.carousel.css';
import '../../../node_modules/react-owl-carousel2/src/owl.carousel.js';

// Placeholder Images
import demoBG1 from './../../assets/img/angry_birds_logo.jpg'
import demoBG2 from './../../assets/img/paypal_logo.jpg'
import demoBG3 from './../../assets/img/cryptokitties_logo.jpg'
import demoBG4 from './../../assets/img/firefox_logo.png'
import demoBG5 from './../../assets/img/subway_surfers_logo.png'
import demoBG6 from './../../assets/img/uber_logo.jpg'
import demoBG7 from './../../assets/img/uno_logo.jpg'
import demoBG8 from './../../assets/img/temple_run_logo.png'

// Shorter path to hero config
const heroConfig = config.homepage.heroCarousel

// Owl Carousel Config.
const options = {
  items: heroConfig.desktopItemsInView,
  loop: heroConfig.infiniteItemLoop,
  margin: heroConfig.spaceBetweenItems,
  responsiveClass: heroConfig.responsive,
  responsive:{
      0:{
          items: heroConfig.mobileItemsInView,
          autoplay: heroConfig.autoplayMobile,
      },
      600:{
          items: heroConfig.tabletItemsInView,
          autoplay: heroConfig.autoplayTablet,
      },
      1000:{
          items: heroConfig.desktopItemsInView,
          autoplay: heroConfig.autoplayDesktop,
      }
  },
  autoplay: heroConfig.autoplay,
  autoplayTimeout: heroConfig.rotationSpeed,
  autoplayHoverPause: heroConfig.pauseOnHover,
  autoWidth: heroConfig.autoWidth,
  navigation: heroConfig.navigation
};

// Owl Events.
const events = {
  onDragged: function(event) {},
  onChanged: function(event) {}
};

const defaultConfig = {
  placeholderDapps: {
    items: [
      {
        id:              1,
        title:           "Angry Birds Party",
        category:        "Gaming",
        backgroundImage: "url(" + demoBG1 + ")",
        featured:        true,
      },
      {
        id:              2,
        title:            "Paypal Move",
        category:        "Fintech",
        backgroundImage: "url(" + demoBG2 + ")",
        featured:        true,
      },
      {
        id:              3,
        title:           "CryptoKitties 2",
        category:        "Gaming",
        backgroundImage: "url(" + demoBG3 + ")",
        featured:        true,
      },
      {
        id:              4,
        title:           "Firefox",
        category:        "Gaming",
        backgroundImage: "url(" + demoBG4 + ")",
        featured:        true,
      },
      {
        id:              5,
        title:           "Subway Surfers 2",
        category:        "Gaming",
        backgroundImage: "url(" + demoBG5 + ")",
        featured:        true,
      },
      {
        id:              6,
        title:           "Jungle Party",
        category:        "Gaming",
        backgroundImage: "url(" + demoBG6 + ")",
        featured:        true,
      },
      {
        id:              7,
        title:           "Jungle Party",
        category:        "Gaming",
        backgroundImage: "url(" + demoBG7 + ")",
        featured:        true,
      },
      {
        id:              8,
        title:           "Angry Birds Party",
        category:        "Gaming",
        backgroundImage: "url(" + demoBG8 + ")",
        featured:        true,
      }
    ]
  }
}

const placeholderDAppItems = defaultConfig.placeholderDapps.items

export default (function HeroCarousel({ classes }) {
  return (
    <OwlCarousel options={options} events={events} >
      {placeholderDAppItems.map((item, i) => {
        return (
          <div className="item dAppCarouselItem" style={item.backgroundImage}>
            <div className="itemContent slideWidth">
              <h4>{item.title}</h4>
              <h5>{item.category}</h5>
            </div>
          </div>
        )
      })}
    </OwlCarousel>
  )
})
