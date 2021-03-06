import { createSelector } from '@ngrx/store';
import * as actions from '../actions/user.action';
import * as projectAction from '../actions/project.action';
import { Project, User } from '../domain';
import * as _ from 'lodash';

export interface State {
  ids: string[];
  entities: {[id: string]: User};
}
export const initialState: State = {
  ids: [],
  entities: {},
};

const addUser = (state, action) => {
  const user = <User> action.payload;
  const newIds = [...state.ids, user.id];
  const newEntites = {...state.entities, [user.id]: user};
  if (state.entities[user.id]) {
    return {...state, entites: newEntites};
  } else {
    return {...state, ids: newIds, entites: newEntites};
  }

};

const updateUser = (state, action) => {
  const users = <User[]> action.payload;
  const incomingEntities = _.chain(users)
    .keyBy('id')
    .mapValues(o => o)
    .value();
  const newEntites = {...state.entities, ...incomingEntities};
  return {...state, entities: newEntites};
};

const deleteUser = (state, action) => {
  const user = <User> action.payload;
  const newEntities = { ...state.entites, [user.id]: user};
  return state.entites[user.id] ?
    { ... state, entites: newEntities } : state;
};

const loadUsers = (state, action) => {
  const users = <User[]> action.payload;
  const incomingIds = users.map(p => p.id);
  const newIds = _.difference(incomingIds, state.ids);
  const incomingEntities = _.chain(users)
    .keyBy('id')
    .mapValues(o => o)
    .value();
  const newEntites = newIds.reduce((entities, id: string) => (
    {...entities, [id]: incomingEntities[id]}
  ), {});
  return {
    ...state,
    ids: [...state.ids, ...newIds],
    entities: {...state.entites, ...newEntites},
  };
};

export function reducer(state = initialState, action: actions.Actions ): State {
  switch (action.type) {
    case actions.ActionTypes.ADD_SUCCESS: {
      return addUser(state, action);
    }
    case actions.ActionTypes.DELETE_SUCCESS: {
      return deleteUser(state, action);
    }
    case actions.ActionTypes.UPDATE_SUCCESS: {
      return updateUser(state, action);
    }
    case actions.ActionTypes.SEARCH_SUCCESS:
    case actions.ActionTypes.LOAD_SUCCESS: {
      return loadUsers(state, action);
    }
    default: {
      return state;
    }
  }
}

export const getIds = (state: State) => state.ids;
export const getEntities = (state: State) => state.entities;

export const getUsers = createSelector(getIds, getEntities, (ids, entities) => {
  return ids.map(id => entities[id]);
});
