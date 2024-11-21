import { cloneDeep } from 'lodash';
import { deleteReducer } from './delete-reducer';
import { EntityL1, EntityL2, EntityL3 } from './entity.types';
import { appInitialState, AppState } from './app.state';
import { deleteEntitySuccess } from './actions';

describe('deleteReducer', () => {
  let initialState: AppState;

  beforeEach(() => {
    initialState = cloneDeep(appInitialState);
  });

  it('should remove a node and its children', () => {
    const nodeToDelete: EntityL1 = {
      id: '1',
      type: 'entityL1',
      childNodeIds: new Set(['1-1', '1-2']),
      parentId: null,
      name: 'Node to delete',
    };
    const nodeToKeep: EntityL1 = {
      id: '2',
      type: 'entityL1',
      childNodeIds: new Set(['2-1']),
      parentId: null,
      name: 'Node to keep',
    };

    const childNodeToDelete: EntityL2 = {
      id: '1-1',
      type: 'entityL2',
      childNodeIds: new Set([]),
      parentId: '1',
      name: 'Child node',
      rank: 42,
    };
    const childNodeToDelete2: EntityL2 = {
      id: '1-2',
      type: 'entityL2',
      childNodeIds: new Set([]),
      parentId: '1',
      name: 'Child node 2',
      rank: 13,
    }
    const childNodeToKeep: EntityL2 = {
      id: '2-1',
      type: 'entityL2',
      childNodeIds: new Set([]),
      parentId: '2',
      name: 'Child node to keep',
      rank: 6,
    };

    initialState.entityL1.entities[nodeToDelete.id] = nodeToDelete;
    initialState.entityL1.entities[nodeToKeep.id] = nodeToKeep;
    initialState.entityL2.entities[childNodeToDelete.id] = childNodeToDelete;
    initialState.entityL2.entities[childNodeToDelete2.id] = childNodeToDelete2;
    initialState.entityL2.entities[childNodeToKeep.id] = childNodeToKeep;

    // when
    const action = deleteEntitySuccess({ deletedEntity: nodeToDelete });
    const newState = deleteReducer(initialState, action);

    // then - nodeToDelete and its children should be removed
    expect(newState.entityL1.entities[nodeToDelete.id]).toBeUndefined();
    expect(newState.entityL2.entities[childNodeToDelete.id]).toBeUndefined();
    expect(newState.entityL2.entities[childNodeToDelete2.id]).toBeUndefined();

    // then - nodeToKeep and its child should still be there
    expect(newState.entityL1.entities[nodeToKeep.id]).toBeDefined();
    expect(newState.entityL2.entities[childNodeToKeep.id]).toBeDefined();
  });

  it('should handle deleting a node without children', () => {
    const nodeToDelete: EntityL1 = {
      id: '1',
      type: 'entityL1',
      childNodeIds: new Set([]),
      parentId: null,
      name: 'Node to delete',
    };

    initialState.entityL1.entities['1'] = nodeToDelete;

    const action = deleteEntitySuccess({ deletedEntity: nodeToDelete });
    const newState = deleteReducer(initialState, action);

    expect(newState.entityL1.entities['1']).toBeUndefined();
  });

  it('should remove a node and its children up to 3 levels deep', () => {
    const nodeToDelete: EntityL1 = {
      id: '1',
      type: 'entityL1',
      childNodeIds: new Set(['1-1']),
      parentId: null,
      name: 'Node to delete',
    };
    const childNodeToDelete: EntityL2 = {
      id: '1-1',
      type: 'entityL2',
      childNodeIds: new Set(['1-1-1']),
      parentId: '1',
      name: 'Child node',
      rank: 42,
    };
    const grandChildNodeToDelete: EntityL3 = {
      id: '1-1-1',
      type: 'entityL3',
      childNodeIds: new Set([]),
      parentId: '1-1',
      name: 'Grandchild node',
      date: '2025-01-01',
    };

    const nodeToKeep: EntityL1 = {
      id: '2',
      type: 'entityL1',
      childNodeIds: new Set([]),
      parentId: null,
      name: 'Node to keep',
    };

    initialState.entityL1.entities[nodeToDelete.id] = nodeToDelete;
    initialState.entityL2.entities[childNodeToDelete.id] = childNodeToDelete;
    initialState.entityL3.entities[grandChildNodeToDelete.id] = grandChildNodeToDelete;
    initialState.entityL1.entities[nodeToKeep.id] = nodeToKeep;

    const action = deleteEntitySuccess({ deletedEntity: nodeToDelete });
    const newState = deleteReducer(initialState, action);

    // then - nodeToDelete and its children should be removed
    expect(newState.entityL1.entities[nodeToDelete.id]).toBeUndefined();
    expect(newState.entityL2.entities[childNodeToDelete.id]).toBeUndefined();
    expect(newState.entityL3.entities[grandChildNodeToDelete.id]).toBeUndefined();

    // then - nodeToKeep should still be there
    expect(newState.entityL1.entities[nodeToKeep.id]).toBeDefined();
  });

  it('should handle deleting a node with an invalid child ID', () => {
    const nodeToDelete: EntityL1 = {
      id: '1',
      type: 'entityL1',
      childNodeIds: new Set(['1-1']),
      parentId: null,
      name: 'Node to delete',
    };

    initialState.entityL1.entities[nodeToDelete.id] = nodeToDelete;

    // when
    const action = deleteEntitySuccess({ deletedEntity: nodeToDelete });
    const newState = deleteReducer(initialState, action);

    // then - nodeToDelete is deleted. No exception should be thrown.
    expect(newState.entityL1.entities[nodeToDelete.id]).toBeUndefined();
  });

  // test if the childIds of the parent node are updated when a node is deleted
  // make sure the parentNode has 2 children. Delete one of the children.
  // expect the parentNode to have only 1 child
  it('should update the childNodeIds of the parent node when a node is deleted', () => {
    const parentNode: EntityL1 = {
      id: '1',
      type: 'entityL1',
      childNodeIds: new Set(['1-1', '1-2']),
      parentId: null,
      name: 'Node to delete',
    };
    const childNodeToDelete: EntityL2 = {
      id: '1-1',
      type: 'entityL2',
      childNodeIds: new Set([]),
      parentId: '1',
      name: 'Child node',
      rank: 42,
    };
    const childNodeToKeep: EntityL2 = {
      id: '1-2',
      type: 'entityL2',
      childNodeIds: new Set([]),
      parentId: '1',
      name: 'Child node to keep',
      rank: 42,
    };

    initialState.entityL1.entities[parentNode.id] = parentNode;
    initialState.entityL2.entities[childNodeToDelete.id] = childNodeToDelete;
    initialState.entityL2.entities[childNodeToKeep.id] = childNodeToKeep;

    // when
    const action = deleteEntitySuccess({deletedEntity: childNodeToDelete});
    const newState = deleteReducer(initialState, action);

    // then - ID of childNodeToDelete should be removed from the childNodeIds of parentNode
    const parentNodeUpdated = newState.entityL1.entities[parentNode.id];
    expect(parentNodeUpdated).toBeDefined();
    expect(parentNodeUpdated?.childNodeIds).toEqual(new Set([childNodeToKeep.id]));
  });

});
