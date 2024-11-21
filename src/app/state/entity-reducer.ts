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
      } else if (addedEntity.type === config.childType && addedEntity.parentId) {
        // A child type entity was added - add the child entity ID to this entity's IDs
        const entity = state.entities[addedEntity.parentId];

        if (!entity) {
          console.warn(`Parent entity not found with type '${config.type}' and ID '${addedEntity.parentId}. Referenced from child entity with ID '${addedEntity.id}'`);
          return {
            ...state,
            synced: true,
          };
        }

        const updatedChildNodeIds: Set<string> = new Set(entity.childNodeIds).add(addedEntity.id);

        // TODO not sure why this assertion is needed, as T extends Entity, which contains childNodeIds
        const changes: Partial<T> = { childNodeIds: updatedChildNodeIds } as Partial<T>;
        return {
          ...state,
          ...config.adapter.updateOne({
            id: addedEntity.parentId,
            changes,
          }, state)
        };
      }
      return state;
    }),

    on(deleteEntity, (state) => ({
      ...state,
      synced: false,
    })),

    ...additionalOns
  );
