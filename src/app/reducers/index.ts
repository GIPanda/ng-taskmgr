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
import * as fromTask from './task.reducer';
import * as fromUser from './user.reducer';
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
  quotes: fromQuote.State;
  authen: Authen;
  projects: fromProject.State;
  taskLists: fromTaskList.State;
  tasks: fromTask.State;
  users: fromUser.State;
}

const initialState: State = {
  router: null,
  quotes: fromQuote.initialState,
  authen: fromAuthen.initialState,
  projects: fromProject.initialState,
  taskLists: fromTaskList.initialState,
  tasks: fromTask.initialState,
  users: fromUser.initialState,
};

const reducers: ActionReducerMap<State> = {
  router: routerReducer,
  quotes: fromQuote.reducer,
  authen: fromAuthen.reducer,
  projects: fromProject.reducer,
  taskLists: fromTaskList.reducer,
  tasks: fromTask.reducer,
  users: fromUser.reducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [storeFreeze] : [];

export const getQuoteState = (state: State) => state.quotes;
export const getAuthenState = (state: State) => state.authen;
export const getProjectState = (state: State) => state.projects;
export const getTaskListState = (state: State) => state.taskLists;
export const getTaskState = (state: State) => state.tasks;
export const getUserState = (state: State) => state.users;

export const getQuote = createSelector(getQuoteState, fromQuote.getQuote);
export const getProjects = createSelector(getProjectState, fromProject.getAll);
export const getTaskLists = createSelector(getTaskListState, fromTaskList.getSelected);
export const getTasks = createSelector(getTaskState, fromTask.getTasks);
export const getUsers = createSelector(getUserState, fromUser.getUsers);

export const getUserEntities = createSelector(getUserState, fromUser.getEntities);
export const getTasksUsers = createSelector(getTasks, getUserEntities, (tasks, userEntities) => {
  return tasks.map(task => {
    return {
      ...task,
      owner: userEntities[task.ownerId],
      participants: task.participantIds.map(id => userEntities[id])
    };
  });
});

export const getTasksOfLists = createSelector(
  getTaskLists, getTasksUsers, (lists, tasks) => {
    return lists.map(list => {
      return {
        ... list,
        tasks: tasks.filter(task => task.taskListId === list.id)
      };
    });
  }
);

export const getProjectUsers = (projectId: string) => createSelector(
  getProjectState, getUserEntities, (prjState, userEntities) => {
    return prjState.entities[projectId].members.map(id => userEntities[id]);
  }
);

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
