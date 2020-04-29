import React, { useContext, useState } from 'react';
import { Spin, Tree } from 'antd';
import { ApolloClient } from 'apollo-boost';
import { ApolloConsumer } from '@apollo/react-hooks';
import cloneDeep from 'lodash/cloneDeep';

import { GetListDocument } from '../graphql/types';
import { toTreeNode } from '../utils/toTreeNode';
import { dfsTree } from '../utils/dfsTree';
import { CacheTreeDispatch, FileIdDispatch } from '../App';
import { TreeNode } from '../types';
import { listFolderKeys } from '../utils/listFolderKeys';

const Component: React.FC<{ apollo: ApolloClient<any> }> = ({ apollo }) => {
  const [ treeData, setTreeData ] = useState<any>(null);
  const { fileId, dispatchFileId } = useContext(FileIdDispatch);
  const { cachedTree, dispatchCache } = useContext(CacheTreeDispatch);

  const onLoadData: any = (selectedNode?: TreeNode) => {
    if (selectedNode?.children) {
      return Promise.resolve();
    }

    const set = nodes => {
      dispatchCache(nodes);
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

  let defaultExpandedKeys: string[] = listFolderKeys(cachedTree); 
  if (!treeData) {
    if (cachedTree) {
      setTreeData(cachedTree);
    } else {
      onLoadData();
    }

    return <Spin/>;
  }

  if (cachedTree) {
    defaultExpandedKeys = listFolderKeys(cachedTree);
  }

  const onSelect = (keys: any, event: any) => {
    dispatchFileId(event.node.key);
  };

  const selectedKeys = fileId ? [ fileId ] : [];
  console.log(treeData, selectedKeys, defaultExpandedKeys);

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

// const FileTreeConnection: React.FC<{ }> = () => {
//
// }

export const FileTree: React.FC<{}> = () => {
  return (
    <ApolloConsumer>
      { apollo => <Component apollo={ apollo }/> }
    </ApolloConsumer>
  );
}
