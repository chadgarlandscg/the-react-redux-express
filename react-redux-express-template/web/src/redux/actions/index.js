import {
    SOME_ACTION, UPDATE_COUNTER_CHANGE_FIELD, UPDATE_COUNTER, GENERIC_ERROR,
    UPDATE_COUNTER_REJECTED, UPDATE_COUNTER_FULFILLED
} from './actionTypes'
import axios from 'axios'

export const someAction = (somePayload) => {
    return ({type: SOME_ACTION, payload: somePayload})
}

export const updateCounterChangeField = (newValue) => {
    return ({type: UPDATE_COUNTER_CHANGE_FIELD, payload: newValue})
}

export const updateCounterPending = () => {
    return ({type: UPDATE_COUNTER})
}

export const updateCounterFulfilled = (updatedCounter) => {
    return ({type: UPDATE_COUNTER_FULFILLED, payload: {
        id: updatedCounter.id,
        value: updatedCounter.tableData
    }})
}

export const updateCounterRejected = (error) => {
    return ({type: UPDATE_COUNTER_REJECTED, payload: error})
}

export const updateCounter = (val, id) => {
    return (dispatch) => {
        dispatch(updateCounterPending())
        return axios.put('/storedCounter/' + id, {val})
            .then(response => {
                dispatch(updateCounterFulfilled(response.data))
            })
            .catch(error => {
                dispatch(updateCounterRejected(error))
            });
    }
}