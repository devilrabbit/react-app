import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { RootStateOrAny, useSelector } from 'react-redux';

const PrivateRoute: React.FC<RouteProps> = (props: RouteProps) => {
  //const authenticated = useSelector((state: RootStateOrAny) => !!state.auth.authenticatedUser)
  //return authenticated ? <Route {...props} /> : <Redirect to={{ pathname: '/sign' }} />
  return <Route {...props} />;
};

export default PrivateRoute;
