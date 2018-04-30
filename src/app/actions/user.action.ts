import { Action } from '@ngrx/store';
import { type } from '../utils/type.util';
import { User, Project } from '../domain';

export interface UserProject {
  user: User;
  projectId: string;
}

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 */
export const ActionTypes = {
  ADD: type('[User] Add project member'),
  ADD_SUCCESS: type('[User] Add project member success'),
  ADD_FAIL: type('[User] Add project member fail'),
  UPDATE: type('[User] Update project members'),
  UPDATE_SUCCESS: type('[User] Update project members success'),
  UPDATE_FAIL: type('[User] Update project members fail'),
  DELETE: type('[User] Delete project member'),
  DELETE_SUCCESS: type('[User] Delete project member success'),
  DELETE_FAIL: type('[User] Delete project member fail'),
  LOAD: type('[User] Load project memebers'),
  LOAD_SUCCESS: type('[User] Load project memebers success'),
  LOAD_FAIL: type('[User] Load project memebers fail'),
  SEARCH: type('[User] Search'),
  SEARCH_SUCCESS: type('[User] Search success'),
  SEARCH_FAIL: type('[User] Search fail'),
};

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 */
export class Add implements Action {
  readonly type = ActionTypes.ADD;

  constructor(public payload: UserProject) { }
}

export class AddSuccess implements Action {
  readonly type = ActionTypes.ADD_SUCCESS;

  constructor(public payload: User) { }
}

export class AddFail implements Action {
  readonly type = ActionTypes.ADD_FAIL;

  constructor(public payload: string) { }
}

export class Update implements Action {
  readonly type = ActionTypes.UPDATE;

  constructor(public payload: Project) { }
}

export class UpdateSuccess implements Action {
  readonly type = ActionTypes.UPDATE_SUCCESS;

  constructor(public payload: User[]) { }
}

export class UpdateFail implements Action {
  readonly type = ActionTypes.UPDATE_SUCCESS;

  constructor(public payload: string) { }
}

export class Delete implements Action {
  readonly type = ActionTypes.DELETE;

  constructor(public payload: UserProject) { }
}

export class DeleteSuccess implements Action {
  readonly type = ActionTypes.DELETE_SUCCESS;

  constructor(public payload: User) { }
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

  constructor(public payload: User[]) { }
}

export class LoadFail implements Action {
  readonly type = ActionTypes.LOAD_FAIL;

  constructor(public payload: string) { }
}

export class Search implements Action {
  readonly type = ActionTypes.SEARCH;

  constructor(public payload: string) { }
}

export class SearchSuccess implements Action {
  readonly type = ActionTypes.SEARCH_SUCCESS;

  constructor(public payload: User[]) { }
}

export class SearchFail implements Action {
  readonly type = ActionTypes.SEARCH_FAIL;

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
            | Search
            | SearchSuccess
            | SearchFail;
