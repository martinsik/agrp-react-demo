export interface TreeNode {
  title: string;
  key: string;
  isLeaf: boolean;
  children?: TreeNode[];
}
