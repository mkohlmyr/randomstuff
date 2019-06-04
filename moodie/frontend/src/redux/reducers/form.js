import { ActionType } from '../actions/form';

export const initialState = {
  mood: 4,
  feelings: [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ],
  comment: "",
};

export default (state = initialState, action) => {
  const feelings = [...state.feelings];
  const mood = state.mood;
  const comment = state.comment;

  switch (action.type) {
    case ActionType.SetMoodValue:
      return {
        mood: action.data,
        feelings,
        comment,
      };
    case ActionType.SetComment:
      return {
        mood,
        feelings,
        comment: action.data,
      };
    case ActionType.ToggleFeeling:
      feelings[action.data] = !feelings[action.data];
      return {
        mood,
        feelings,
        comment,
      };
    case ActionType.Reset:
      return initialState;
    default:
      return state;
  }
};
