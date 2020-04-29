import { ItemType, ListItem } from '../graphql/types';

export const toTreeNode = (nodes: ListItem[]) => {
  return nodes.map(node => ({
    title: node.name,
    key: node.id,
    isLeaf: node.type === ItemType.File,
    selectable: node.type === ItemType.File,
  }));
}
