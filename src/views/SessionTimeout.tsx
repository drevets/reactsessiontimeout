import * as React from "react";
import { ThunkAction } from "redux-thunk";
import { UserActionTypes, State as AppState} from "../store/types";
import { AxiosInstance } from "axios";
const warningPeriod = 120000

interface ISessionTimeoutProps {
  logout: () => ThunkAction<void, AppState, null, UserActionTypes>;
  sessionExpiration: number;
  refreshToken: () => ThunkAction<
    Promise<void>,
    AppState,
    AxiosInstance,
    UserActionTypes
  >;
}
const SessionTimeout: React.FunctionComponent<ISessionTimeoutProps> = ({
  logout,
  refreshToken,
  sessionExpiration
}) => {
  // lets us keep track of the JS window.setTimeout() id of the warning period so we can clear it if the user wants to continue their session
  const [
    endOfWarningPeriodTimeoutId,
    setEndOfWarningPeriodTimeoutId
  ] = React.useState(0);
  const [sessionAboutToTimeoutMessage, setSessionAboutToTimeoutMessage] = React.useState("")

  const sessionEndWarning = sessionExpiration - warningPeriod;

  const logMeOut = (): void => {
    logout();
    window.clearTimeout(endOfWarningPeriodTimeoutId);
  };

  const warnUserSessionAboutToTimeout = (): void => {
    setSessionAboutToTimeoutMessage("Your session is going to time out soon!")
    const endOfWarningPeriod = window.setTimeout(() => {
      logMeOut();
    }, warningPeriod);
    setEndOfWarningPeriodTimeoutId(endOfWarningPeriod);
  };

  //starts a timeout as soon as the page loads
  React.useEffect(() => {
    const warningPeriodId = window.setTimeout(() => {
      warnUserSessionAboutToTimeout();
    }, sessionEndWarning);
    return (): void => {
      // timeout will be reset with each render, so we don't set multiple timeouts
      window.clearTimeout(warningPeriodId);
    };
  });

  const keepWorking = (): void => {
    window.clearTimeout(endOfWarningPeriodTimeoutId);
    setSessionAboutToTimeoutMessage("")
    refreshToken();
  };

  return (
    <React.Fragment>
        <h3>Session timeout is watching you</h3>
  {!!sessionAboutToTimeoutMessage.length && <p>{sessionAboutToTimeoutMessage}</p>}
    </React.Fragment>
  );
};

export default SessionTimeout;
