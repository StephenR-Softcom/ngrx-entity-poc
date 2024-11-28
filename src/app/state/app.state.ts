import { EntityState } from '@ngrx/entity';
import { EntityL1, EntityL2, EntityL3, EntityL3Other } from './entity.types';
import { entityConfig } from './entity-config';

// Our state extends NgRx EntityState, which provides helper functions for managing collections of entities.
export interface QuestionState<Q> extends EntityState<Q> {
  // Common state fields go here
  synced: boolean;
}

export interface AppState {
  entityL1: QuestionState<EntityL1>;
  entityL2: QuestionState<EntityL2>;
  entityL3: QuestionState<EntityL3>;
  entityL3Other: QuestionState<EntityL3Other>;
  // TODO add this extra slice and make it work
  //nonEntityState: { someValue: string }; // just to make sure we can handle extra slices that do not extend EntityState
}

// ---
// Initial state
// ---

const entityL1InitialState: QuestionState<EntityL1> = {
  ...entityConfig.entityL1.adapter.getInitialState(),
  synced: true,
};
const entityL2InitialState: QuestionState<EntityL2> = {
  ...entityConfig.entityL2.adapter.getInitialState(),
  synced: true,
}
const entityL3InitialState: QuestionState<EntityL3> = {
  ...entityConfig.entityL3.adapter.getInitialState(),
  synced: true,
}
const entityL3OtherInitialState: QuestionState<EntityL3Other> = {
  ...entityConfig.entityL3Other.adapter.getInitialState(),
  synced: true,
}

export const appInitialState: AppState = {
  entityL1: entityL1InitialState,
  entityL2: entityL2InitialState,
  entityL3: entityL3InitialState,
  entityL3Other: entityL3OtherInitialState,
};
