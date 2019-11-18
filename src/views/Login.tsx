import React from "react";
import { RouteChildrenProps, Redirect } from "react-router";
import { State as AppState } from "../store/types";
import { bindActionCreators } from "redux";
import { login, loginSuccess } from "../store/actions";
import { connect } from "react-redux";
import Cookies from "js-cookie";

interface OwnProps {
  history: RouteChildrenProps["history"];
  match: RouteChildrenProps["match"];
  location: RouteChildrenProps["location"];
}

type Props = DispatchProps & OwnProps & StateProps;

const Login: React.FC<Props> = ({ login, location, sessionTimedOut }) => {
  const [redirect, setRedirect] = React.useState(false);
  const [loginFailed, setLoginFailed] = React.useState(false);

  const loginUser = async (event: React.MouseEvent) => {
    event.preventDefault();
    await login();
    const cookie = Cookies.get("session");
    if (cookie) {
      setRedirect(true);
    } else {
      setLoginFailed(true);
    }
  };

  const { from } = location.state || { from: { pathname: "/" } };
  if (redirect || Cookies.get("session")) {
    return <Redirect to={from} />;
  }

  return (
    <React.Fragment>
      {sessionTimedOut && "Your session timed out!"}
      <form>
        <button onClick={loginUser} type="button">
          Sign in
        </button>
      </form>
      {loginFailed && <div>Sorry, please try again</div>}
    </React.Fragment>
  );
};

const mapStateToProps = ({
  sessionTimedOut
}: AppState): { [index: string]: any } => ({
  sessionTimedOut
});

// typing with Redux ;)
const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      login,
      loginSuccess
    },
    dispatch
  );

type DispatchProps = ReturnType<typeof mapDispatchToProps>;

type StateProps = ReturnType<typeof mapStateToProps>;

const connectedLogin = connect<StateProps, DispatchProps, OwnProps, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(Login);

export default connectedLogin;
