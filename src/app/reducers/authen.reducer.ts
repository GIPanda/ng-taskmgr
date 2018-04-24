import * as authenAction from '../actions/authen.action';
import { Authen } from '../domain/authen.model';

export const initialState: Authen = {};

export function reducer(state = initialState, action: authenAction.Actions ): Authen {
    switch (action.type) {
        case authenAction.ActionTypes.REGISTER_SUCCESS:
        case authenAction.ActionTypes.LOGIN_SUCCESS: {
            return {...<Authen>action.payload};
        }
        case authenAction.ActionTypes.REGISTER_FAIL:
        case authenAction.ActionTypes.LOGIN_FAIL: {
            return initialState;
        }
        default: {
            return state;
        }
    }
}
