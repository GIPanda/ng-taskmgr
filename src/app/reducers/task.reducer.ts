import { createSelector } from '@ngrx/store';
import * as actions from '../actions/task.action';
import * as projectAction from '../actions/project.action';
import { Project, Task } from '../domain';
import * as _ from 'lodash';

export interface State {
  ids: string[];
  entities: {[id: string]: Task};
}
export const initialState: State = {
  ids: [],
  entities: {},
};

const addTask = (state, action) => {
  const taskList = <Task> action.payload;
  if (state.entities[taskList.id]) {
    return state;
  } else {
    const newIds = [...state.ids, taskList.id];
    const newEntites = {...state.entities, [taskList.id]: taskList};
    return {...state, ids: newIds, entities: newEntites};
  }
};

const updateTask = (state, action) => {
  const taskList = <Task> action.payload;
  const newEntites = {...state.entities, [taskList.id]: taskList};
  return {...state, entities: newEntites};
};

const deleteTask = (state, action) => {
  const taskList = <Task> action.payload;
  const newIds = state.ids.filter(id => id !== taskList.id);
  const newEntites = newIds.reduce((entities, id: string) => (
    {...entities, [id]: state.entities[id]}
  ), {});
  return {
    ids: newIds,
    entities: newEntites,
  };
};

const moveAllTasks = (state, action) => {
  const tasks = <Task[]>action.payload;
  const updatedEntities = tasks
    .reduce((entities, task) => ({...entities, [task.id]: task}), {});
  return {
    ... state,
    entites: {...state.entites, ...updatedEntities}
  };
};

const deleteTasksOfProject = (state, action) => {
  const project = <Project> action.payload;
  const taskListIds = project.taskLists;
  const remainingIds = state.ids
    .filter(id => taskListIds.indexOf(state.entites[id].taskListId) === -1);
  const remainingEntities = remainingIds.reduce(
    (entities, id) => ({...entities, [id]: state.entites[id]}), {}
  );
  return {
    ids: [...remainingIds],
    entities: remainingEntities,
  };
};

const loadTasks = (state, action) => {
  const tasks = <Task[]> action.payload;
  const incomingIds = tasks.map(p => p.id);
  const newIds = _.difference(incomingIds, state.ids);
  const incomingEntities = _.chain(tasks)
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
      return addTask(state, action);
    }
    case actions.ActionTypes.DELETE_SUCCESS: {
      return deleteTask(state, action);
    }
    case actions.ActionTypes.COMPLETE_SUCCESS:
    case actions.ActionTypes.MOVE_SUCCESS:
    case actions.ActionTypes.UPDATE_SUCCESS: {
      return updateTask(state, action);
    }
    case actions.ActionTypes.LOAD_SUCCESS: {
      return loadTasks(state, action);
    }
    case actions.ActionTypes.MOVE_ALL_SUCCESS: {
      return moveAllTasks(state, action);
    }
    case projectAction.ActionTypes.DELETE_SUCCESS: {
      return deleteTasksOfProject(state, action);
    }
    default: {
      return state;
    }
  }
}

export const getIds = (state: State) => state.ids;
export const getEntities = (state: State) => state.entities;

export const getTasks = createSelector(getIds, getEntities, (ids, entities) => {
  return ids.map(id => entities[id]);
});
