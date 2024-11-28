import { createReducer, on } from '@ngrx/store';
import { appInitialState, AppState, QuestionState } from './app.state';
import { entityConfig } from './entity-config';
import { deleteEntitySuccess } from './actions';
import { Entity, EntityType } from './entity.types';
import { Dictionary, EntityAdapter } from '@ngrx/entity';

/**
 * Reducer that handles deleting nodes and their children across all entity types in state.
 */
export const deleteReducer = createReducer<AppState>(
  appInitialState, // Do we need to define this here too?

  on(deleteEntitySuccess, (state, { deletedEntity }) => {
    let newState = state;
    newState = deleteEntityAndChildren(newState, deletedEntity);
    newState = removeEntityIdFromParent(newState, deletedEntity);
    return newState;
  }),
);

/**
 * Remove the ID of a deleted entity from its parent's childNodeIds.
 */
const removeEntityIdFromParent = (state: AppState, deletedEntity: Entity): AppState => {
  const parentRef = deletedEntity.parent;
  if (!parentRef) {
    // Node has no parent - do nothing
    return state;
  }
  const parent = getEntityByTypeAndId(state, parentRef.type, parentRef.id);
  if (!parent) {
    console.warn(`Parent node with id '${parentRef.id}' not found in state`);
    return state;
  }

  // Remove EntityRef for deleted entity from parent's children
  parent.children = parent.children.filter(child => child.id !== deletedEntity.id);
  return state;

  // TODO check if we need the updateOne call - we update in-place, so it should be enough
  /*
  // Use generic adapter - we do not need to know the exact type
  const adapter = entityConfig[parentType].adapter as EntityAdapter<Entity>;
  return {
    ...state,
    [parentType]: adapter.updateOne({
      id: parentNode.id,
      changes: { childNodeIds: updatedChildNodeIds }
    }, state[parentType])
  };
   */
}

/**
 * Delete a node and all its children recursively.
 */
const deleteEntityAndChildren = (state: AppState, entity: Entity): AppState => {
  let updatedState = state;


  // Recursively remove child entities, if any
  for (const childRef of entity.children) {
    const child = getEntityByTypeAndId(state, childRef.type, childRef.id);
    if (!child) {
      console.warn(`Child node with id '${childRef.id}' not found in state`);
      continue;
    }
    updatedState = deleteEntityAndChildren(updatedState, child);
  }

  // Remove self
  // Only delete the node *after* all children have been removed, because we need the childNodeIds.
  // Also, deleting bottom-up seems more intuitive.

  const thisEntityConfig = entityConfig.get(entity.type);

  const entitySubState = updatedState[entity.type];
  updatedState = {
    ...updatedState,
    [entity.type]: thisEntityConfig.adapter.removeOne(entity.id, entitySubState)
  };

  return updatedState;
};

const getEntityByTypeAndId = (state: AppState, type: EntityType, id: string): Entity | undefined => {
  const entityDictionary = getEntitiesOfType(state, type);
  return entityDictionary[id];
};

/**
 * Retrieve the entities for a given entity type.
 * @returns The entities of the given type, returned as the base {@link Entity} type - they may be cast if necessary.
 */
const getEntitiesOfType = (state: AppState, type: EntityType): Dictionary<Entity> => {
  // Access state and adapter using generic type.
  const entityState: QuestionState<Entity> = state[type];
  const adapter = entityConfig[type].adapter as EntityAdapter<Entity>;
  return adapter.getSelectors().selectEntities(entityState);
};
