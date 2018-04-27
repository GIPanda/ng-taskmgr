import { createSelector } from '@ngrx/store';
import * as actions from '../actions/task-list.action';
import * as projectAction from '../actions/project.action';
import { Project, TaskList } from '../domain';
import * as _ from 'lodash';

export interface State {
  ids: string[];
  entities: {[id: string]: TaskList};
  selectedIds: string[];
}
export const initialState: State = {
  ids: [],
  entities: {},
  selectedIds: []
};

const addTaskList = (state, action) => {
  const taskList = <TaskList> action.payload;
  if (state.entities[taskList.id]) {
    return state;
  } else {
    const newIds = [...state.ids, taskList.id];
    const newEntites = {...state.entities, [taskList.id]: taskList};
    return {...state, ids: newIds, entities: newEntites};
  }
};

const updateTaskList = (state, action) => {
  const taskList = <TaskList> action.payload;
  const newEntites = {...state.entities, [taskList.id]: taskList};
  return {...state, entities: newEntites};
};

const deleteTaskList = (state, action) => {
  const taskList = <TaskList> action.payload;
  const newIds = state.ids.filter(id => id !== taskList.id);
  const newEntites = newIds.reduce((entities, id: string) => (
    {...entities, [id]: state.entities[id]}
  ), {});
  const newSelectedIds = state.selectedIds.filter(id => id !== taskList.id);
  return {
    ids: newIds,
    entities: newEntites,
    selectedIds: []
  };
};

const selectProject = (state, action) => {
  const project = <Project> action.payload;
  const selectedIds = state.ids.filter(id => state.entites[id].projectId === project.id);
  return {
    ...state,
    selectedIds: selectedIds
  };
};

const deleteListsOfProject = (state, action) => {
  const project = <Project> action.payload;
  const listsToDelete = project.taskLists;
  const remainingIds = _.difference(state.ids, listsToDelete);
  const remainingEntities = remainingIds.reduce(
    (entities, id) => ({...entities, [id]: state.entites[id]}), {}
  );
  return {
    ids: [...remainingIds],
    entities: remainingEntities,
    selectedIds: []
  };
};

const swapTaskLists = (state, action) => {
  const taskLists = <TaskList[]>action.payload;
  const updatedEntities = _.chain(taskLists)
    .keyBy('id')
    .mapValues(o => o)
    .value();
  const newEntities = {...state.entites, ...updatedEntities};
  return {
    ...state,
    entities: newEntities
  };
};

const loadTaskLists = (state, action) => {
  const taskLists = <TaskList[]> action.payload;
  const incomingIds = taskLists.map(p => p.id);
  const newIds = _.difference(incomingIds, state.ids);
  const incomingEntities = _.chain(taskLists)
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
      return addTaskList(state, action);
    }
    case actions.ActionTypes.DELETE_SUCCESS: {
      return deleteTaskList(state, action);
    }
    case actions.ActionTypes.UPDATE_SUCCESS: {
      return updateTaskList(state, action);
    }
    case actions.ActionTypes.LOAD_SUCCESS: {
      return loadTaskLists(state, action);
    }
    case actions.ActionTypes.SWAP_SUCCESS: {
      return swapTaskLists(state, action);
    }
    case projectAction.ActionTypes.SELECT: {
      return selectProject(state, action);
    }
    case projectAction.ActionTypes.DELETE_SUCCESS: {
      return deleteListsOfProject(state, action);
    }
    default: {
      return state;
    }
  }
}

export const getIds = (state: State) => state.ids;
export const getEntities = (state: State) => state.entities;
export const getSelectedIds = (state: State) => state.selectedIds;

export const getSelected = createSelector(getIds, getEntities, (ids, entities) => {
  return ids.map(id => entities[id]);
});
