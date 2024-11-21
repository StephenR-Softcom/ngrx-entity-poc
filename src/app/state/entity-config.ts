import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { Entity, EntityL1, EntityL2, EntityL3 } from './entity.types';
import { AppState, EntityType, QuestionState } from './app.state';

/**
 * Define the entity types and their relations.
 * {@link EntityConfig} is used throughout to perform entity operations generically.
 */

export interface EntityConfig<T extends Entity> {
  type: EntityType;
  childType: EntityType | undefined;
  parentType: EntityType | undefined;
  adapter: EntityAdapter<T>;
}

export const entityConfig: EntityConfigMap = {
  entityL1: {
    type: 'entityL1',
    childType: 'entityL2',
    parentType: undefined,
    adapter: createEntityAdapter<EntityL1>(),
  },
  entityL2: {
    type: 'entityL2',
    childType: 'entityL3',
    parentType: 'entityL1',
    adapter: createEntityAdapter<EntityL2>(),
  },
  entityL3: {
    type: 'entityL3',
    childType: undefined,
    parentType: 'entityL2',
    adapter: createEntityAdapter<EntityL3>(),
  },
};

/**
 * Helper type for a map of entity types in {@link AppState} to their specifically typed {@link EntityConfig}.
 * @description This type ensures the specific generic type of each {@link EntityConfig} is maintained, to avoid downcasting to {@link Entity}.
 */
type EntityConfigMap = {
  [K in keyof AppState]: AppState[K] extends QuestionState<infer T extends Entity> ? EntityConfig<T> : undefined;
};
