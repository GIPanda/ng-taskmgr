import { Action } from '@ngrx/store';
import { type } from '../utils/type.util';
import { TaskList, User } from '../domain';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 */
export const ActionTypes = {
  ADD: type('[TaskList] Add'),
  ADD_SUCCESS: type('[TaskList] Add success'),
  ADD_FAIL: type('[TaskList] Add fail'),
  UPDATE: type('[TaskList] Update'),
  UPDATE_SUCCESS: type('[TaskList] Update success'),
  UPDATE_FAIL: type('[TaskList] Update fail'),
  DELETE: type('[TaskList] Delete'),
  DELETE_SUCCESS: type('[TaskList] Delete success'),
  DELETE_FAIL: type('[TaskList] Delete fail'),
  LOAD: type('[TaskList] Load'),
  LOAD_SUCCESS: type('[TaskList] Load success'),
  LOAD_FAIL: type('[TaskList] Load fail'),
  SWAP: type('[TaskList] Swap'),
  SWAP_SUCCESS: type('[TaskList] Swap success'),
  SWAP_FAIL: type('[TaskList] Swap fail'),
};

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 */
export class Add implements Action {
  readonly type = ActionTypes.ADD;

  constructor(public payload: TaskList) { }
}

export class AddSuccess implements Action {
  readonly type = ActionTypes.ADD_SUCCESS;

  constructor(public payload: TaskList) { }
}

export class AddFail implements Action {
  readonly type = ActionTypes.ADD_FAIL;

  constructor(public payload: string) { }
}

export class Update implements Action {
  readonly type = ActionTypes.UPDATE;

  constructor(public payload: TaskList) { }
}

export class UpdateSuccess implements Action {
  readonly type = ActionTypes.UPDATE_SUCCESS;

  constructor(public payload: TaskList) { }
}

export class UpdateFail implements Action {
  readonly type = ActionTypes.UPDATE_SUCCESS;

  constructor(public payload: string) { }
}

export class Delete implements Action {
  readonly type = ActionTypes.DELETE;

  constructor(public payload: TaskList) { }
}

export class DeleteSuccess implements Action {
  readonly type = ActionTypes.DELETE_SUCCESS;

  constructor(public payload: TaskList) { }
}

export class DeleteFail implements Action {
  readonly type = ActionTypes.DELETE_FAIL;

  constructor(public payload: string) { }
}

export class Load implements Action {
  readonly type = ActionTypes.LOAD;

  constructor(public payload: string) { }
}

export class LoadSuccess implements Action {
  readonly type = ActionTypes.LOAD_SUCCESS;

  constructor(public payload: TaskList[]) { }
}

export class LoadFail implements Action {
  readonly type = ActionTypes.LOAD_FAIL;

  constructor(public payload: string) { }
}

export class Swap implements Action {
  readonly type = ActionTypes.SWAP;

  constructor(public payload: {src: TaskList, target: TaskList}) { }
}

export class SwapSuccess implements Action {
  readonly type = ActionTypes.SWAP_SUCCESS;

  constructor(public payload: TaskList[]) { }
}

export class SwapFail implements Action {
  readonly type = ActionTypes.SWAP_FAIL;

  constructor(public payload: string) { }
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
            = Add
            | AddSuccess
            | AddFail
            | Update
            | UpdateSuccess
            | UpdateFail
            | Delete
            | DeleteSuccess
            | DeleteFail
            | Load
            | LoadSuccess
            | LoadFail
            | Swap
            | SwapSuccess
            | SwapFail;
