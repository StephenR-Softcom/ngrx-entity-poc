import { AppState, QuestionState } from './app.state';
import { Entity, EntityType } from './entity.types';
import { Dictionary } from '@ngrx/entity';
import { entityConfig } from './entity-config';

/**
 * Retrieve the entities for a given entity type.
 * @returns The entities of the given type, returned as the base {@link Entity} type - they may be cast if necessary.
 */
export const getEntitiesOfType = (state: AppState, type: EntityType): Dictionary<Entity> | undefined => {
  // Access state and adapter using generic type.
  const entityState: QuestionState<Entity> = state[type];
  const adapter = entityConfig.get(type).adapter;
  return adapter.getSelectors().selectEntities(entityState);
};

export const getEntityByTypeAndId = (state: AppState, type: EntityType, id: string): Entity | undefined => {
  const entityDictionary = getEntitiesOfType(state, type);
  return entityDictionary?.[id];
};
