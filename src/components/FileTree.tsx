import React, { useState } from 'react';
import { Spin, Tree } from 'antd';
import { ApolloClient } from 'apollo-boost';
import { ApolloConsumer } from '@apollo/react-hooks';
import cloneDeep from 'lodash/cloneDeep';

import { GetListDocument, useGetListQuery } from '../graphql/types';
import { toTreeNode } from '../utils/toTreeNode';
import { dfsTree } from '../utils/dfsTree';

const Component: React.FC<{ apollo: ApolloClient<any> }> = ({ apollo }) => {
  const { loading, error, data } = useGetListQuery();
  const [ treeData, setTreeData ] = useState<any>(null);

  // console.log(data, treeData);

  if (loading || !data) {
    return <Spin/>;
  }

  if (!treeData) {
    setTreeData(toTreeNode(data));
  }

  const onLoadData: any = (event: any) => {
    if (event.children) {
      return Promise.resolve();
    }

    return apollo
      .query({
        query: GetListDocument,
        variables: {
          id: event.key,
        }
      })
      .then(result => {
        console.log(event.key, treeData, result.data.getList);
        const node = dfsTree(treeData, event.key);
        node!.children = toTreeNode(result.data);
        setTreeData(cloneDeep(treeData));
      });
  }
  //
  // const onSelect = (keys: any, event: any) => {
  //   console.log('Trigger Select', keys, event);
  // };

  return (
      <Tree.DirectoryTree
          loadData={ onLoadData }
          // onSelect={ onSelect }
          // onExpand={onExpand}
          treeData={ treeData }
      />
  );
}

export const FileTree: React.FC<{}> = () => {
  return (
    <ApolloConsumer>
      { apollo => <Component apollo={apollo} /> }
    </ApolloConsumer>
  );
}
