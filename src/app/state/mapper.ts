import { EntityDto, EntityL1Dto, EntityL2Dto, EntityL3Dto, EntityL3OtherDto } from '../model/dto';
import { Entity, EntityL1, EntityL2, EntityL3, EntityL3Other, EntityRef, entityTypeByString } from './entity.types';

/**
 * Type signature for mapping a DTO to an entity.
 */
type EntityMapper<D extends EntityDto, E extends Entity> =  (dto: D, parentRef: EntityRef | null) => E | undefined;

const mapDtoToEntity = (dto: EntityDto, parentRef: EntityRef | null): Entity | undefined => {
  const entityType = entityTypeByString.get(dto.dtype);
  if (!entityType) {
    return undefined;
  }
  const childRefs = extractChildRefs(dto);
  return {
    id: dto.id,
    parent: parentRef,
    type: entityType,
    children: childRefs,
    name: dto.name,
  };
};

const extractChildRefs = (dto: EntityDto): EntityRef[] =>
  dto.childNodes
    .map(child => ({ child, type: entityTypeByString.get(child.dtype) }))
    .filter(({ type }) => type !== undefined)
    .map(({ child, type }) => ({ id: child.id, type: type! }));

const mapDtoToEntityL1: EntityMapper<EntityL1Dto, EntityL1> = (dto: EntityL1Dto): Entity | undefined => mapDtoToEntity(dto, null);

const mapDtoToEntityL2: EntityMapper<EntityL2Dto, EntityL2> = (dto: EntityL2Dto, parentRef: EntityRef | null): EntityL2 | undefined => {
  const entityBase = mapDtoToEntity(dto, parentRef);
  return entityBase ? {
    ...entityBase,
    rank: dto.rank,
  } : undefined;
};

const mapDtoToEntityL3: EntityMapper<EntityL3Dto, EntityL3> = (dto: EntityL3Dto, parentRef: EntityRef | null): EntityL3 | undefined => {
  const entityBase = mapDtoToEntity(dto, parentRef);
  return entityBase ? {
    ...entityBase,
    date: dto.date,
  } : undefined;
}

const mapDtoToEntityL3Other: EntityMapper<EntityL3OtherDto, EntityL3Other> = (dto: EntityL3OtherDto, parentRef: EntityRef | null): EntityL3Other | undefined => {
  const entityBase = mapDtoToEntity(dto, parentRef);
  return entityBase ? {
    ...entityBase,
    comment: dto.comment,
  } : undefined;
}

export const mapDtoToEntityByType = (dto: EntityDto, parentRef: EntityRef | null): Entity | undefined => {
  switch (dto.dtype) {
    case 'entityL1':
      return mapDtoToEntityL1(dto as EntityL1Dto, null);
    case 'entityL2':
      return mapDtoToEntityL2(dto as EntityL2Dto, parentRef);
    case 'entityL3':
      return mapDtoToEntityL3(dto as EntityL3Dto, parentRef);
    case 'entityL3Other':
      return mapDtoToEntityL3Other(dto as EntityL3OtherDto, parentRef);
  }
  console.warn(`Could not map entity DTO to entity. Unknown dtype: '${dto.dtype}'`);
  return undefined;
};
