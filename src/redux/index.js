import { applyMiddleware, combineReducers, createStore, } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

const initialState = {
    showTaskControlModalWindow: false,
    response: [],
    idCounter: 0
}

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_TASK_CONTROL_MODAL_WINDOW":
            return {
                ...state, showTaskControlModalWindow: action.payload
            }
        case "SET_RESPONSE":
            return {
                ...state, response: action.payload
            }
        case "SET_ID_COUNTER":
            return {
                ...state, idCounter: action.payload
            }
        default: return state
    }

}


export const store = createStore(reducer, composeWithDevTools())

