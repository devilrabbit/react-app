import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { PrivateRoute, GuestRoute } from './routes';
import Customers from './Customers';
import Users from './Users';

const Content: React.FC = () => {
  return (
    <Switch>
      <PrivateRoute path="/users" exact>
        <Users />
      </PrivateRoute>
      <PrivateRoute path="/customers" exact>
        <Customers />
      </PrivateRoute>
    </Switch>
  );
};

export default Content;
