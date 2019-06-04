import React from 'react';
import store from '../redux/store';
import Router from './Router';
import { Provider } from 'react-redux';

export default () => {
  return (
    <Provider store={store}>
      <Router />
    </Provider>
  );
};

