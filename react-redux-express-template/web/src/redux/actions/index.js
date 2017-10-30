import {
    SOME_ACTION, UPDATE_COUNTER_CHANGE_FIELD, UPDATE_COUNTER, GENERIC_ERROR,
    UPDATE_COUNTER_REJECTED, UPDATE_COUNTER_FULFILLED, GET_COUNTER_PENDING, GET_COUNTER_FULFILLED, GET_COUNTER_REJECTED,
    UPDATE_COUNTER_PENDING, CREATE_COUNTER_FULFILLED, CREATE_COUNTER_PENDING, CREATE_COUNTER_REJECTED, LOGIN_FULFILLED, LOGIN_PENDING, LOGIN_REJECTED
} from './actionTypes'
import axios from 'axios'
import { push } from 'react-router-redux'

export const someAction = (somePayload) => {
    return ({type: SOME_ACTION, payload: somePayload})
}

export const updateCounterChangeField = (newValue) => {
    return ({type: UPDATE_COUNTER_CHANGE_FIELD, payload: newValue})
}

export const createCounterPending = () => {
    return ({type: CREATE_COUNTER_PENDING})
}

export const createCounterFulfilled = (newCounter) => {
    return ({type: CREATE_COUNTER_FULFILLED, payload: {
        id: newCounter.id,
        value: newCounter.tableData
    }})
}

export const createCounterRejected = (error) => {
    return ({type: CREATE_COUNTER_REJECTED, payload: error})
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

export const loginPending = () => {
    return ({type: LOGIN_PENDING})
}

export const loginFulfilled = user => {
    return ({type: LOGIN_FULFILLED, payload: user})
}

export const loginRejected = (error) => {
    return ({type: LOGIN_REJECTED, payload: error})
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

export const createCounter = userId => {
    return (dispatch) => {
        dispatch(createCounterPending())
        return axios.post('/storedCounter', {userId, init: 0})
            .then(response => {
                dispatch(createCounterFulfilled(response.data))
            })
            .catch(error => {
                dispatch(createCounterRejected(error))
            });
    }
}

export const login = token => {
    return (dispatch) => {
        dispatch(loginPending())
        return axios.post('/appUser/register', {token})
            .then(response => {
                const user = response.data
                dispatch(loginFulfilled(user))
                if (user.email) dispatch(createCounter(user.id)) //FIXME: could be done server-side?
                // FIXME: Change google CLIENT_ID !!!!!!
                // TODO: Update API to consume userId
                // TODO: Integrate with reducer to change state
                // TODO: Push user to /sample route (the web storedCounter page)
                // TODO: Kill/prevent multiple bundling processes
            })
            .catch(error => {
                dispatch(loginRejected(error))
            });
    }
}