import React from 'react';
import Table from './Table';
import Welcome from './Welcome';
import { Route, Switch } from 'react-router';
import ConnectedSample from './ConnectedSample';

const App = props => {
    return (
        <div className="App">
            <Switch>
                <Route
                    exact path="/"
                    render={() => <Welcome/>}
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
