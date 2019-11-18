import { UserActionTypes, ActionTypes, NetworkCallStatus, State } from "./types";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { AxiosInstance } from "axios";
import { AnyAction } from "redux";
import { decode } from "jsonwebtoken";
import Cookies from "js-cookie";
import history from "../history";

export const logoutRequest = (): UserActionTypes => ({
    type: ActionTypes.LOGOUT
  });
  
  export const loginRequest = (): UserActionTypes => ({
    type: ActionTypes.LOGIN_REQUEST
  });
  
  export const loginSuccess = (): UserActionTypes => ({
    type: ActionTypes.LOGIN_SUCCESS,
    status: NetworkCallStatus.SUCCESS
  });
  
  export const loginFail = (error: string): UserActionTypes => ({
    type: ActionTypes.LOGIN_FAIL,
    status: NetworkCallStatus.ERROR,
    error
  });
  
  export const refreshRequest = (): UserActionTypes => ({
    type: ActionTypes.REFRESH_REQUEST
  });
  
  export const refreshSuccess = (): UserActionTypes => ({
    type: ActionTypes.REFRESH_SUCCESS,
    status: NetworkCallStatus.SUCCESS
  });
  
  export const refreshFail = (error: string): UserActionTypes => ({
    type: ActionTypes.REFRESH_FAIL,
    status: NetworkCallStatus.ERROR,
    error
  });
  
  export const updateSessionExpirationTime = (
    sessionExpiration: number
  ): UserActionTypes => ({
    type: ActionTypes.UPDATE_SESSION_EXPIRATION,
    sessionExpiration
  });

  export const toggleIsClickedAction = (): UserActionTypes => ({
      type: ActionTypes.TOGGLE_IS_CLICKED
  })
  
  export const login = (): ThunkAction<
    Promise<void>,
    State,
    AxiosInstance,
    UserActionTypes
  > => async (
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
    getState,
    api: AxiosInstance
  ): Promise<void> => {
    dispatch(loginRequest());
  
    try {
      let token;
      let sessionExpiration;
      const { data } = await api.post("/login");
      if (data && data.token) {
        token = data.token;
        const decoded = decode(data.token) as { [index: string]: any }; // types and jwt are weird
        if (decoded && decoded["exp"]) {
          sessionExpiration = decoded["exp"] * 1000 - Date.now();
        }
        if (sessionExpiration) {
          Cookies.set("session", token, {
            // set session cookie as a constant
            expires: sessionExpiration / 1000 / 60 / 1440
          }); // will want to double check math on this ... needs to be in fractions of a day
          dispatch(updateSessionExpirationTime(sessionExpiration)); // what if I could test this???? should I be doing TDD
        } else {
          throw new Error("Session expiration is null");
        }
      }
      dispatch(loginSuccess());
    } catch (error) {
      dispatch(loginFail(error.message));
    }
  };
  
  export const logout = (): ThunkAction<void, State, null, AnyAction> => (
    dispatch: ThunkDispatch<{}, {}, AnyAction>
  ): void => {
    dispatch(logoutRequest());
    Cookies.remove("session");
    history.push("/login");
  };
  
  export const refreshToken = (): ThunkAction<
    Promise<void>,
    State,
    AxiosInstance,
    AnyAction
  > => async (
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
    getState,
    api: AxiosInstance
  ): Promise<void> => {
    dispatch(refreshRequest());
    try {
      let token;
      let sessionExpiration;
      const { data } = await api.post("refresh"); // consider using constants for this as well ... should I do the cookie thing here? And maybe extract the session expiration stuff into another function
      if (data && data.token) {
        token = data.token;
        const decoded = decode(data.token) as { [index: string]: any }; // types and jwt are weird
        if (decoded && decoded["exp"]) {
          sessionExpiration = decoded["exp"] * 1000 - Date.now();
        }
        if (sessionExpiration) {
          Cookies.set("session", token, {
            expires: sessionExpiration / 1000 / 60 / 1440
          });
          dispatch(refreshSuccess());
          dispatch(updateSessionExpirationTime(sessionExpiration)); // what if I could test this???? should I be doing TDD
        } else {
          throw new Error("Token refresh failed");
        }
      }
    } catch (error) {
      dispatch(refreshFail(error.message));
      if (error.response && error.response.status === 401) {
        //@ts-ignore TODO fix this later 
        dispatch(logout());
      }
    }
  };