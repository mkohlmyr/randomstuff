import { ActionType } from '../actions/history';
export const initialState = {
  records: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ActionType.GetHistoryRequest:
      return {
        records: action.data,
      }
    default:
      return state;
  }
};
