export enum ActionTypes {
  LOGIN_REQUEST = "LOGIN_REQUEST",
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  LOGIN_FAIL = "LOGIN_FAIL",
  LOGOUT = "LOGOUT",
  REFRESH_REQUEST = "REFRESH_REQUEST",
  REFRESH_SUCCESS = "REFRESH_SUCCESS",
  REFRESH_FAIL = "REFRESH_FAIL",
  UPDATE_SESSION_EXPIRATION = "UPDATE_SESSION_EXPIRATION",
  TOGGLE_IS_CLICKED = "TOGGLE_IS_CLICKED"
}

export enum NetworkCallStatus {
  SUCCESS = "success",
  ERROR = "error",
  UNDEFINED = ""
}

export interface LogoutAction {
  type: ActionTypes.LOGOUT;
}

export interface LoginRequestAction {
  type: ActionTypes.LOGIN_REQUEST;
}

export interface LoginSuccessAction {
  type: ActionTypes.LOGIN_SUCCESS;
  status: NetworkCallStatus.SUCCESS;
}

export interface LoginFailAction {
  type: ActionTypes.LOGIN_FAIL;
  error: string;
  status: NetworkCallStatus.ERROR;
}

export interface RefreshRequestAction {
  type: ActionTypes.REFRESH_REQUEST;
}

export interface RefreshSuccessAction {
  type: ActionTypes.REFRESH_SUCCESS;
}

export interface RefreshFailAction {
  type: ActionTypes.REFRESH_FAIL;
  error: string;
  status: NetworkCallStatus.ERROR;
}

export interface UpdateSessionExpirationTime {
  type: ActionTypes.UPDATE_SESSION_EXPIRATION;
  sessionExpiration: number;
}

export interface ToggleIsClicked {
  type: ActionTypes.TOGGLE_IS_CLICKED;
}

export interface State {
  status: NetworkCallStatus;
  error: string;
  isFetching: boolean;
  sessionExpiration: number;
  isClicked: boolean;
}

export type UserActionTypes =
  | LoginRequestAction
  | LoginSuccessAction
  | LoginFailAction
  | LogoutAction
  | RefreshRequestAction
  | RefreshSuccessAction
  | RefreshFailAction
  | UpdateSessionExpirationTime
  | ToggleIsClicked;
