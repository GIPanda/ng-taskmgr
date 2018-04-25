import { Action } from '@ngrx/store';
import { type } from '../utils/type.util';
import { Project, User } from '../domain';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 */
export const ActionTypes = {
  ADD: type('[Project] Add'),
  ADD_SUCCESS: type('[Project] Add success'),
  ADD_FAIL: type('[Project] Add fail'),
  UPDATE: type('[Project] Update'),
  UPDATE_SUCCESS: type('[Project] Update success'),
  UPDATE_FAIL: type('[Project] Update fail'),
  DELETE: type('[Project] Delete'),
  DELETE_SUCCESS: type('[Project] Delete success'),
  DELETE_FAIL: type('[Project] Delete fail'),
  LOAD: type('[Project] Load'),
  LOAD_SUCCESS: type('[Project] Load success'),
  LOAD_FAIL: type('[Project] Load fail'),
  SELECT: type('[Project] Select'),
  INVITE: type('[Project] Invite'),
  INVITE_SUCCESS: type('[Project] Invite success'),
  INVITE_FAIL: type('[Project] Invite fail'),
};

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 */
export class Add implements Action {
  readonly type = ActionTypes.ADD;

  constructor(public payload: Project) { }
}

export class AddSuccess implements Action {
  readonly type = ActionTypes.ADD_SUCCESS;

  constructor(public payload: Project) { }
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

  constructor(public payload: Project) { }
}

export class UpdateFail implements Action {
  readonly type = ActionTypes.UPDATE_SUCCESS;

  constructor(public payload: string) { }
}

export class Delete implements Action {
  readonly type = ActionTypes.DELETE;

  constructor(public payload: Project) { }
}

export class DeleteSuccess implements Action {
  readonly type = ActionTypes.DELETE_SUCCESS;

  constructor(public payload: Project) { }
}

export class DeleteFail implements Action {
  readonly type = ActionTypes.DELETE_FAIL;

  constructor(public payload: string) { }
}

export class Load implements Action {
  readonly type = ActionTypes.LOAD;

  constructor(public payload: null) { }
}

export class LoadSuccess implements Action {
  readonly type = ActionTypes.LOAD_SUCCESS;

  constructor(public payload: Project[]) { }
}

export class LoadFail implements Action {
  readonly type = ActionTypes.LOAD_FAIL;

  constructor(public payload: string) { }
}

export class Select implements Action {
  readonly type = ActionTypes.SELECT;

  constructor(public payload: Project) { }
}

export class Invite implements Action {
  readonly type = ActionTypes.INVITE;

  constructor(public payload: {projectId: string, members: User[]}) { }
}

export class InviteSuccess implements Action {
  readonly type = ActionTypes.INVITE_SUCCESS;

  constructor(public payload: Project) { }
}

export class InviteFail implements Action {
  readonly type = ActionTypes.INVITE_FAIL;

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
            | Select
            | Invite
            | InviteSuccess
            | InviteFail;
