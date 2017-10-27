import { appState } from '../store/templates/appState'

import {
    GENERIC_ERROR, GET_COUNTER_FULFILLED, GET_COUNTER_PENDING, GET_COUNTER_REJECTED,
    SOME_ACTION, UPDATE_COUNTER, UPDATE_COUNTER_CHANGE_FIELD, UPDATE_COUNTER_FULFILLED, UPDATE_COUNTER_PENDING,
    UPDATE_COUNTER_REJECTED
} from '../actions/actionTypes'

export default (state = appState, action) => {
    switch (action.type) {
        case SOME_ACTION: {
            return {
                ...state,
                sample: action.payload
            }
        }
        case UPDATE_COUNTER_CHANGE_FIELD: {
            return {
                ...state,
                counterChangeField: action.payload
            }
        }
        case GET_COUNTER_PENDING:
        case UPDATE_COUNTER_PENDING: {
            return {
                ...state,
                awaitingResponse: true
            }
        }
        case GENERIC_ERROR:
        case GET_COUNTER_REJECTED:
        case UPDATE_COUNTER_REJECTED: {
            return {
                ...state,
                error: action.payload,
                awaitingResponse: false
            }
        }
        case GET_COUNTER_FULFILLED:
        case UPDATE_COUNTER_FULFILLED: {
            return {
                ...state,
                counter: action.payload,
                awaitingResponse: false
            }
        }
        default: {
            return state
        }
    }
}