import { createStore, Action, Reducer, applyMiddleware } from "redux";
import thunk, { ThunkMiddleware } from "redux-thunk";
import logger from "redux-logger";
import axios from "axios";
import {
  State,
  ActionTypes,
  NetworkCallStatus,
  UserActionTypes
} from "./types";
import debounce from "lodash.debounce";
import { refreshToken } from "./actions";

export const initialState: State = {
  error: "",
  status: NetworkCallStatus.UNDEFINED,
  isFetching: false,
  sessionExpiration: 1800000, // need to do something about this default time ... maybe use the .env thingy
  isClicked: false,
  sessionTimedOut: false,
  user: false
};

type InitialState = State | undefined;

const axiosInstance = axios.create();

let middleware = [
  thunk.withExtraArgument(axiosInstance) as ThunkMiddleware<State, Action<any>>,
  logger
];

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
        error: "",
        sessionTimedOut: false, // weird
        user: true
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
    case ActionTypes.TOGGLE_IS_CLICKED:
      return {
        ...state,
        isClicked: !state.isClicked
      };
    case ActionTypes.SESSION_TIMED_OUT:
      debouncedRefreshToken.cancel();
      return {
        ...state,
        sessionTimedOut: true,
        user: false // duplicte??
      };
    case ActionTypes.LOGOUT:
      debouncedRefreshToken.cancel();
      return {
        ...initialState,
        sessionTimedOut: state.sessionTimedOut, // weird
        user: false
      };
    default:
      return { ...state };
  }
};

export const store = createStore(rootReducer, applyMiddleware(...middleware));

const debouncedRefreshToken = debounce(
  () => {
    if (store.getState().user) {
      //@ts-ignore TODO figure out why this isn't working
      store.dispatch(refreshToken()); // also ... is this working like I want it to? that, I do not know 
    }
  },
  10000,
  { leading: true, trailing: false, maxWait: 10000 }
);

store.subscribe(debouncedRefreshToken);
