import React from "react";
import "./App.css";
import Home from "./views/Home";
import Login from "./views/Login"
import Cookies from "js-cookie";
import { Route, Redirect, Switch } from "react-router-dom";

const sessionCookieName = "session";

interface IPrivateRoute {
  exact?: boolean;
  path: string;
  component: any; // don't do this, this is bad. Also, if you know how to type this, please let me know
}

const PrivateRoute: React.FunctionComponent<IPrivateRoute> = ({
  component: Component,
  ...rest
}) => {
  const cookie = Cookies.get(sessionCookieName);
  return (
    <Route
      {...rest}
      render={(props): React.ReactElement => {
        return cookie ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        );
      }}
    />
  );
};

const App: React.FC = () => {
  return (
    <div className="App">
      <Switch>
        <PrivateRoute exact path="/" component={Home} />
        <Route
          exact
          path="/login"
          render={(props): React.ReactElement => <Login {...props} />}
        />
      </Switch>
    </div>
  );
};

export default App;
