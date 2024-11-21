import { EntityType } from './app.state';

export interface Entity {
  id: string;
  parentId: string | null;
  type: EntityType;
  childNodeIds: Set<string>;

  name: string;
}

export interface EntityL1 extends Entity {

}

export interface EntityL2 extends Entity {
  rank: number;
}

export interface EntityL3 extends Entity {
  date: string;
}
