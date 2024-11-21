import { EntityType } from '../state/app.state';

/**
 * TreeNode is a part of a tree and includes the child nodes, not just their IDs.
 */
export interface EntityDto {
  id: string;
  parentId: string;
  type: EntityType;
  childNodes: EntityDto[];

  name: string;
}
