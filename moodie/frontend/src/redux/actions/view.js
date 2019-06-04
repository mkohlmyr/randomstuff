export const ActionType = {
  SetActiveView: 'view/SetActiveView'
};

export function setActiveView(view) {
  return (dispatch) => {
    dispatch({ type: ActionType.SetActiveView, data: view })
  };
}
