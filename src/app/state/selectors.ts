import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from './app.state';
import { entityConfig } from './entity-config';
import { EntityType } from './entity.types';
import { getEntityByTypeAndId } from './entity-utils';

const selectAppState = createFeatureSelector<AppState>('app');

export const selectEntityL1State = createSelector(selectAppState, state => state.entityL1);
export const selectEntityL2State = createSelector(selectAppState, state => state.entityL2);
export const selectEntityL3State = createSelector(selectAppState, state => state.entityL3);
export const selectEntityL3OtherState = createSelector(selectAppState, state => state.entityL3Other);

export const createSelectorForEntityByIdAndType = (entityType: EntityType, id: string) => createSelector(
  selectAppState,
  (state: AppState) => getEntityByTypeAndId(state, entityType, id)
);

export const entityL1Adapter = entityConfig.entityL1.adapter;
export const selectAllEntityL1Items = createSelector(
  selectEntityL1State,
  entityL1Adapter.getSelectors().selectAll
);

const entityL2Adapter = entityConfig.entityL2.adapter;
export const selectAllEntityL2Items = createSelector(
  selectEntityL2State,
  entityL2Adapter.getSelectors().selectAll
);

const entityL3Adapter = entityConfig.entityL3.adapter;
export const selectAllEntityL3Items = createSelector(
  selectEntityL3State,
  entityL3Adapter.getSelectors().selectAll
);

const entityL3OtherAdapter = entityConfig.entityL3Other.adapter;
export const selectAllEntityL3OtherItems = createSelector(
  selectEntityL3OtherState,
  entityL3OtherAdapter.getSelectors().selectAll
);
