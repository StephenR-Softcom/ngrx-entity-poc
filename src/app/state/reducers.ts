import { ActionReducer, ActionReducerMap, combineReducers, createReducer, on } from '@ngrx/store';
import { entityConfig } from './entity-config';
import { deleteReducer } from './delete-reducer';
import { createEntityReducer } from './entity-reducer';
import { appInitialState, AppState, } from './app.state';
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
  entityL1: createEntityReducer(entityConfig.entityL1, appInitialState.entityL1),
  entityL2: createEntityReducer(entityConfig.entityL2, appInitialState.entityL2),
  entityL3: createEntityReducer(entityConfig.entityL3, appInitialState.entityL3),
  entityL3Other: createEntityReducer(entityConfig.entityL3Other, appInitialState.entityL3Other),
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
