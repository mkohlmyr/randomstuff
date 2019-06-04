import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setActiveView } from '../redux/actions/view';
import { setMoodValue } from '../redux/actions/form';
import { View } from '../redux/reducers/view';

const Mood = ({ onClickNext, onMoodChange, mood }) => {
  return (
    <div className={"mood_container"}>
      <div className={"mood__section"}>
        <input type={"range"} min={"1"} max={"7"} value={mood} className={"mood__slider"} onChange={onMoodChange} />
      </div>
      <div className={"mood__section"}>
        <a href={"#"} className={"mood__button"} onClick={onClickNext}>
          Next
        </a>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    mood: state.form.mood,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onMoodChange: bindActionCreators((evt) => setMoodValue(Number(evt.target.value)), dispatch),
    onClickNext: bindActionCreators(setActiveView.bind(null, View.Feeling), dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Mood);
