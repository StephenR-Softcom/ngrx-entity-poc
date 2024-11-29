import { QuestionState } from './app.state';
import { EntityConfig } from './entity-config';
import { ActionCreator, createReducer, on, ReducerTypes } from '@ngrx/store';
import { addEntity, addEntitySuccess, deleteEntity } from './actions';
import { Entity } from './entity.types';

/**
 * Generic reducer for adding new entities to state.<br>
 * <b>Note:</b> Deletion is handled separately by {@link deleteReducer}, because of delete cascading!
 *
 * @param config Configuration for the entity type this reducer handles.
 * @param initialState Initial state for the entity type this reducer handles.
 * @param additionalOns (Optional) Additional action handlers to be registered.
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

    /**
     * Add an entity to the state, if it has the entity type of this reducer.
     */
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
      return state;
    }),

    /**
     * If an entity is added with a parent reference to an entity of this reducer's entity type,
     * fetch the parent entity and add a child reference for the added entity.
     */
    on(addEntitySuccess, (state, {entity: addedEntity}) => {
      const parentRef = addedEntity.parent;
      if (parentRef && parentRef.type === config.type) {
        // An entity was added which is linked to this entity. Add it to the child references.
        const parent = state.entities[parentRef.id];

        if (!parent) {
          console.warn(`Parent entity not found: type='${parentRef.type}', ID='${parentRef.id}. Referenced from child entity: type='${addedEntity.type}' ID='${addedEntity.id}'`);

          state.synced = true;
          return state;
        }

        // Add a reference to the newly added child, if it does not exist yet
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

    // Register any addition action handlers
    ...additionalOns
  );
