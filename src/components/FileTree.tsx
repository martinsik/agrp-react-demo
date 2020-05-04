import React, { useContext, useState } from 'react';
import { Spin, Tree } from 'antd';
import { ApolloClient } from 'apollo-boost';
import { ApolloConsumer } from '@apollo/react-hooks';
import cloneDeep from 'lodash/cloneDeep';

import { GetListDocument } from '../graphql/types';
import { toTreeNode } from '../utils/toTreeNode';
import { dfsTree } from '../utils/dfsTree';
import { CacheTreeDispatch, FileIdDispatch } from '../App';
import { CacheActionTypes, TreeNode } from '../types';
import { listFolderKeys } from '../utils/listFolderKeys';

const FileTreeContainer: React.FC<{ apollo: ApolloClient<any> }> = ({ apollo }) => {
  const [ treeData, setTreeData ] = useState<any>(null);
  const { fileId, dispatchFileId } = useContext(FileIdDispatch);
  const { cachedPage, dispatchCacheAction } = useContext(CacheTreeDispatch);
  const { fileTree } = cachedPage;

  const onLoadData: any = (selectedNode?: TreeNode) => {
    if (selectedNode?.children) {
      return Promise.resolve();
    }

    const set = nodes => {
      dispatchCacheAction({
        type: CacheActionTypes.FileTree,
        payload: nodes,
      });
      setTreeData(nodes);
    };

    return apollo
      .query({
        query: GetListDocument,
        variables: {
          id: selectedNode?.key,
        },
      })
      .then(result => {
        const nodes = result.data.getList;
        if (selectedNode) {
          const node = dfsTree(treeData, selectedNode.key);
          node!.children = toTreeNode(nodes);

          const cloned = cloneDeep(treeData);
          set(cloned);
        } else {
          set(toTreeNode(nodes));
        }
      })
      .catch(error => console.warn(error));
  }

  let defaultExpandedKeys: string[] = listFolderKeys(fileTree || []);
  if (!treeData) {
    if (fileTree) {
      setTreeData(fileTree);
    } else {
      onLoadData();
    }

    return <Spin/>;
  }

  if (fileTree) {
    defaultExpandedKeys = listFolderKeys(fileTree);
  }

  const onSelect = (keys: any, event: any) => {
    dispatchFileId(event.node.key);
  };

  const selectedKeys = fileId ? [ fileId ] : [];

  return (
    <Tree.DirectoryTree
      loadData={ onLoadData }
      onSelect={ onSelect }
      treeData={ treeData }
      defaultExpandedKeys={ defaultExpandedKeys }
      selectedKeys={ selectedKeys }
    />
  );
}

export const FileTree: React.FC<{}> = () => {
  return (
    <ApolloConsumer>
      { apollo => <FileTreeContainer apollo={ apollo }/> }
    </ApolloConsumer>
  );
}
