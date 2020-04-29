import { TreeNode } from '../types';

export const listFolderKeys = (nodes: TreeNode[]): string[] => {
  const foundKeys: string[] = [];
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.children) {
      foundKeys.push(node.key);
      foundKeys.push(...listFolderKeys(node.children));
    }
  }
  return foundKeys;
};
