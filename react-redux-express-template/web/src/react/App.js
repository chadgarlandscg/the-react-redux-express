import React from 'react';
import Table from './Table';
import Welcome from './Welcome';
import { Route, Switch } from 'react-router';
import ConnectedSample from './ConnectedSample';
import ConnectedLogin from './ConnectedLogin';

const App = props => {
    return (
        <div className="App">
            <Switch>
                <Route
                    exact path="/"
                    render={() => <Welcome/>}
                />
                <Route
                    exact path="/login"
                    render={() => <ConnectedLogin/>}
                />
                <Route
                    path="/sample"
                    render={() => <ConnectedSample/>}
                />
                <Route
                    path="/table"
                    render={() => <Table/>}
                />
            </Switch>
        </div>
    );
}

export default App;
