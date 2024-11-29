import { createReducer, on } from '@ngrx/store';
import { appInitialState, AppState } from './app.state';
import { entityConfig } from './entity-config';
import { mapDtoToEntityByType } from './mapper';
import { loadEntitiesFromDto } from './actions';
import { EntityDto } from '../model/dto';
import { EntityRef } from './entity.types';

/**
 * Reducer that handles reading an @link{EntityDto} and adding the entire hierarchy of entities to the state.
 * Existing entities with the same ID are replaced.
 */
export const loadEntityDtoReducer = createReducer<AppState>(
  appInitialState,

  on(loadEntitiesFromDto, (state, { entityDto }) => {
    return addEntityAndChildrenToState(entityDto, state, null);
  })
);

const addEntityAndChildrenToState = (entityDto: EntityDto, state: AppState, parentRef: EntityRef | null): AppState => {
  let newState = state;

  const entity = mapDtoToEntityByType(entityDto, parentRef);
  if (!entity) {
    return state;
  }

  const entityConfigForType = entityConfig.get(entity.type);
  newState = {
    ...newState,
    [entity.type]: entityConfigForType.adapter.upsertOne(entity, state[entity.type])
  };

  // Link the child entities to this entity
  const childParentRef: EntityRef = { id: entity.id, type: entity.type };

  // Recursively add child entities, if any
  for (const child of entityDto.childNodes) {
    newState = addEntityAndChildrenToState(child, newState, childParentRef);
  }

  return newState;
}
