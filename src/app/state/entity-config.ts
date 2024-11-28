import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Entity, EntityL1, EntityL2, EntityL3, EntityL3Other, EntityType } from './entity.types';
import { AppState } from './app.state';

/**
 * Define the entity types and their relations.
 * {@link EntityConfig} is used throughout to perform entity operations generically.
 */

export interface EntityConfig<T extends Entity> {
  type: EntityType;
  adapter: EntityAdapter<T>;
}

export const entityConfig: EntityConfigMap = {
  entityL1: {
    type: 'entityL1',
    adapter: createEntityAdapter<EntityL1>(),
  },
  entityL2: {
    type: 'entityL2',
    adapter: createEntityAdapter<EntityL2>(),
  },
  entityL3: {
    type: 'entityL3',
    adapter: createEntityAdapter<EntityL3>(),
  },
  entityL3Other: {
    type: 'entityL3Other',
    adapter: createEntityAdapter<EntityL3Other>(),
  },
  get: (type: EntityType) => entityConfig[type] as EntityConfig<Entity>,
};

interface EntityConfigMap extends EntityConfigForAllEntityTypes {
  /**
   * Get the {@link EntityConfig} for a given entity type, using only the base {@link Entity} interface.
   */
  get: (type: EntityType) => EntityConfig<Entity>;
}

  /**
   * Helper type for a map of entity types in {@link AppState} to their specifically typed {@link EntityConfig}.
   * @description This type ensures the specific generic type of each {@link EntityConfig} is maintained, to avoid downcasting to {@link Entity}.
   */
type EntityConfigForAllEntityTypes = {
    [K in keyof AppState]: AppState[K] extends EntityState<infer T extends Entity> ? EntityConfig<T> : undefined;
}
