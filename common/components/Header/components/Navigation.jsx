// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import translate from 'translations';

import './Navigation.scss';

const tabs = [
  {
    name: 'NAV_GenerateWallet',
    link: '/'
  },
  {
    name: 'NAV_SendEther',
    link: 'send-transaction'
  },
  {
    name: 'NAV_Swap',
    link: 'swap'
  },
  {
    name: 'NAV_Offline'
  },
  {
    name: 'NAV_Contracts',
    link: 'contracts'
  },
  {
    name: 'NAV_ViewWallet',
    link: 'view-wallet'
  },
  {
    name: 'NAV_Help',
    link: 'help'
  }
];

type Props = {
  location: mixed
};

export default class TabsOptions extends Component {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      showLeftArrow: false,
      showRightArrow: false
    };
  }

  tabClick() {}

  scrollLeft() {}

  scrollRight() {}

  render() {
    const { location } = this.props;
    return (
      <nav
        role="navigation"
        aria-label="main navigation"
        className="Navigation container overflowing"
      >
        {this.state.showLeftArrow &&
          <a
            aria-hidden="true"
            className="Navigation-arrow Navigation-arrow--left"
            onClick={() => this.scrollLeft(100)}
          >
            &#171;
          </a>}
        <div className="Navigation-scroll">
          <ul className="Navigation-links">
            {tabs.map((object, i) => {
              // if the window pathname is the same or similar to the tab objects name, set the active toggle
              const activeOrNot =
                location.pathname === object.link ||
                location.pathname.substring(1) === object.link
                  ? 'is-active'
                  : '';
              return (
                <li
                  className={'Navigation-links-item'}
                  key={i}
                  onClick={this.tabClick(i)}
                >
                  <Link
                    className={`Navigation-links-item-link ${activeOrNot}`}
                    to={object.link}
                    aria-label={`nav item: ${translate(object.name)}`}
                  >
                    {translate(object.name)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        {this.state.showRightArrow &&
          <a
            aria-hidden="true"
            className="Navigation-arrow Navigation-arrow-right"
            onClick={() => this.scrollRight(100)}
          >
            &#187;
          </a>}
      </nav>
    );
  }
}
