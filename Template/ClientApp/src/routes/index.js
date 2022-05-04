import { Switch } from 'react-router-dom';

import Route from './Route';
import { Route as ReactDOMRoute } from 'react-router-dom';

import SignIn from '../pages/SignIn';
import Dashboard from '../pages/Dashboard';
import Repository from '../pages/Repository';
import DatabaseRepository from '../pages/DatabaseRepository';

const Routes = () => {
    return (
        <Switch>
            <Route path="/" exact component={Dashboard} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/signin" component={SignIn} />
            <Route path="/repositories/:repository+" component={Repository} />

            <Route path="/databaserepositories" component={DatabaseRepository} isPrivate />
        </Switch>
    );
}

export default Routes;