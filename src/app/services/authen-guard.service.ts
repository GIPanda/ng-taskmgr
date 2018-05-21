import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import * as reducers from '../reducers';
import 'rxjs/add/operator/defaultIfEmpty';

@Injectable()
export class AuthenGuardService implements CanActivate {

  constructor(
    private router: Router,
    private store$: Store<reducers.State>) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.store$
      .select(reducers.getAuthenState)
      .map(authen => {
          if (!authen.token) {
              this.router.navigate(['/login']);
          }
          return authen.token ? true : false;
      })
      .defaultIfEmpty(false);
  }
}
