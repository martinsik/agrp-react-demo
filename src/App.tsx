import React, { useCallback } from 'react';
import { BrowserRouter as Router, Switch, Route, useHistory, useParams } from 'react-router-dom';
import { Layout } from 'antd';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

import { FileTree } from './components/FileTree';
import { ContentTabsContainer } from './components/ContentTabs';
import { NoFileSelected } from './components/NoFileSelected';

import './App.scss';
import styles from './App.module.scss';

const CACHE_TREE_KEY = 'cache-tree-key';
export const FileIdDispatch = React.createContext<{ fileId: string | null, dispatchFileId: (fileId: string) => void }>(null as any);
export const CacheTreeDispatch = React.createContext<{ cachedTree: any[], dispatchCache: (fileId: string) => void }>(null as any);

const client = new ApolloClient({
  uri: 'https://react-test.atlasconsulting.cz/graphql',
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="App">
          <Layout className={styles.layout}>
            <Switch>
              <Route path="/:fileId?" component={AppLayout} />
            </Switch>
          </Layout>
        </div>
      </Router>
    </ApolloProvider>
  );
}

const AppLayout = () => {
  const history = useHistory();
  const { fileId } = useParams();

  const dispatchFileId = useCallback(fileId => {
    history.push(`/${fileId}`);
  }, [ history ]);

  const dispatchCache = (tree) => {
    localStorage.setItem(CACHE_TREE_KEY, JSON.stringify(tree));
  }

  let cachedTree;
  const cached = localStorage.getItem(CACHE_TREE_KEY);
  if (cached) {
    cachedTree = JSON.parse(cached);
  }

  return (
    <FileIdDispatch.Provider value={ { fileId, dispatchFileId } }>
      <CacheTreeDispatch.Provider value={ { cachedTree, dispatchCache } }>
        <Layout.Sider theme="light" width={275}>
          <FileTree />
        </Layout.Sider>
        <Layout.Content className={styles.content}>
          {
            fileId
              ? <ContentTabsContainer />
              : <NoFileSelected />
          }
        </Layout.Content>
      </CacheTreeDispatch.Provider>
    </FileIdDispatch.Provider>
  );
}

export default App;
