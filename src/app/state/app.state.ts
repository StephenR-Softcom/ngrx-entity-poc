import { EntityState } from '@ngrx/entity';
import { EntityL1, EntityL2, EntityL3 } from './entity.types';
import { entityConfig } from './entity-config';

export type EntityType = keyof AppState;

// Our state extends NgRx EntityState, which provides helper functions for managing collections of entities.
export interface QuestionState<Q> extends EntityState<Q> {
  // Common state fields go here
  synced: boolean;
}

export interface AppState {
  entityL1: QuestionState<EntityL1>;
  entityL2: QuestionState<EntityL2>;
  entityL3: QuestionState<EntityL3>;
}

// ---
// Initial state
// ---

export const entityL1InitialState: QuestionState<EntityL1> = {
  ...entityConfig.entityL1.adapter.getInitialState(),
  synced: true,
};
export const entityL2InitialState: QuestionState<EntityL2> = {
  ...entityConfig.entityL2.adapter.getInitialState(),
  synced: true,
}
export const entityL3InitialState: QuestionState<EntityL3> = {
  ...entityConfig.entityL3.adapter.getInitialState(),
  synced: true,
}
export const appInitialState: AppState = {
  entityL1: entityL1InitialState,
  entityL2: entityL2InitialState,
  entityL3: entityL3InitialState,
};