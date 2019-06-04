import api from '../../api';

export const ActionType = {
  GetHistoryRequest: 'history/GetHistoryRequest',
};

// TODO: store state of request etc
export function getHistory() {
  return async (dispatch) => {
    const results = await api.getRecords();
    const records = await results.json();
    dispatch({ type: ActionType.GetHistoryRequest, data: records })
  };
}
