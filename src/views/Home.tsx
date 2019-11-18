import React from "react";
import { logout, refreshToken, toggleIsClickedAction } from "../store/actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { State as AppState } from "../store/types";
import SessionTimeout from "./SessionTimeout";

interface OwnProps {
  logout: () => ReturnType<typeof logout>;
}

type Props = OwnProps & StateProps & DispatchProps;

const Home: React.FC<Props> = ({
  logout,
  sessionExpiration,
  isClicked,
  toggleIsClickedAction
}) => {
  return (
    <React.Fragment>
      <h1>You made it!!!!!!</h1>
      <button onClick={logout}>Log out</button>
      <button onClick={toggleIsClickedAction}>
        {isClicked ? "Clicked" : "Unclicked"}
      </button>
      <SessionTimeout
        sessionExpiration={sessionExpiration}
        logout={logout}
        refreshToken={refreshToken}
      />
    </React.Fragment>
  );
};

const mapStateToProps = ({
  error,
  isFetching,
  sessionExpiration,
  isClicked
}: AppState): { [index: string]: any } => ({
  error,
  isFetching,
  sessionExpiration,
  isClicked
});

// typing with redux :)
const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      logout,
      refreshToken,
      toggleIsClickedAction
    },
    dispatch
  );

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

const connectedHome = connect<StateProps, DispatchProps, {}, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(Home);

export default connectedHome;
