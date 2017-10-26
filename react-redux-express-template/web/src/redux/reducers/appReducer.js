import { appState } from '../store/templates/appState'

import {
    SOME_ACTION
} from '../actions/actionTypes'

export default (state = appState, action) => {
    switch (action.type) {
        case SOME_ACTION: {
            return {
                ...state,

            }
        }
        default: {
            return state
        }
    }
}