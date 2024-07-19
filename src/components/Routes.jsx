import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import EmployeeDirectory from './EmployeeDirectory.jsx';
import EmployeeCreate from './EmployeeCreate.jsx';
import EmployeeView from './EmployeeView.jsx';
import NotFound from './NotFound.jsx';

class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Redirect exact from='/' to='/employees' />
        <Route exact path='/employees' component={EmployeeDirectory} />
        <Route path='/employees/create' component={EmployeeCreate} />
        <Route path='/employees/:emp_id' component={EmployeeView} />
        <Route component={NotFound} />
      </Switch>
    );
  }
}

export default Routes;
