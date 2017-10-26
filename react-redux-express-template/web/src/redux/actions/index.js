import {SOME_ACTION} from './actionTypes'

export const someAction = (somePayload) => {
    return ({type: SOME_ACTION, payload: somePayload})
}