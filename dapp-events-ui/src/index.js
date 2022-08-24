/* eslint-disable react/jsx-filename-extension */
import 'antd/dist/antd.css';
import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
} from "react-router-dom";
import { Provider } from 'react-redux'
import App from './App';
import { store } from './store';

ReactDOM.render(
  <Router>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>,
  document.getElementById('root'),
);
