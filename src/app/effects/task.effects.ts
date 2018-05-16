import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Router } from '@angular/router';
import * as actions from '../actions/task.action';
import * as reducers from '../reducers';
import { Task } from '../domain';
import { TaskService } from '../services/task.service';

@Injectable()
export class TaskEffects {

  @Effect()
  loadTasks$: Observable<Action> = this.actions$
    .ofType(actions.ActionTypes.LOAD)
    .map((action: actions.Load) => action.payload)
    .switchMap(taskLists => this.service$.getByLists(taskLists))
    .map(tasks => new actions.LoadSuccess(tasks))
    .catch(err => Observable.of(new actions.LoadFail(err)));

  @Effect()
  addTask$: Observable<Action> = this.actions$
    .ofType(actions.ActionTypes.ADD)
    .map((action: actions.Add) => action.payload)
    .switchMap((task) => this.service$.add(task))
    .map(res => new actions.AddSuccess(res))
    .catch(err => Observable.of(new actions.AddFail(err)));

  @Effect()
  updateTask$: Observable<Action> = this.actions$
    .ofType(actions.ActionTypes.UPDATE)
    .map((action: actions.Update) => action.payload)
    .switchMap((task) => this.service$.update(task))
    .map(res => new actions.UpdateSuccess(res))
    .catch(err => Observable.of(new actions.UpdateFail(err)));

  @Effect()
  deleteTask$: Observable<Action> = this.actions$
    .ofType(actions.ActionTypes.DELETE)
    .map((action: actions.Delete) => action.payload)
    .switchMap((task) => this.service$.delete(task))
    .map(res => new actions.DeleteSuccess(res))
    .catch(err => Observable.of(new actions.DeleteFail(err)));

  @Effect()
  complete$: Observable<Action> = this.actions$
    .ofType(actions.ActionTypes.COMPLETE)
    .map((action: actions.Complete) => action.payload)
    .switchMap((task) => this.service$.completeToggle(task))
    .map(res => new actions.CompleteSuccess(res))
    .catch(err => Observable.of(new actions.CompleteFail(err)));

  @Effect()
  move$: Observable<Action> = this.actions$
    .ofType(actions.ActionTypes.MOVE)
    .map((action: actions.Move) => action.payload)
    .switchMap(({taskId, targetListId}) => this.service$.move(taskId, targetListId))
    .map(res => new actions.MoveSuccess(res))
    .catch(err => Observable.of(new actions.MoveFail(err)));

  @Effect()
  moveAll$: Observable<Action> = this.actions$
    .ofType(actions.ActionTypes.MOVE_ALL)
    .map((action: actions.MoveAll) => action.payload)
    .switchMap(({srcListId, targetListId}) => this.service$.moveAll(srcListId, targetListId))
    .map(res => new actions.MoveAllSuccess(res))
    .catch(err => Observable.of(new actions.MoveAllFail(err)));

  constructor(
    private actions$: Actions,
    private store$: Store<reducers.State>,
    private router: Router,
    private service$: TaskService
  ) {}
}
