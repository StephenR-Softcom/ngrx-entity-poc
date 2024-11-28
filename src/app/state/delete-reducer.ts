import { createReducer, on } from '@ngrx/store';
import { appInitialState, AppState } from './app.state';
import { entityConfig } from './entity-config';
import { deleteEntitySuccess } from './actions';
import { Entity } from './entity.types';
import { getEntityByTypeAndId } from './entity-utils';

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
  // Only delete the node *after* all children have been removed, because we need the child references.
  // Also, deleting bottom-up seems more intuitive.

  const thisEntityConfig = entityConfig.get(entity.type);

  const entitySubState = updatedState[entity.type];
  updatedState = {
    ...updatedState,
    [entity.type]: thisEntityConfig.adapter.removeOne(entity.id, entitySubState)
  };

  return updatedState;
};

