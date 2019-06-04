import React from "react";
import classNames from 'classnames';
import api from '../api';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleFeeling, setComment, reset } from '../redux/actions/form';
import { setActiveView } from '../redux/actions/view';
import { View } from '../redux/reducers/view';
import { feelingOptions } from '../common';

const Rectangle = ({ label, onClick, active }) => {
  const classes = classNames(
    "feeling__rect",
    {
      "feeling__rect--active": active,
    }
  );
  return <a href={"#"} onClick={onClick} className={classes}>{label}</a>;
};

const Feeling = ({ feelings, onClickFeeling, onChangeComment, comment, mood, reset, onSubmit }) => {
  const options = feelingOptions.map(({ label, value }) => {
    return (
      <Rectangle
        key={`feeling-${value}`}
        label={label}
        active={feelings[value]}
        onClick={
          (evt) => {
            evt.preventDefault();
            onClickFeeling(value);
          }
        }
      />
    );
  });
  return (
    <div className={"mood_container"}>
      <div className={"feeling__grid"}>
        {options}
      </div>
      <div className={"feeling__section"}>
        <textarea value={comment} onChange={onChangeComment}></textarea>
      </div>
      <div className={"feeling__section"}>
        <a href={"#"} className={"feeling__button"} onClick={async (evt) => {
          evt.preventDefault();
          const active = feelings.reduce((acc, cur, idx) => {
            if (cur) acc.push(idx);
            return acc;
          }, [])
          await api.postRecord(mood, active, comment);
          // TODO: combine entire function into a single action.
          reset();
          onSubmit();
        }}>
          Finish
        </a>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    mood: state.form.mood,
    feelings: state.form.feelings,
    comment: state.form.comment,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSubmit: bindActionCreators(setActiveView.bind(null, View.History), dispatch),
    onClickFeeling: bindActionCreators(toggleFeeling, dispatch),
    onChangeComment: bindActionCreators((evt) => setComment(evt.target.value), dispatch),
    reset: bindActionCreators(reset, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Feeling);
