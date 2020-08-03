// Libraries
import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';

// Project files
import ProductAddPage from './product-add/product-add.page';
import NotFoundPage from './not-found/not-found.page';
import PrivateRoute from './private-route.component';

const Routing: React.FC = () => {
  const history = createBrowserHistory();
  return (
    <Router history={history}>
      <Switch>
        <PrivateRoute exact path="/admin/product/add" component={ProductAddPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </Router>
  );
};

export default Routing;