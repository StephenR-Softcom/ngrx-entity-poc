import { AppState } from './app.state';

export type EntityType = keyof AppState;

// TODO can we enforce this to be updated for each new entity type?
export const entityTypeByString: Map<string, EntityType> = new Map([
  ['entityL1', 'entityL1'],
  ['entityL2', 'entityL2'],
  ['entityL3', 'entityL3'],
  ['entityL3Other', 'entityL3Other'],
]);

export interface Entity {
  id: string;
  type: EntityType;
  parent: EntityRef | null;
  children: EntityRef[];

  name: string;
}

export interface EntityL1 extends Entity {
  // No extra fields
}

export interface EntityL2 extends Entity {
  rank: number;
}

export interface EntityL3 extends Entity {
  date: string;
}

export interface EntityL3Other extends Entity {
  comment: string;
}

/**
 * Reference to another entity, which has a relationship with this entity.
 */
export interface EntityRef {
  id: string;
  type: EntityType;
}
