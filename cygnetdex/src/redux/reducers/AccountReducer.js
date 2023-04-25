import { ADD_ACCOUNT_DETAILS, REMOVE_ACCOUNT_DETAILS } from '../actions/AccountAction'
import { initialState } from '../store'

export default function accountReducer(state = initialState.accountDetails, action) {
    console.log(action, state);

    const { type, payload } = action;

    switch (type) {
        case ADD_ACCOUNT_DETAILS: 
            return { 
                ...state,
                accountDetails: [ payload ],
            }
        case REMOVE_ACCOUNT_DETAILS:
            return {
                ...state,
                user: state.accountDetails.filter((accountDetails) => accountDetails[0] !== payload),
            };
        default: 
            return state;
    }
}