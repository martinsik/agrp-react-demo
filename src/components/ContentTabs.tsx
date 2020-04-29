import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Spin, Menu } from 'antd';
import { useHistory } from 'react-router-dom';
import { ApolloConsumer } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-boost';
import cloneDeep from 'lodash/cloneDeep';

import { CloseCircleOutlined } from '@ant-design/icons';
import { GetFileDocument } from '../graphql/types';
import { FileDetailContainer } from './FileDetail';

import styles from './ContentTabs.module.scss';
import { FileIdDispatch } from '../App';

export interface FileTabs {
  [key: string]: string;
}

export interface ContentTabsProps {
  activeKey: string;
  openedTabs: FileTabs;
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
            { openedTabs[key] }
            <CloseCircleOutlined onClick={ (e) => handleClose(key, e) }/>
          </Menu.Item>
        )) }
      </Menu>
      <FileDetailContainer fileId={ activeKey }/>
    </div>
  );
}

const ContentTabsConnection: React.FC<{ apollo: ApolloClient<any> }> = ({ apollo }) => {
  const [ openedTabs, setOpenedTabs ] = useState<FileTabs>({});
  const { fileId } = useContext(FileIdDispatch);
  const history = useHistory();

  const fetchFile = useCallback((fileId) => {
    apollo
      .query({
        query: GetFileDocument,
        variables: {
          id: fileId,
        },
      })
      .then(result => setOpenedTabs(openedTabs => cloneDeep({ ...openedTabs, [fileId]: result.data.getFile.name })))
      .catch(error => {
        console.warn(error);
        setOpenedTabs(openedTabs => cloneDeep({ ...openedTabs, [fileId]: 'This file is broken.' }));
      });
  }, [ apollo, setOpenedTabs ]);

  useEffect(() => fetchFile(fileId), [ fileId, fetchFile ]);

  const handleSelectTab = (key: string) => {
    history.push(`/${ key }`);
  }

  const handleCloseTab = (key: string) => {
    delete openedTabs[key];
    if (key === fileId) {
      const keys = Object.keys(openedTabs);
      if (keys.length === 0) {
        history.push('/');
      } else {
        history.push(`/${ keys[0] }`);
      }
    }
    setOpenedTabs(cloneDeep(openedTabs));
  }

  if (Object.keys(openedTabs).length === 0) {
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

