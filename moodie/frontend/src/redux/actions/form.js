export const ActionType = {
  SetMoodValue: 'form/SetMoodValue',
  ToggleFeeling: 'form/ToggleFeeling',
  SetComment: 'form/SetComment',
  Reset: 'form/Reset',
};

export function setMoodValue(value) {
  return (dispatch) => {
    dispatch({ type: ActionType.SetMoodValue, data: value });
  };
}

export function toggleFeeling(value) {
  return (dispatch) => {
    dispatch({ type: ActionType.ToggleFeeling, data: value });
  };
}

export function setComment(value) {
  return (dispatch) => {
    dispatch({ type: ActionType.SetComment, data: value });
  };
}

export function reset(value) {
  return (dispatch) => {
    dispatch({ type: ActionType.Reset });
  }
}
