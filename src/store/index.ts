import { createStore, Action, Reducer, applyMiddleware } from "redux";
import thunk, { ThunkMiddleware } from "redux-thunk";
import axios from "axios";
import { State, ActionTypes, NetworkCallStatus, UserActionTypes } from "./types";

export const initialState: State = {
  error: "",
  status: NetworkCallStatus.UNDEFINED,
  isFetching: false,
  sessionExpiration: 1800000
};

type InitialState = State | undefined;

const axiosInstance = axios.create();

let middleware = [
  thunk.withExtraArgument(axiosInstance) as ThunkMiddleware<State, Action<any>>
];

// also need to implement logout 
const rootReducer: Reducer<InitialState, UserActionTypes> = (
  state = initialState,
  action: UserActionTypes
): State => {
  switch (action.type) {
    case ActionTypes.LOGIN_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case ActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        isFetching: false,
        status: action.status,
        error: ""
      };
    case ActionTypes.LOGIN_FAIL:
      return {
        ...state,
        isFetching: false,
        error: action.error,
        status: action.status
      };
    case ActionTypes.UPDATE_SESSION_EXPIRATION:
      return {
        ...state,
        sessionExpiration: action.sessionExpiration
      };
    default:
      return { ...state };
  }
};

export const store = createStore(rootReducer, applyMiddleware(...middleware));
