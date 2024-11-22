import { QuestionState } from './app.state';
import { EntityConfig } from './entity-config';
import { ActionCreator, createReducer, on, ReducerTypes } from '@ngrx/store';
import { addEntity, addEntitySuccess, deleteEntity } from './actions';
import { Entity } from './entity.types';

/**
 * Generic reducer for updating entity state.<br>
 * <b>Note:</b> Deletion is handled separately by {@link deleteReducer}, because of delete cascading!
 */
export const createEntityReducer = <T extends Entity>(
  config: EntityConfig<T>,
  initialState: QuestionState<T>,
  additionalOns: ReducerTypes<QuestionState<T>, ActionCreator[]>[] = []
) =>
  createReducer(initialState,
    on(addEntity, (state) => ({
      ...state,
      synced: false,
    })),

    on(addEntitySuccess, (state, {entity: addedEntity}) => {
      if (addedEntity.type === config.type) {
        // Possibly add a better type assertion here
        const entity = addedEntity as T;
        return {
          ...state,
          ...config.adapter.addOne(entity, state),
          synced: true,
        };
      }

      const parentRef = addedEntity.parent;
      if (parentRef && parentRef.type === config.type) {
        // An entity was added which is linked to this entity. Add it to the child references.
        const parent = state.entities[parentRef.id];

        if (!parent) {
          console.warn(`Parent entity not found: type='${parentRef.type}', ID='${parentRef.id}. Referenced from child entity: type='${addedEntity.type}' ID='${addedEntity.id}'`);

          state.synced = true;
          return state;
        }

        // Add child reference if it does not exist yet
        if (!parent.children.find(child => child.id === addedEntity.id)) {
          parent.children.push({ id: addedEntity.id, type: addedEntity.type });
        }

        state.synced = true;
        return state;
      }

      return state;
    }),

    on(deleteEntity, (state) => ({
      ...state,
      synced: false,
    })),

    ...additionalOns
  );
