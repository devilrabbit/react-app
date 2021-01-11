import React from 'react';
import { Route, RouteProps } from 'react-router-dom';

const GuestRoute: React.FC<RouteProps> = (props: RouteProps) => {
  return <Route {...props} />;
};

export default GuestRoute;
