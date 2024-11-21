import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { addEntity, addEntitySuccess, deleteEntity, deleteEntitySuccess } from './actions';
import { map } from 'rxjs';

// @ts-ignore effects are shown "unused", but must be assigned to a variable.
export const addNode$ = createEffect(() => inject(Actions).pipe(
  ofType(addEntity),
  // Here you might perform an action to create the node via API
  map(action => addEntitySuccess({ entity: action.entity }))
), { functional: true });

// @ts-ignore effects are shown "unused", but must be assigned to a variable.
export const deleteNode$ = createEffect(() => inject(Actions).pipe(
  ofType(deleteEntity),
  // Here you might perform an action to create the node via API
  map(action => deleteEntitySuccess({ deletedEntity: action.entity }))
), { functional: true });
