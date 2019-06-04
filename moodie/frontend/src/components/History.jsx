import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getHistory } from '../redux/actions/history';
import { feelingOptions } from '../common';
class HistoryContainer extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    this.props.getHistory();
  }

  render() {
    return (
      <History records={this.props.records} />
    );
  }
}

const Item = ({ date, feelings }) => {
  const badges = feelings.map(f => <span key={`feeling-${f}-${date}`} className={"history__badge"}>{feelingOptions[f].label}</span>);
  return (
    <div className={"history__rect"}>
      <span>{date}</span>
      {badges}
    </div>
  );
};

const History = ({ records }) => {
  const items = records.map(({ date, feelings }) => <Item key={`item-${date}`} date={date} feelings={feelings} />);
  return (
    <div className={"history__grid"}>
      {items}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    records: state.history.records,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    getHistory: bindActionCreators(getHistory, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HistoryContainer);
