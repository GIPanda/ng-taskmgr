import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import * as quoteAction from '../actions/quote.action';
import { QuoteService } from '../services/quote.service';

@Injectable()
export class QuoteEffects {

    @Effect()
    quote$: Observable<Action> = this.actions$
      .ofType(quoteAction.ActionTypes.LOAD)
      .switchMap( _ => {
        return this.service$.getQuote()
          .map(res => new quoteAction.LoadSuccess(res))
          .catch(err => Observable.of(new quoteAction.LoadFail(JSON.stringify(err))));
        }
      );

    constructor(private actions$: Actions, private service$: QuoteService) {
      console.log('created');
    }
}
