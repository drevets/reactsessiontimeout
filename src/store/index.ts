import { createStore, Action, Reducer } from "redux";

interface AppState {}

type initialState = AppState | undefined

const rootReducer: Reducer<initialState, Action<any>> = (state: initialState, action: Action) => {
    // TODO fill this in
  return state
};

export const store = createStore(rootReducer);
