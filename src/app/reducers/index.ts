import { NgModule } from '@angular/core';
import { Params, RouterStateSnapshot } from '@angular/router';
import { StoreModule, MetaReducer, ActionReducerMap} from '@ngrx/store';
import {
    StoreRouterConnectingModule,
    routerReducer,
    RouterReducerState,
    RouterStateSerializer
} from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { storeFreeze } from 'ngrx-store-freeze';
import * as fromQuote from './quote.reducer';
import { environment } from '../../environments/environment';
import { createSelector } from 'reselect';

export interface RouterStateUrl {
    url: string;
    params: Params;
    queryParams: Params;
  }

export interface State {
    router: RouterReducerState<RouterStateUrl>;
    quote: fromQuote.State;
}

export class CustomSerializer implements RouterStateSerializer<RouterStateUrl> {
    serialize(routerState: RouterStateSnapshot): RouterStateUrl {
      let route = routerState.root;
      while (route.firstChild) {
        route = route.firstChild;
      }
      const { url, root: { queryParams } } = routerState;
      const { params } = route;
      // Only return an object including the URL, params and query params
      // instead of the entire snapshot
      return { url, params, queryParams };
    }
  }

const reducers: ActionReducerMap<State> = {
    router: routerReducer,
    quote: fromQuote.reducer,
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [storeFreeze] : [];

export const getQuoteState = (state: State) => state.quote;

export const getQuote = createSelector(getQuoteState, fromQuote.getQuote);

@NgModule({
    imports: [
        StoreModule.forRoot(reducers, {metaReducers, initialState: {
            quote: fromQuote.initialState,
        }}),
        StoreRouterConnectingModule,
        StoreDevtoolsModule.instrument({
            maxAge: 5
        })
    ],
    providers: [
        { provide: RouterStateSerializer, useClass: CustomSerializer }
    ],
})
export class AppStoreModule {}
