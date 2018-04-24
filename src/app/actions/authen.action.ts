import { Action } from '@ngrx/store';
import { type } from '../utils/type.util';
import { Authen, User, Whoops } from '../domain';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 */
export const ActionTypes = {
    LOGIN: type('[Authen] Login'),
    LOGIN_SUCCESS: type('[Authen] Login success'),
    LOGIN_FAIL: type('[Authen] Login fail'),
    LOGOUT: type('[Authen] Logout'),
    REGISTER: type('[Authen] Register'),
    REGISTER_SUCCESS: type('[Authen] Register success'),
    REGISTER_FAIL: type('[Authen] Register fail'),
};

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 */
export class Login implements Action {
    readonly type = ActionTypes.LOGIN;

    constructor(public payload: {email: string; password: string}) { }
}

export class LoginSuccess implements Action {
    readonly type = ActionTypes.LOGIN_SUCCESS;

    constructor(public payload: Authen) { }
}

export class LoginFail implements Action {
    readonly type = ActionTypes.LOGIN_FAIL;

    constructor(public payload: Whoops) { }
}

export class Logout implements Action {
    readonly type = ActionTypes.LOGOUT;

    constructor(public payload: Authen) { }
}

export class Register implements Action {
    readonly type = ActionTypes.REGISTER;

    constructor(public payload: User) { }
}

export class RegisterSuccess implements Action {
    readonly type = ActionTypes.REGISTER_SUCCESS;

    constructor(public payload: Authen) { }
}

export class RegisterFail implements Action {
    readonly type = ActionTypes.REGISTER_FAIL;

    constructor(public payload: Whoops) { }
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
    = Login
    | LoginSuccess
    | LoginFail
    | Logout
    | Register
    | RegisterSuccess
    | RegisterFail;
