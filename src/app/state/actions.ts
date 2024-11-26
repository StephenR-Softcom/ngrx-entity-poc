import { createAction, props } from '@ngrx/store';
import { Entity } from './entity.types';

/**
 * Action dispatched when a new entity is added through the frontend.
 */
export const addEntity = createAction(
  'Add Entity', props<{ entity: Entity }>());

/**
 * Action dispatched when entity has been added in the backend and was successful.
 */
export const addEntitySuccess = createAction(
  'Add Entity - Success', props<{ entity: Entity }>());

export const deleteEntity = createAction(
  'Delete Entity', props<{ entity: Entity }>());

/**
 * Action dispatched when node has been deleted in the backend.
 */
export const deleteEntitySuccess = createAction(
  'Delete Entity - Success', props<{ deletedEntity: Entity }>());

export const resetToInitialState = createAction(
  'Reset to Initial State');
