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
import * as fromAuthen from './authen.reducer';
import * as fromProject from './project.reducer';
import * as fromTaskList from './task-list.reducer';
import { environment } from '../../environments/environment';
import { createSelector } from 'reselect';
import { Authen } from '../domain';

export interface RouterStateUrl {
  url: string;
  params: Params;
  queryParams: Params;
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

export interface State {
  router: RouterReducerState<RouterStateUrl>;
  quote: fromQuote.State;
  authen: Authen;
  project: fromProject.State;
  taskList: fromTaskList.State;
}

const initialState: State = {
  router: null,
  quote: fromQuote.initialState,
  authen: fromAuthen.initialState,
  project: fromProject.initialState,
  taskList: fromTaskList.initialState
};

const reducers: ActionReducerMap<State> = {
  router: routerReducer,
  quote: fromQuote.reducer,
  authen: fromAuthen.reducer,
  project: fromProject.reducer,
  taskList: fromTaskList.reducer,
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [storeFreeze] : [];

export const getQuoteState = (state: State) => state.quote;
export const getAuthenState = (state: State) => state.authen;
export const getProjectState = (state: State) => state.project;
export const getTaskListState = (state: State) => state.taskList;

export const getQuote = createSelector(getQuoteState, fromQuote.getQuote);
export const getProjects = createSelector(getProjectState, fromProject.getAll);
export const getTaskLists = createSelector(getTaskListState, fromTaskList.getSelected);

@NgModule({
  imports: [
    StoreModule.forRoot(reducers, {metaReducers, initialState}),
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
