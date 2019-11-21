import * as React from "react";
import { ThunkAction } from "redux-thunk";
import { UserActionTypes, State as AppState } from "../store/types";
import { AxiosInstance } from "axios";
import { ActionCreator } from "redux";

// const warningPeriod = 120000;
const warningPeriod = 5000;

// All of these names suck and are confusing
// OK, so .... why was the session expiring three times?? Is it doing that in my main application?? that would suck
// Also, need to figure out some kind of testing something for this

interface ISessionTimeoutProps {
  logout: () => ThunkAction<void, AppState, null, UserActionTypes>;
  sessionExpiration: number;
  refreshToken: () => ThunkAction<
    Promise<void>,
    AppState,
    AxiosInstance,
    UserActionTypes
  >;
  sessionTimedOut: ActionCreator<UserActionTypes>;
}
const SessionTimeout: React.FunctionComponent<ISessionTimeoutProps> = ({
  logout,
  refreshToken,
  sessionExpiration,
  sessionTimedOut
}) => {
  // lets us keep track of the JS window.setTimeout() id of the warning period so we can clear it if the user wants to continue their session
  const [
    endOfWarningPeriodTimeoutId,
    setEndOfWarningPeriodTimeoutId
  ] = React.useState(); // also this is weird
  const [
    sessionAboutToTimeoutMessage,
    setSessionAboutToTimeoutMessage
  ] = React.useState("");
  const [sessionOver, setSessionOver] = React.useState(false);

  //   const sessionEndWarning = sessionExpiration - warningPeriod;
  const sessionEndWarning = 2000;

  const warnUserSessionAboutToTimeout = (): void => {
    setSessionAboutToTimeoutMessage("Your session is going to time out soon!");
    const endOfWarningPeriod = window.setTimeout(() => {
      sessionTimedOut();
      logMeOut();
    }, warningPeriod);
    setEndOfWarningPeriodTimeoutId(endOfWarningPeriod);
  };

  //starts a timeout as soon as the page loads

  React.useEffect(() => {
    const warningPeriodId = window.setTimeout(() => {
      //   if (!sessionOver) { // had to do this because it was somehow setting three of these ... possibly due to the state-setting things I'm doing below
      //     setSessionOver(true);
      //     warnUserSessionAboutToTimeout();
      //   }
      console.log("going to warn the user!")
      warnUserSessionAboutToTimeout();
    }, sessionEndWarning);
    return (): void => {
      // timeout will be reset with each render, so we don't set multiple timeouts ... except for we were doing that.
      window.clearTimeout(warningPeriodId);
    };
  }, []); // So I get an error for doing this, but it also works ..... 

  // this language could be more clear here
  const logMeOut = (): void => {
    logout();
    window.clearTimeout(endOfWarningPeriodTimeoutId);
  };
  const keepWorking = (): void => {
    window.clearTimeout(endOfWarningPeriodTimeoutId);
    setSessionAboutToTimeoutMessage("");
    refreshToken();
    setSessionOver(false);
  };

  return (
    <React.Fragment>
      <h3>Session timeout is watching you</h3>
      {!!sessionAboutToTimeoutMessage.length && (
        <React.Fragment>
          <p>{sessionAboutToTimeoutMessage}</p>
          <button onClick={keepWorking}>Keep Working</button>
          <button onClick={logMeOut}>Log out</button>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default SessionTimeout;
