import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import appState from './appReducer'

export default combineReducers({
    router: routerReducer,
    appState
})