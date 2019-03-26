// Template for the global sidebar and its nav sections.

import React, { lazy } from 'react';
import { Link } from 'react-router-dom';
import * as IonIcons from 'react-icons/io'
import './Sidebar.css'
import config from '../../config.jsx'
import { GetUsersHydroBalanceFromWallet } from '../../common/account'

const DAppCategories = lazy(() => import('../Views/DAppCategories'))
const sidebarNavItems = config.dappCategories.categories;

export default (function Sidebar({ classes }) {
  return (
    <div className="sidebar">
      <div className="container">
        <div className="row">
          <div className="column">
          {/** Top Section Nav **/}
          <ul className="dappSidebarAuxNav">
            <Link to="/wallet"><li>dApp Store Wallet {GetUsersHydroBalanceFromWallet()}</li></Link>
            <Link to="/your-dapps"><li>Your Added dApps</li></Link>
            <Link to="/identity"><li>Manage Your Identity (EIN)</li></Link>
            <Link to="/submit"><li>Submit Your dApp</li></Link>
          </ul>
          <h2 className="text-grey">Categories</h2>
          {/** Bottom Section Nav: Links configured in config.js **/}
          <ul className="dappSidebarCategoryNav">
            {sidebarNavItems.map((category, i) => {
              const iconString = category.icon;
              const icon = React.createElement(IonIcons[iconString]);
              return <Link to={'/dapps/category/'+category.link} key={i} component={DAppCategories}><li data-category={category.name.replace(/\s+/g, '-').toLowerCase()} key={i}>{icon} {category.name}</li></Link>
            })}
          </ul>
          </div>
        </div>
      </div>
    </div>
  )
})
