import React, { Component } from 'react';
import NavBar from './NavBar.jsx';
import Routes from './Routes.jsx';

export default class Page extends Component {
  render() {
    return (
      <div>
        <NavBar />
        <Routes />
      </div>
    );
  }
}
