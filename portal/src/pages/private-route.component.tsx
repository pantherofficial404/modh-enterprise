// Libraries
import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';

// Project files
import { AuthService } from 'services';

const PrivateRoute: React.FC<any> = ({ component: Component, ...rest }) => {
  const render = (props: any) => {
    if (!AuthService.isAuthenticated()) {
      let redirectUrl = '/login';
      if (props.location.pathname !== '/' || props.location.search !== '') {
        redirectUrl += '?redirect=' +
          encodeURIComponent(props.location.pathname + props.location.search);
      }
      return <Redirect to={redirectUrl} />;
    }
    return <Component  {...props} />;
  };

  return (
    <Route {...rest} render={render} />
  );
};

export default PrivateRoute;