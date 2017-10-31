import { appState } from '../store/templates/appState'

import {
    SOME_ACTION, UPDATE_COUNTER_CHANGE_FIELD, GENERIC_ERROR,
    UPDATE_COUNTER_REJECTED, UPDATE_COUNTER_FULFILLED, GET_COUNTER_PENDING, GET_COUNTER_FULFILLED, GET_COUNTER_REJECTED,
    UPDATE_COUNTER_PENDING, CREATE_COUNTER_FULFILLED, CREATE_COUNTER_PENDING, CREATE_COUNTER_REJECTED, LOGIN_FULFILLED, LOGIN_PENDING, LOGIN_REJECTED
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
        case LOGIN_PENDING:
        case CREATE_COUNTER_PENDING:
        case GET_COUNTER_PENDING:
        case UPDATE_COUNTER_PENDING: {
            return {
                ...state,
                awaitingResponse: true
            }
        }
        case GENERIC_ERROR:
        case LOGIN_REJECTED:
        case CREATE_COUNTER_REJECTED:
        case GET_COUNTER_REJECTED:
        case UPDATE_COUNTER_REJECTED: {
            return {
                ...state,
                error: action.payload,
                awaitingResponse: false
            }
        }
        case CREATE_COUNTER_FULFILLED:
        case GET_COUNTER_FULFILLED:
        case UPDATE_COUNTER_FULFILLED: {
            return {
                ...state,
                counter: action.payload,
                awaitingResponse: false
            }
        }
        case LOGIN_FULFILLED: {
            return {
                ...state,
                user: action.payload,
                counter: {
                    ...state.counter,
                    appUserId: action.payload.id
                },
                awaitingResponse: false
            }
        }
        default: {
            return state
        }
    }
}