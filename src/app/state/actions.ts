import { createAction, props } from '@ngrx/store';
import { Entity } from './entity.types';

export const addEntity = createAction(
  'Add Entity', props<{ entity: Entity }>());
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
