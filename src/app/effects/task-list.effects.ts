import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Router } from '@angular/router';
import * as actions from '../actions/task-list.action';
import * as reducers from '../reducers';
import { TaskList } from '../domain';
import { TaskListService } from '../services/task-list.service';

@Injectable()
export class TaskListEffects {

  @Effect()
  loadTaskLists$: Observable<Action> = this.actions$
    .ofType(actions.ActionTypes.LOAD)
    .map((action: actions.Load) => action.payload)
    .switchMap(projectId => this.service$.get(projectId))
    .map(taskLists => new actions.LoadSuccess(taskLists))
    .catch(err => Observable.of(new actions.LoadFail(err)));

  @Effect()
  addTaskList$: Observable<Action> = this.actions$
    .ofType(actions.ActionTypes.ADD)
    .map((action: actions.Add) => action.payload)
    .switchMap((taskList) => this.service$.add(taskList))
    .map(res => new actions.AddSuccess(res))
    .catch(err => Observable.of(new actions.AddFail(err)));

  @Effect()
  updateTaskList$: Observable<Action> = this.actions$
    .ofType(actions.ActionTypes.UPDATE)
    .map((action: actions.Update) => action.payload)
    .switchMap((taskList) => this.service$.update(taskList))
    .map(res => new actions.UpdateSuccess(res))
    .catch(err => Observable.of(new actions.UpdateFail(err)));

  @Effect()
  deleteTaskList$: Observable<Action> = this.actions$
    .ofType(actions.ActionTypes.DELETE)
    .map((action: actions.Delete) => action.payload)
    .switchMap((taskList) => this.service$.delete(taskList))
    .map(res => new actions.DeleteSuccess(res))
    .catch(err => Observable.of(new actions.DeleteFail(err)));

  @Effect()
  swap$: Observable<Action> = this.actions$
    .ofType(actions.ActionTypes.SWAP)
    .map((action: actions.Swap) => action.payload)
    .switchMap(({src, target}) => this.service$.swapOrder(src, target))
    .map(res => new actions.SwapSuccess(res))
    .catch(err => Observable.of(new actions.SwapFail(err)));

  constructor(
    private actions$: Actions,
    private store$: Store<reducers.State>,
    private router: Router,
    private service$: TaskListService
  ) {}
}
