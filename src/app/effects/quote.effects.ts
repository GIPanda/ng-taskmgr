import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import * as actions from '../actions/quote.action';
import { QuoteService } from '../services/quote.service';

@Injectable()
export class QuoteEffects {

    @Effect()
    quote$: Observable<Action> = this.actions$
      .ofType(actions.ActionTypes.LOAD)
      .switchMap( _ => {
        return this.service$.getQuote()
          .map(data => new actions.LoadSuccess(data))
          .catch(err => Observable.of(new actions.LoadFail(JSON.stringify(err))));
        }
      );

    constructor(private actions$: Actions, private service$: QuoteService) {}
}
