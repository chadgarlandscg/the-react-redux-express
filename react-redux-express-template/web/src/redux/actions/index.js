import {
    SOME_ACTION, UPDATE_COUNTER_CHANGE_FIELD, UPDATE_COUNTER, GENERIC_ERROR,
    UPDATE_COUNTER_REJECTED, UPDATE_COUNTER_FULFILLED, GET_COUNTER_PENDING, GET_COUNTER_FULFILLED, GET_COUNTER_REJECTED,
    UPDATE_COUNTER_PENDING
} from './actionTypes'
import axios from 'axios'

export const someAction = (somePayload) => {
    return ({type: SOME_ACTION, payload: somePayload})
}

export const updateCounterChangeField = (newValue) => {
    return ({type: UPDATE_COUNTER_CHANGE_FIELD, payload: newValue})
}

export const updateCounterPending = () => {
    return ({type: UPDATE_COUNTER_PENDING})
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

export const getCounterPending = () => {
    return ({type: GET_COUNTER_PENDING})
}

export const getCounterFulfilled = (counter) => {
    return ({type: GET_COUNTER_FULFILLED, payload: {
        id: counter.id,
        value: counter.tableData
    }})
}

export const getCounterRejected = (error) => {
    return ({type: GET_COUNTER_REJECTED, payload: error})
}

export const getCounter = (id) => {
    return (dispatch) => {
        dispatch(getCounterPending())
        return axios.get('/storedCounter/' + id)
            .then(response => {
                dispatch(getCounterFulfilled(response.data))
            })
            .catch(error => {
                dispatch(getCounterRejected(error))
            });
    }
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