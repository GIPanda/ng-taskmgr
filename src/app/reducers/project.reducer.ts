import { createSelector } from '@ngrx/store';
import * as actions from '../actions/project.action';
import { Project } from '../domain';
import * as _ from 'lodash';

export interface State {
  ids: string[];
  entities: {[id: string]: Project};
  selectedId: string | null;
}

export const initialState: State = {
  ids: [],
  entities: {},
  selectedId: null
};

const addProject = (state, action) => {
  const project = <Project> action.payload;
  if (state.entities[project.id]) {
    return state;
  } else {
    const newIds = [...state.ids, project.id];
    const newEntites = {...state.entities, [project.id]: project};
    return {...state, ids: newIds, entities: newEntites};
  }
};

const updateProject = (state, action) => {
  const project = <Project> action.payload;
  const newEntites = {...state.entities, [project.id]: project};
  return {...state, entities: newEntites};
};

const deleteProject = (state, action) => {
  const project = <Project> action.payload;
  const newIds = state.ids.filter(id => id !== project.id);
  const newEntites = newIds.reduce((entities, id: string) => (
    {...entities, [id]: state.entities[id]}
  ), {});
  return {
    ids: newIds,
    entities: newEntites,
    selectedId: null
  };
};

const loadProjects = (state, action) => {
  const projects = <Project[]> action.payload;
  const incomingIds = projects.map(p => p.id);
  const newIds = _.difference(incomingIds, state.ids);
  const incomingEntities = _.chain(projects)
    .keyBy('id')
    .mapValues(o => o)
    .value();
  const newEntites = newIds.reduce((entities, id: string) => (
    {...entities, [id]: incomingEntities[id]}
  ), {});
  return {
    ids: [...state.ids, ...newIds],
    entities: {...state.entites, ...newEntites},
    selectedId: null
  };
};

export function reducer(state = initialState, action: actions.Actions ): State {
  switch (action.type) {
    case actions.ActionTypes.ADD_SUCCESS: {
      return addProject(state, action);
    }
    case actions.ActionTypes.DELETE_SUCCESS: {
      return deleteProject(state, action);
    }
    case actions.ActionTypes.INVITE_SUCCESS:
    case actions.ActionTypes.UPDATE_SUCCESS: {
      return updateProject(state, action);
    }
    case actions.ActionTypes.LOAD_SUCCESS: {
      return loadProjects(state, action);
    }
    case actions.ActionTypes.SELECT: {
      const project = <Project> action.payload;
      return {...state, selectedId: project.id};
    }
    default: {
      return state;
    }
  }
}

export const getIds = (state: State) => state.ids;
export const getEntities = (state: State) => state.entities;
export const getSelectedId = (state: State) => state.selectedId;

export const getAll = createSelector(getIds, getEntities, (ids, entities) => {
  return ids.map(id => entities[id]);
});

