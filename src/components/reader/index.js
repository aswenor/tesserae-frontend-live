import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import RedirectOverlay from '../common/RedirectOverlay';
import Reader from './Reader';


function ReaderRouter(props) {
  const match = useRouteMatch();

  return (
      <Switch>
        <Route path={`${match.path}/:textID`}>
          <Reader />
        </Route>
        <Route path={match.path}>
          <RedirectOverlay
            delay={3}
            displayText="Redirecting to corpus viewer in 3 seconds."
            to="/corpus"
          />
        </Route>
      </Switch>
  );
}


export default ReaderRouter;