import React, {Component} from 'react';
import Table from './Table';

class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src='logo.svg' className="App-logo" alt="logo"/>
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <p className="App-intro">
                    To get started, edit <code>src/App.js</code> and save to reload.
                </p>
                <h2>
                    Test with Brandy!
                </h2>
                <Table/>
            </div>
        );
    }
}

export default App;
