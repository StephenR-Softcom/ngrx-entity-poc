import { EntityType } from './app.state';

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
