import { combineReducers } from 'redux';
import view from './view';
import form from './form';
import history from './history';

export default combineReducers(
  {
    view,
    form,
    history,
  }
);
