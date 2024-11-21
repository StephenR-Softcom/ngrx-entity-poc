import { createReducer, on } from '@ngrx/store';
import { appInitialState, AppState, EntityType, QuestionState } from './app.state';
import { EntityConfig, entityConfig } from './entity-config';
import { deleteEntitySuccess } from './actions';
import { Entity } from './entity.types';
import { Dictionary, EntityAdapter } from '@ngrx/entity';

/**
 * Reducer that handles deleting nodes and their children across all entity types in state.
 */
export const deleteReducer = createReducer<AppState>(
  appInitialState, // Do we need to define this here too?
  on(deleteEntitySuccess, (state, { deletedEntity }) => {
    let newState = state;
    newState = deleteEntityAndChildren(newState, deletedEntity.type, deletedEntity.id);
    newState = removeEntityIdFromParent(newState, deletedEntity);
    return newState;
  }),
);

/**
 * Remove the ID of a deleted entity from its parent's childNodeIds.
 */
const removeEntityIdFromParent = (state: AppState, deletedEntity: Entity): AppState => {
  const parentType = entityConfig[deletedEntity.type].parentType;
  if (!deletedEntity.parentId || !parentType) {
    // Node has no parent - do nothing
    return state;
  }

  const parentNode = getNodeById(state, parentType, deletedEntity.parentId);
  if (!parentNode) {
    console.warn(`Parent node with id '${deletedEntity.parentId}' not found in state`);
    return state;
  }

  const updatedChildNodeIds: Set<string> = new Set(parentNode.childNodeIds);
  updatedChildNodeIds.delete(deletedEntity.id);

  // Use generic adapter - we do not need to know the exact type
  const adapter = entityConfig[parentType].adapter as EntityAdapter<Entity>;
  return {
    ...state,
    [parentType]: adapter.updateOne({
      id: parentNode.id,
      changes: { childNodeIds: updatedChildNodeIds }
    }, state[parentType])
  };
}

/**
 * Delete a node and all its children recursively.
 */
const deleteEntityAndChildren = (state: AppState, type: EntityType, entityId: string): AppState => {
  let updatedState = state;

  const node = getNodeById(state, type, entityId);
  if (!node) {
    console.warn(`Node with type '${type}' and id '${entityId}' not found in state`);
    return state;
  }

  const parentEntityConfig = entityConfig[type] as EntityConfig<Entity>;
  const childType = parentEntityConfig.childType;

  // Recursively remove child nodes, if any
  if (childType) {
    const childNodes = getNodesByIds(state, childType, node.childNodeIds);
    childNodes.forEach(child => {
        updatedState = deleteEntityAndChildren(updatedState, childType, child.id);
    });
  }

  // Remove self
  // Only delete the node *after* all children have been removed, because we need the childNodeIds.
  // Also, deleting bottom-up seems more intuitive.
  updatedState = {
    ...updatedState,
    [type]: parentEntityConfig.adapter.removeOne(node.id, updatedState[type])
  };

  return updatedState;
};

const getNodesByIds = (state: AppState, type: EntityType, ids: Set<string>): Entity[] => {
  const entityDictionary = getEntitiesOfType(state, type);
  const idArray = Array.from(ids);

  return idArray.map(id => entityDictionary[id])
    .filter(node => node !== undefined);
};

const getNodeById = (state: AppState, type: EntityType, id: string): Entity | undefined => {
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
