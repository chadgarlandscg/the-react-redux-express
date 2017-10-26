import { applyMiddleware, createStore } from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import promise from 'redux-promise-middleware'
import history from './history'
import reducer from '../reducers/index'
import { routerMiddleware } from 'react-router-redux'

const routeMiddleware = routerMiddleware(history)
const middleware = applyMiddleware(routeMiddleware, promise(), thunk, logger)

export default createStore(reducer, middleware)