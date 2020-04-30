import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Spin, Menu } from 'antd';
import { ApolloConsumer } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-boost';
import { CloseCircleOutlined } from '@ant-design/icons';
import cloneDeep from 'lodash/cloneDeep';

import { GetFileDocument } from '../graphql/types';
import { FileDetailContainer } from './FileDetail';
import { CacheTreeDispatch, FileIdDispatch } from '../App';

import styles from './ContentTabs.module.scss';
import { CacheActionTypes, NodeDetailsMap } from '../types';

export interface ContentTabsProps {
  activeKey: string;
  openedTabs: NodeDetailsMap;
  onSelectTab?: (key: string) => void,
  onCloseTab?: (key: string) => void,
}

export const ContentTabs: React.FC<ContentTabsProps> = ({ activeKey, openedTabs, onSelectTab, onCloseTab }) => {
  const handleClick = (e) => {
    if (onSelectTab) {
      onSelectTab(e.key);
    }
  };

  const handleClose = (key: string, e) => {
    e.stopPropagation();
    if (onCloseTab) {
      onCloseTab(key);
    }
  };

  const keys = Object.keys(openedTabs);

  return (
    <div className={ styles.menu }>
      <Menu onClick={ handleClick } selectedKeys={ [ activeKey ] } mode="horizontal">
        { keys.map(key => (
          <Menu.Item key={ key }>
            { openedTabs[key].title }
            <CloseCircleOutlined onClick={ (e) => handleClose(key, e) }/>
          </Menu.Item>
        )) }
      </Menu>
      <FileDetailContainer fileDetail={ openedTabs[activeKey] }/>
    </div>
  );
}

const ContentTabsConnection: React.FC<{ apollo: ApolloClient<any> }> = ({ apollo }) => {
  const [ openedTabs, setOpenedTabs ] = useState<NodeDetailsMap>({});
  const { fileId, dispatchFileId } = useContext(FileIdDispatch);
  const { cachedPage, dispatchCacheAction } = useContext(CacheTreeDispatch);

  const fetchFile = useCallback((fileId) => {
    apollo
      .query({
        query: GetFileDocument,
        variables: {
          id: fileId,
        },
      })
      .then(result => {
        const file = result.data.getFile;
        setOpenedTabs(openedTabs => {
          const cloned = cloneDeep({
            ...openedTabs,
            [fileId]: {
              key: file.id,
              title: file.name,
            },
          });
          dispatchCacheAction({
            type: CacheActionTypes.Tabs,
            payload: cloned,
          });

          return cloned;
        });
      })
      .catch(error => {
        setOpenedTabs(openedTabs => {
          const cloned = {
            ...openedTabs,
            [fileId]: {
              key: fileId,
              error: 'This file is broken.'
            },
          };
          dispatchCacheAction({
            type: CacheActionTypes.Tabs,
            payload: cloned,
          });

          return cloned;
        });
      });
  }, [ apollo, setOpenedTabs, dispatchCacheAction ]);

  const setOpenedTabsWrapper = useCallback(() => {
    console.log(cachedPage.tabs);
    if (cachedPage.tabs) {
      setOpenedTabs(cachedPage.tabs);
    }
  }, [ setOpenedTabs, cachedPage ]);

  useEffect(() => fetchFile(fileId), [ fileId, fetchFile ]);
  useEffect(() => setOpenedTabsWrapper(), [ setOpenedTabsWrapper ]);

  const handleSelectTab = (key: string) => {
    dispatchFileId(key);
  }

  const handleCloseTab = (key: string) => {
    delete openedTabs[key];
    console.log(openedTabs);
    if (key === fileId) {
      const keys = Object.keys(openedTabs);
      dispatchFileId(keys.length === 0 ? '' : keys[0]);
    }

    const cloned = cloneDeep(openedTabs);
    dispatchCacheAction({
      type: CacheActionTypes.Tabs,
      payload: cloned,
    });
    setOpenedTabs(cloned);
  }

  if (!fileId || !openedTabs[fileId]) {
    return <Spin/>;
  }

  return <ContentTabs
    activeKey={ fileId! }
    openedTabs={ openedTabs }
    onSelectTab={ handleSelectTab }
    onCloseTab={ handleCloseTab }
  />;
}

export const ContentTabsContainer: React.FC<{}> = () => {
  return (
    <ApolloConsumer>
      { apollo => <ContentTabsConnection apollo={ apollo } /> }
    </ApolloConsumer>
  );
}

