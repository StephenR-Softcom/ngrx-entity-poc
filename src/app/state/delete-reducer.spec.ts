import { cloneDeep } from 'lodash';
import { deleteReducer } from './delete-reducer';
import { Entity, EntityL1, EntityL2, EntityL3, EntityRef } from './entity.types';
import { appInitialState, AppState } from './app.state';
import { deleteEntitySuccess } from './actions';

describe('deleteReducer', () => {
  let initialState: AppState;

  beforeEach(() => {
    initialState = cloneDeep(appInitialState);
  });

  it('should remove an entity and its children', () => {
    const entityToDelete: EntityL1 = {
      id: '1',
      type: 'entityL1',
      name: 'Entity to delete',
      parent: null,
      children: [
        { id: '1-1', type: 'entityL2', },
        { id: '1-2', type: 'entityL2', },
      ],
    };
    const entityToKeep: EntityL1 = {
      id: '2',
      type: 'entityL1',
      name: 'Entity to keep',
      parent: null,
      children: [
        { id: '2-1', type: 'entityL2', },
      ],
    };

    const childNodeToDelete: EntityL2 = {
      id: '1-1',
      type: 'entityL2',
      name: 'Child entity',
      parent: { id: '1', type: 'entityL1', },
      children: [],
      rank: 42,
    };
    const childNodeToDelete2: EntityL2 = {
      id: '1-2',
      type: 'entityL2',
      name: 'Child entity 2',
      parent: { id: '1', type: 'entityL1', },
      children: [],
      rank: 13,
    }
    const childNodeToKeep: EntityL2 = {
      id: '2-1',
      type: 'entityL2',
      name: 'Child entity to keep',
      parent: { id: '2', type: 'entityL1', },
      children: [],
      rank: 6,
    };

    addEntityToState(initialState, entityToDelete);
    addEntityToState(initialState, entityToKeep);
    addEntityToState(initialState, childNodeToDelete);
    addEntityToState(initialState, childNodeToDelete2);
    addEntityToState(initialState, childNodeToKeep);

    // when
    const action = deleteEntitySuccess({ deletedEntity: entityToDelete });
    const newState = deleteReducer(initialState, action);

    // then - entityToDelete and its children should be removed
    expect(newState.entityL1.entities[entityToDelete.id]).toBeUndefined();
    expect(newState.entityL2.entities[childNodeToDelete.id]).toBeUndefined();
    expect(newState.entityL2.entities[childNodeToDelete2.id]).toBeUndefined();

    // then - nodeToKeep and its child should still be there
    expect(newState.entityL1.entities[entityToKeep.id]).toBeDefined();
    expect(newState.entityL2.entities[childNodeToKeep.id]).toBeDefined();
  });

  it('should handle deleting an entity without children', () => {
    const entityToDelete: EntityL1 = {
      id: '1',
      type: 'entityL1',
      name: 'Entity to delete',
      parent: null,
      children: [],
    };

    addEntityToState(initialState, entityToDelete);

    const action = deleteEntitySuccess({ deletedEntity: entityToDelete });
    const newState = deleteReducer(initialState, action);

    expect(newState.entityL1.entities['1']).toBeUndefined();
  });

  it('should remove an entity and its children up to 3 levels deep', () => {
    const entityToDelete: EntityL1 = {
      id: '1',
      type: 'entityL1',
      name: 'Entity to delete',
      parent: null,
      children: [
        { id: '1-1', type: 'entityL2', },
      ],
    };
    const childNodeToDelete: EntityL2 = {
      id: '1-1',
      type: 'entityL2',
      name: 'Child entity',
      parent: { id: '1', type: 'entityL1', },
      children: [
        { id: '1-1-1', type: 'entityL3', },
      ],
      rank: 42,
    };
    const grandChildEntityToDelete: EntityL3 = {
      id: '1-1-1',
      type: 'entityL3',
      name: 'Grandchild entity',
      parent: { id: '1-1', type: 'entityL2', },
      children: [],
      date: '2025-01-01',
    };

    const entityToKeep: EntityL1 = {
      id: '2',
      type: 'entityL1',
      name: 'Entity to keep',
      parent: null,
      children: [],
    };

    addEntityToState(initialState, entityToDelete);
    addEntityToState(initialState, childNodeToDelete);
    addEntityToState(initialState, grandChildEntityToDelete);
    addEntityToState(initialState, entityToKeep);

    const action = deleteEntitySuccess({ deletedEntity: entityToDelete });
    const newState = deleteReducer(initialState, action);

    // then - nodeToDelete and its children should be removed
    expect(newState.entityL1.entities[entityToDelete.id]).toBeUndefined();
    expect(newState.entityL2.entities[childNodeToDelete.id]).toBeUndefined();
    expect(newState.entityL3.entities[grandChildEntityToDelete.id]).toBeUndefined();

    // then - nodeToKeep should still be there
    expect(newState.entityL1.entities[entityToKeep.id]).toBeDefined();
  });

  it('should handle deleting an entity with an invalid child ID', () => {
    const entityToDelete: EntityL1 = {
      id: '1',
      type: 'entityL1',
      name: 'Entity to delete',
      parent: null,
      children: [
        { id: '1-1', type: 'entityL2', },
      ],
    };

    addEntityToState(initialState, entityToDelete);

    // when
    const action = deleteEntitySuccess({ deletedEntity: entityToDelete });
    const newState = deleteReducer(initialState, action);

    // then - entityToDelete is deleted. No exception should be thrown.
    expect(newState.entityL1.entities[entityToDelete.id]).toBeUndefined();
  });

  /**
   * Expect that the entity is removed from the parent {@link Entity#children}.
   */
  it('should update the children of the parent node when an entity is deleted', () => {
    const parent: EntityL1 = {
      id: '1',
      type: 'entityL1',
      name: 'Entity to delete',
      parent: null,
      children: [
        { id: '1-1', type: 'entityL2', },
        { id: '1-2', type: 'entityL3', },
        { id: '1-3', type: 'entityL2', },
      ],
    };
    const childToDelete: EntityL2 = {
      id: '1-1',
      type: 'entityL2',
      name: 'Child entity',
      parent: { id: '1', type: 'entityL1', },
      children: [],
      rank: 42,
    };
    // Child with a different type
    const childToDelete2: EntityL3 = {
      id: '1-2',
      type: 'entityL2',
      name: 'Child entity 2',
      parent: { id: '1', type: 'entityL1', },
      children: [],
      date: '2025-01-01',
    }
    const childToKeep: EntityL2 = {
      id: '1-3',
      type: 'entityL2',
      name: 'Child entity to keep',
      parent: { id: '1', type: 'entityL1', },
      children: [],
      rank: 42,
    };

    addEntityToState(initialState, parent);
    addEntityToState(initialState, childToDelete);
    addEntityToState(initialState, childToDelete2);
    addEntityToState(initialState, childToKeep);

    // when
    const action = deleteEntitySuccess({deletedEntity: childToDelete});
    const newState = deleteReducer(initialState, action);

    // then - reference to childToDelete should be removed parent.children
    const parentUpdated = newState.entityL1.entities[parent.id];
    const expectedChildRefs: EntityRef[] = [
      {id: childToKeep.id, type: 'entityL2'},
      {id: childToDelete2.id, type: 'entityL3'},
    ];

    expect(parentUpdated).toBeDefined();
    expect(parentUpdated?.children).toEqual(jasmine.arrayContaining(expectedChildRefs));
  });

  it('should remove entity\'s children regardless of type, when deleting an entity', () => {
    const entityToDelete: EntityL1 = {
      id: '1',
      type: 'entityL1',
      name: 'Entity to delete',
      parent: null,
      children: [
        { id: '1-1', type: 'entityL2' },
        { id: '1-2', type: 'entityL3' },
      ],
    };
    const childNodeToDelete1: EntityL2 = {
      id: '1-1',
      type: 'entityL2',
      name: 'Child entity 1',
      parent: { id: '1', type: 'entityL1' },
      children: [],
      rank: 42,
    };
    const childNodeToDelete2: EntityL3 = {
      id: '1-2',
      type: 'entityL3',
      name: 'Child entity 2',
      parent: { id: '1', type: 'entityL1' },
      children: [],
      date: '2025-01-01',
    };

    addEntityToState(initialState, entityToDelete);
    addEntityToState(initialState, childNodeToDelete1);
    addEntityToState(initialState, childNodeToDelete2);

    const action = deleteEntitySuccess({ deletedEntity: entityToDelete });
    const newState = deleteReducer(initialState, action);

    // then - entityToDelete and its children should be removed
    expect(newState.entityL1.entities[entityToDelete.id]).toBeUndefined();
    expect(newState.entityL2.entities[childNodeToDelete1.id]).toBeUndefined();
    expect(newState.entityL3.entities[childNodeToDelete2.id]).toBeUndefined();
  });

  function addEntityToState(state: AppState, entity: Entity): void {
    state[entity.type].entities[entity.id] = entity;
  }

});
