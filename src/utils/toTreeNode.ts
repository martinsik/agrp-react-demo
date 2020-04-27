import { GetListQuery, ItemType } from '../graphql/types';

export const toTreeNode = (sourceNodes: GetListQuery) => {
  return sourceNodes.getList.map(node => ({
    title: node.name,
    key: node.id,
    isLeaf: node.type === ItemType.File,
  }));
}
