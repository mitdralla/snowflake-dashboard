// FAQ page

import React, { Component } from 'react'

import config from '../../config.jsx'
const faqItems = config.faqs.items;

class Faq extends Component {

  render() {
    return (
      <div>
        <h2>FAQ</h2>
        {faqItems.map((item, i) => {
          return <div className="faqItemWrapper"><h4>{item.question}</h4><p>{item.answer}</p></div>
        })}
      </div>
    )
  }
}

export default Faq
