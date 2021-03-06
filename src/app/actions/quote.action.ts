import { Action } from '@ngrx/store';
import { type } from '../utils/type.util';
import { Quote } from '../domain/quote.model';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 */
export const ActionTypes = {
    LOAD: type('[Quote] Load'),
    LOAD_SUCCESS: type('[Quote] Load success'),
    LOAD_FAIL: type('[Quote] Load fail')
};

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 */
export class Load implements Action {
    type = ActionTypes.LOAD;

    constructor(public payload: null) { }
}

export class LoadSuccess implements Action {
    type = ActionTypes.LOAD_SUCCESS;

    constructor(public payload: Quote) { }
}

export class LoadFail implements Action {
    type = ActionTypes.LOAD_FAIL;

    constructor(public payload: string) { }
}


/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
    = Load
    | LoadSuccess
    | LoadFail;
