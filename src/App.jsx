import ReactDOM from 'react-dom';
import React from 'react';
import 'babel-polyfill';
import 'whatwg-fetch';

import Page from './components/Page.jsx';
import { BrowserRouter as Router } from 'react-router-dom';

const element = (
  <Router>
    <Page />
  </Router>
);

ReactDOM.render(element, document.getElementById('contents'));
