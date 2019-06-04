import { ActionType } from '../actions/view';

export const View = {
  Mood: 'view/Mood',
  Feeling: 'view/Feeling',
  Comment: 'view/Comment',
  History: 'view/History',
};

export const initialState = {
  active: View.Mood,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ActionType.SetActiveView:
      return { active: action.data };
    default:
      return state;
  }
};
