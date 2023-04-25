export const ADD_ACCOUNT_DETAILS = 'ADD_ACCOUNT_DETAILS';
export const REMOVE_ACCOUNT_DETAILS = 'REMOVE_ACCOUNT_DETAILS';

export const addAccountDetailsAction = (data) => ({
    type: ADD_ACCOUNT_DETAILS,
    payload: data,
})

export const removeAccountDetailsAction = (index) => ({
    type: REMOVE_ACCOUNT_DETAILS,
    payload: index,
})