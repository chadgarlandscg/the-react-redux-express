import { appState } from '../store/templates/appState'

import {
    GENERIC_ERROR,
    SOME_ACTION, UPDATE_COUNTER, UPDATE_COUNTER_CHANGE_FIELD, UPDATE_COUNTER_FULFILLED, UPDATE_COUNTER_REJECTED
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
        case UPDATE_COUNTER: {
            return {
                ...state,
                awaitingResponse: true
            }
        }
        case UPDATE_COUNTER_REJECTED: {
            return {
                ...state,
                error: action.payload,
                awaitingResponse: false
            }
        }
        case UPDATE_COUNTER_FULFILLED: {
            return {
                ...state,
                counter: action.payload,
                awaitingResponse: false
            }
        }
        case GENERIC_ERROR: {
            return {
                ...state,
                error: action.payload
            }
        }
        default: {
            return state
        }
    }
}