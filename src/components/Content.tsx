import React from 'react';
import { Switch } from 'react-router-dom';
import { PrivateRoute } from './routes';
import Shops from './Shops';
import Users from './Users';
import Job from './Job';

const Content: React.FC = () => {
  return (
    <Switch>
      <PrivateRoute path="/users" exact>
        <Users />
      </PrivateRoute>
      <PrivateRoute path="/shops" exact>
        <Shops />
      </PrivateRoute>
      <PrivateRoute path="/jobs/:id" component={Job} />
    </Switch>
  );
};

export default Content;
