import React from 'react';
import ReactDOM from 'react-dom';
import App from './react/App';

import { Provider } from 'react-redux'
import store from './redux/store/store'
import history from './redux/store/history'
import registerServiceWorker from './registerServiceWorker'
import { ConnectedRouter } from 'react-router-redux'
import { Route } from 'react-router'
import 'date-input-polyfill'

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <Route path="/" component={App}/>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
)
registerServiceWorker()
