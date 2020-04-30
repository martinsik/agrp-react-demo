import { NodeDetail } from './NodeDetail';
import { TreeNode } from './TreeNode';

export enum CacheActionTypes {
  Tabs,
  FileTree,
}

export interface CacheActions {
  type: CacheActionTypes;
  payload: any;
}

export interface CachedPage {
  tabs: {
    [key: string]: NodeDetail;
  };
  fileTree: TreeNode[];
}
