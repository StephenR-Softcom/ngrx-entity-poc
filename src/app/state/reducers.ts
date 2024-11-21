import { ActionReducer, ActionReducerMap, combineReducers, createReducer, on } from '@ngrx/store';
import { entityConfig } from './entity-config';
import { deleteReducer } from './delete-reducer';
import { createEntityReducer } from './entity-reducer';
import {
  appInitialState,
  AppState,
  entityL1InitialState,
  entityL2InitialState,
  entityL3InitialState
} from './app.state';
import { resetToInitialState } from './actions';
import { cloneDeep } from 'lodash';

// ---
// Initial State
// ---


// ---
// Reset reducer
// ---
export const resetToInitialStateReducer: ActionReducer<AppState> = createReducer(
  appInitialState,
  on(resetToInitialState, () => appInitialState)
);

// ---
// Combine the reducers
// ---

const entitySliceReducerMap: ActionReducerMap<AppState> = {
  entityL1: createEntityReducer(entityConfig.entityL1, entityL1InitialState),
  entityL2: createEntityReducer(entityConfig.entityL2, entityL2InitialState),
  entityL3: createEntityReducer(entityConfig.entityL3, entityL3InitialState),
};
const entitySliceReducer = combineReducers(entitySliceReducerMap, appInitialState);

/**
 * The main reducer for the app state.
 */
const appStateReducers: readonly ActionReducer<AppState>[] = [
  deleteReducer,
  resetToInitialStateReducer,
];

export const appStateReducer: ActionReducer<AppState> = (state, action) => {
  let newState = cloneDeep(state);
  appStateReducers.forEach(reducer => newState = reducer(newState, action));

  // Lastly, apply reducer for entity slices
  return entitySliceReducer(newState, action);
};
