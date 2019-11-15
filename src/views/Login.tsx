import React from "react";
import { RouteChildrenProps } from "react-router";

interface LoginProps {
  history: RouteChildrenProps["history"];
  match: RouteChildrenProps["match"];
  location: RouteChildrenProps["location"];
}

const Login: React.FC<LoginProps> = () => {
  // note: change these to things that are more fun!

  const signMeIn = (event: React.MouseEvent) => {
    event.preventDefault();
    console.log('event', event)
  };

  return (
    <form>
      <label htmlFor="email">Email</label>
      <input name="email" id="email" />
      <label htmlFor="password">Password</label>
      <input name="password" id="password" type="password" />
      <button onClick={signMeIn} type="submit">Sign in</button>
    </form>
  );
};

export default Login;
