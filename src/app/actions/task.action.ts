import { Action } from '@ngrx/store';
import { type } from '../utils/type.util';
import { Task, User, TaskList } from '../domain';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 */
export const ActionTypes = {
  ADD: type('[Task] Add'),
  ADD_SUCCESS: type('[Task] Add success'),
  ADD_FAIL: type('[Task] Add fail'),
  UPDATE: type('[Task] Update'),
  UPDATE_SUCCESS: type('[Task] Update success'),
  UPDATE_FAIL: type('[Task] Update fail'),
  DELETE: type('[Task] Delete'),
  DELETE_SUCCESS: type('[Task] Delete success'),
  DELETE_FAIL: type('[Task] Delete fail'),
  LOAD: type('[Task] Load'),
  LOAD_SUCCESS: type('[Task] Load success'),
  LOAD_FAIL: type('[Task] Load fail'),
  MOVE: type('[Task] Move'),
  MOVE_SUCCESS: type('[Task] Move success'),
  MOVE_FAIL: type('[Task] Move fail'),
  MOVE_ALL: type('[Task] Move all'),
  MOVE_ALL_SUCCESS: type('[Task] Move all success'),
  MOVE_ALL_FAIL: type('[Task] Move all fail'),
  COMPLETE: type('[Task] Complete'),
  COMPLETE_SUCCESS: type('[Task] Complete success'),
  COMPLETE_FAIL: type('[Task] Complete fail'),
};

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 */
export class Add implements Action {
  readonly type = ActionTypes.ADD;

  constructor(public payload: Task) { }
}

export class AddSuccess implements Action {
  readonly type = ActionTypes.ADD_SUCCESS;

  constructor(public payload: Task) { }
}

export class AddFail implements Action {
  readonly type = ActionTypes.ADD_FAIL;

  constructor(public payload: string) { }
}

export class Update implements Action {
  readonly type = ActionTypes.UPDATE;

  constructor(public payload: Task) { }
}

export class UpdateSuccess implements Action {
  readonly type = ActionTypes.UPDATE_SUCCESS;

  constructor(public payload: Task) { }
}

export class UpdateFail implements Action {
  readonly type = ActionTypes.UPDATE_SUCCESS;

  constructor(public payload: string) { }
}

export class Delete implements Action {
  readonly type = ActionTypes.DELETE;

  constructor(public payload: Task) { }
}

export class DeleteSuccess implements Action {
  readonly type = ActionTypes.DELETE_SUCCESS;

  constructor(public payload: Task) { }
}

export class DeleteFail implements Action {
  readonly type = ActionTypes.DELETE_FAIL;

  constructor(public payload: string) { }
}

export class Load implements Action {
  readonly type = ActionTypes.LOAD;

  constructor(public payload: TaskList[]) { }
}

export class LoadSuccess implements Action {
  readonly type = ActionTypes.LOAD_SUCCESS;

  constructor(public payload: Task[]) { }
}

export class LoadFail implements Action {
  readonly type = ActionTypes.LOAD_FAIL;

  constructor(public payload: string) { }
}

export class Move implements Action {
  readonly type = ActionTypes.MOVE;

  constructor(public payload: {taskId: string, targetListId: string}) { }
}

export class MoveSuccess implements Action {
  readonly type = ActionTypes.MOVE_SUCCESS;

  constructor(public payload: Task) { }
}

export class MoveFail implements Action {
  readonly type = ActionTypes.MOVE_FAIL;

  constructor(public payload: string) { }
}

export class MoveAll implements Action {
  readonly type = ActionTypes.MOVE_ALL;

  constructor(public payload: {srcListId: string, targetListId: string}) { }
}

export class MoveAllSuccess implements Action {
  readonly type = ActionTypes.MOVE_ALL_SUCCESS;

  constructor(public payload: Task[]) { }
}

export class MoveAllFail implements Action {
  readonly type = ActionTypes.MOVE_ALL_FAIL;

  constructor(public payload: string) { }
}

export class Complete implements Action {
  readonly type = ActionTypes.COMPLETE;

  constructor(public payload: Task) { }
}

export class CompleteSuccess implements Action {
  readonly type = ActionTypes.COMPLETE_SUCCESS;

  constructor(public payload: Task) { }
}

export class CompleteFail implements Action {
  readonly type = ActionTypes.COMPLETE_FAIL;

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
            | Move
            | MoveSuccess
            | MoveFail
            | MoveAll
            | MoveAllSuccess
            | MoveAllFail
            | Complete
            | CompleteSuccess
            | CompleteFail;
