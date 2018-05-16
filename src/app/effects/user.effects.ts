import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Router } from '@angular/router';
import * as actions from '../actions/user.action';
import * as reducers from '../reducers';
import { User } from '../domain';
import { UserService } from '../services/user.service';

@Injectable()
export class UserEffects {

  @Effect()
  loadUsersOfProject$: Observable<Action> = this.actions$
    .ofType(actions.ActionTypes.LOAD)
    .map((action: actions.Load) => action.payload)
    .switchMap(projectId => this.service$.getUsersByProject(projectId))
    .map(users => new actions.LoadSuccess(users))
    .catch(err => Observable.of(new actions.LoadFail(err)));

  @Effect()
  addUserProjectRef$: Observable<Action> = this.actions$
    .ofType(actions.ActionTypes.ADD)
    .map((action: actions.Add) => action.payload)
    .switchMap(({user, projectId}) => this.service$.addProjectRef(user, projectId))
    .map(res => new actions.AddSuccess(res))
    .catch(err => Observable.of(new actions.AddFail(err)));

  @Effect()
  updateUserProjectRef$: Observable<Action> = this.actions$
    .ofType(actions.ActionTypes.UPDATE)
    .map((action: actions.Update) => action.payload)
    .switchMap((project) => this.service$.batchUpdateProjectRef(project))
    .map(res => new actions.UpdateSuccess(res))
    .catch(err => Observable.of(new actions.UpdateFail(err)));

  @Effect()
  deleteUserProjectRef$: Observable<Action> = this.actions$
    .ofType(actions.ActionTypes.DELETE)
    .map((action: actions.Delete) => action.payload)
    .switchMap(({user, projectId}) => this.service$.removeProjectRef(user, projectId))
    .map(res => new actions.DeleteSuccess(res))
    .catch(err => Observable.of(new actions.DeleteFail(err)));

  @Effect()
  search$: Observable<Action> = this.actions$
    .ofType(actions.ActionTypes.SEARCH)
    .map((action: actions.Search) => action.payload)
    .switchMap((str) => this.service$.searchUsers(str))
    .map(res => new actions.SearchSuccess(res))
    .catch(err => Observable.of(new actions.SearchFail(err)));

  constructor(
    private actions$: Actions,
    private store$: Store<reducers.State>,
    private router: Router,
    private service$: UserService
  ) {}
}
