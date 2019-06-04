import React from 'react';
import Feeling from './Feeling';
import History from './History';
import Mood from './Mood';
import { View } from '../redux/reducers/view';
import { connect } from 'react-redux';

const Router = ({ view }) => {
  switch (view.active) {
    case View.Mood:
      return <Mood />;
    case View.Feeling:
      return <Feeling />;
    case View.History:
      return <History />;
  }
};

const mapStateToProps = (state) => {
  return {
    view: state.view,
  };
};

export default connect(mapStateToProps)(Router);
