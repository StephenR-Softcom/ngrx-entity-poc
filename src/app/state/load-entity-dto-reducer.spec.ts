import { EntityDto, EntityL2Dto, EntityL3Dto, EntityL3OtherDto } from '../model/dto';
import { loadEntityDtoReducer } from './load-entity-dto-reducer';
import { appInitialState, AppState } from './app.state';
import { loadEntitiesFromDto } from './actions';
import { cloneDeep } from 'lodash';
import { EntityL1, EntityL2, EntityL3, EntityL3Other, EntityRef } from './entity.types';

const entityL3_1: EntityL3Dto = {
  id: '3',
  name: 'Grandchild Entity 1',
  dtype: 'entityL3',
  date: '2025-01-14',
  childNodes: []
};
const entityL3Other_1: EntityL3OtherDto = {
  id: '4',
  name: 'Grandchild Entity 2',
  dtype: 'entityL3Other',
  comment: 'Some comment',
  childNodes: []
};
const entityL2_1: EntityL2Dto = {
  id: '2',
  name: 'Child Entity 1',
  dtype: 'entityL2',
  rank: 1,
  childNodes: [
    entityL3_1,
    entityL3Other_1
  ]
};
const entityL2_2: EntityL2Dto = {
  id: '5',
  name: 'Child Entity 2',
  dtype: 'entityL2',
  rank: 2,
  childNodes: []
};

const rootEntityDto: EntityDto = {
  id: '1',
  name: 'Parent Entity',
  dtype: 'entityL1',
  childNodes: [
    entityL2_1,
    entityL2_2
  ]
};

let initialState: AppState;

beforeEach(() => {
  initialState = cloneDeep(appInitialState);
});

describe('loadEntityDtoReducer', () => {
  it('should add entities from the given DTO to the state', () => {
    const action = loadEntitiesFromDto({ entityDto: rootEntityDto });
    const newState = loadEntityDtoReducer(initialState, action);

    expect(newState.entityL1).toBeDefined();
    expect(newState.entityL1.ids).toContain(rootEntityDto.id);
    expect(newState.entityL1.entities[rootEntityDto.id]).toEqual(jasmine.objectContaining({ id: rootEntityDto.id, name: rootEntityDto.name, parent: null } as Partial<EntityL1>));

    expect(newState.entityL2).toBeDefined();
    expect(newState.entityL2.ids).toContain(entityL2_1.id);
    expect(newState.entityL2.ids).toContain(entityL2_2.id);
    const entityL2_1_parentRef: EntityRef = { id: rootEntityDto.id, type: 'entityL1' };
    expect(newState.entityL2.entities[entityL2_1.id]).toEqual(jasmine.objectContaining({ id: entityL2_1.id, name: entityL2_1.name, parent: entityL2_1_parentRef, rank: 1 } as Partial<EntityL2>));
    const entityL2_2_parentRef: EntityRef = { id: rootEntityDto.id, type: 'entityL1' };
    expect(newState.entityL2.entities[entityL2_2.id]).toEqual(jasmine.objectContaining({ id: entityL2_2.id, name: entityL2_2.name, parent: entityL2_2_parentRef, rank: 2 } as Partial<EntityL2>));

    expect(newState.entityL3).toBeDefined();
    expect(newState.entityL3.ids).toContain(entityL3_1.id);
    const entityL3_1_parentRef: EntityRef = { id: entityL2_1.id, type: 'entityL2' };
    expect(newState.entityL3.entities[entityL3_1.id]).toEqual(jasmine.objectContaining({ id: entityL3_1.id, name: entityL3_1.name, parent: entityL3_1_parentRef, date: entityL3_1.date } as Partial<EntityL3>));

    expect(newState.entityL3Other).toBeDefined();
    expect(newState.entityL3Other.ids).toContain(entityL3Other_1.id);
    const entityL3Other_1_parentRef: EntityRef = { id: entityL2_1.id, type: 'entityL2' };
    expect(newState.entityL3Other.entities[entityL3Other_1.id]).toEqual(jasmine.objectContaining({ id: entityL3Other_1.id, name: entityL3Other_1.name, parent: entityL3Other_1_parentRef, comment: entityL3Other_1.comment } as Partial<EntityL3Other>));
  });

  it('should ignore DTO, if the dtype is invalid',
    () => {
      // Take a valid DTO and set an invalid data type. This should be ignored.
      const invalidDto: EntityDto = {
        ...rootEntityDto,
        dtype: 'definitelyAnInvalidType'
      };
      const action = loadEntitiesFromDto({entityDto: invalidDto});
      const newState = loadEntityDtoReducer(initialState, action);

      expect(newState).toEqual(appInitialState);
      expect(newState.entityL1.ids.length).toBe(0);
      expect(newState.entityL1.entities[invalidDto.id]).toBeUndefined();

      expect(newState.entityL2.ids.length).toBe(0);
      expect(newState.entityL3.ids.length).toBe(0);
      expect(newState.entityL3Other.ids.length).toBe(0);
    });

  it('should update existing entity with same ID', () => {
    // Add an entity to the state
    const existingEntity: EntityL1 = {
      id: rootEntityDto.id,
      name: 'Old name',
      type: 'entityL1',
      parent: null,
      children: []
    };

    initialState.entityL1 = {
      ...initialState.entityL1,
      ids: [existingEntity.id],
      entities: {
        [existingEntity.id]: existingEntity
      }
    };

    // change the name of the entity in the DTO, copying fields explicitly from existingEntry
    const updatedDto: EntityDto = {
      id: existingEntity.id,
      name: 'New name',
      dtype: 'entityL1',
      childNodes: []
    };

    const action = loadEntitiesFromDto({entityDto: updatedDto});
    const newState = loadEntityDtoReducer(initialState, action);

    expect(newState.entityL1).toBeDefined();
    expect(newState.entityL1.ids).toEqual([existingEntity.id]);
    expect(newState.entityL1.entities[existingEntity.id]).toEqual(jasmine.objectContaining({
      id: existingEntity.id, name: updatedDto.name } as Partial<EntityL1>));
  });

});
