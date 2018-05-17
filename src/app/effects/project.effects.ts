import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Router } from '@angular/router';
import { ProjectService } from '../services/project.service';
import * as actions from '../actions/project.action';
import * as userActions from '../actions/user.action';
import * as reducers from '../reducers';
import { Project } from '../domain';
import * as taskListAction from '../actions/task-list.action';

@Injectable()
export class ProjectEffects {

  @Effect()
  loadProjects$: Observable<Action> = this.actions$
    .ofType(actions.ActionTypes.LOAD)
    .withLatestFrom(this.store$.select(reducers.getAuthenState))
    .switchMap(([_, authen]) => this.service$.get(authen.user.id))
    .map(projects => new actions.LoadSuccess(projects))
    .catch(err => Observable.of(new actions.LoadFail(err)));

  @Effect()
  addProject$: Observable<Action> = this.actions$
    .ofType(actions.ActionTypes.ADD)
    .map((action: actions.Add) => action.payload)
    .withLatestFrom(this.store$.select(reducers.getAuthenState).map(authen => authen.user))
    .switchMap(([payload, user]) => {
      const project = <Project> payload;
      const added = {...project, members: [`${user.id}`]};
      return this.service$.add(added)
        .map(res => new actions.AddSuccess(res))
        .catch(err => Observable.of(new actions.AddFail(err)));
    });

  @Effect()
  updateProject$: Observable<Action> = this.actions$
    .ofType(actions.ActionTypes.UPDATE)
    .map((action: actions.Update) => action.payload)
    .switchMap((project) => this.service$.update(project))
    .map(res => new actions.UpdateSuccess(res))
    .catch(err => Observable.of(new actions.UpdateFail(err)));

  @Effect()
  deleteProject$: Observable<Action> = this.actions$
    .ofType(actions.ActionTypes.DELETE)
    .map((action: actions.Delete) => action.payload)
    .switchMap((project) => this.service$.delete(project))
    .map(res => new actions.DeleteSuccess(res))
    .catch(err => Observable.of(new actions.DeleteFail(err)));

  @Effect()
  selectProject$: Observable<Action> = this.actions$
    .ofType(actions.ActionTypes.SELECT)
    .map((action: actions.Select) => action.payload)
    .mergeMap((project: Project) => {
      this.router.navigate([`/projects/${project.id}/tasks`]);
      return Observable.empty();
    });

  @Effect()
  loadTaskLists$: Observable<Action> = this.actions$
    .ofType(actions.ActionTypes.SELECT)
    .map((action: actions.Select) => action.payload)
    .map((project: Project) => new taskListAction.Load(project.id));

  @Effect()
  invite$: Observable<Action> = this.actions$
    .ofType(actions.ActionTypes.INVITE)
    .map((action: actions.Invite) => action.payload)
    .switchMap(({projectId, members}) => this.service$.invite(projectId, members))
    .map(res => new actions.InviteSuccess(res))
    .catch(err => Observable.of(new actions.InviteFail(err)));

  @Effect()
  loadUsers$: Observable<Action> = this.actions$
    .ofType(actions.ActionTypes.LOAD_SUCCESS)
    .map((action: actions.LoadSuccess) => action.payload)
    .switchMap((projects) => Observable.from(projects.map(prj => prj.id)))
    .map(projectId => new userActions.Load(projectId));

  @Effect()
  addUserProject$: Observable<Action> = this.actions$
    .ofType(actions.ActionTypes.ADD_SUCCESS)
    .map((action: actions.AddSuccess) => action.payload)
    .map((project: Project) => project.id)
    .withLatestFrom(this.store$.select(reducers.getAuthenState).map(auth => auth.user), (projectId, user) => {
      return new userActions.Add({user, projectId});
    });

  @Effect()
  removeUserProject$: Observable<Action> = this.actions$
    .ofType(actions.ActionTypes.DELETE_SUCCESS)
    .map((action: actions.DeleteSuccess) => action.payload)
    .map((project: Project) => project.id)
    .withLatestFrom(this.store$.select(reducers.getAuthenState).map(auth => auth.user), (projectId, user) => {
      return new userActions.Delete({user, projectId});
    });

  @Effect()
  updateUserProject$: Observable<Action> = this.actions$
    .ofType(actions.ActionTypes.INVITE_SUCCESS)
    .map((action: actions.InviteSuccess) => action.payload)
    .map(project => new userActions.Update(project));

  constructor(
    private actions$: Actions,
    private store$: Store<reducers.State>,
    private router: Router,
    private service$: ProjectService
  ) {}

}

