import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import * as actions from '../actions/authen.action';
import { AuthenService } from '../services/authen.service';
import { Router } from '@angular/router';

import 'rxjs/add/observable/empty';

@Injectable()
export class AuthenEffects {

  @Effect()
  login$: Observable<Action> = this.actions$
    .ofType(actions.ActionTypes.LOGIN)
    .switchMap((action: actions.Login) =>
      this.service$
        .login(
          action.payload.email, action.payload.password
        )
        .map(data => {
          return new actions.LoginSuccess(data);
        })
        .catch(err => Observable.of(new actions.LoginFail({
          status: '501',
          message: err.message,
          exception: err.stack,
          path: '/login',
          timestamp: new Date()
        })))
    );

  @Effect()
  register$: Observable<Action> = this.actions$
    .ofType(actions.ActionTypes.REGISTER)
    .switchMap((action: actions.Register) =>
      this.service$
        .register(action.payload)
        .map(data => new actions.RegisterSuccess(data))
        .catch(err => Observable.of(new actions.RegisterFail(err)))
    );

  @Effect()
  logout$: Observable<Action> = this.actions$
    .ofType(actions.ActionTypes.LOGOUT)
    .do(_ => this.router.navigate(['/']));

  @Effect()
  afterLoginNavigate$: Observable<Action> = this.actions$
    .ofType(actions.ActionTypes.LOGIN_SUCCESS)
    .mergeMap(action => {
      this.router.navigate(['/projects']);
      return Observable.empty();
    });

  @Effect()
  afterRegisterNavigate$: Observable<Action> = this.actions$
    .ofType(actions.ActionTypes.REGISTER_SUCCESS)
    .mergeMap(action => {
      this.router.navigate(['/projects']);
      return Observable.empty();
    });

  constructor(
    private actions$: Actions,
    private service$: AuthenService,
    private router: Router
  ) {}
}
