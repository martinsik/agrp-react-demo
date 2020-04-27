import { TreeNode } from '../types';

export const dfsTree = (tree: TreeNode[], key): TreeNode | undefined => {
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.key === key) {
      return node;
    }

    if (node.children) {
       const found = dfsTree(node.children, key);
       if (found) {
         return found;
       }
    }
  }
};
