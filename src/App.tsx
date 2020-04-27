import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Layout } from 'antd';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

import { FileDetail } from './components/FileDetail';
import { FileTree } from './components/FileTree';

import './App.scss';

const client = new ApolloClient({
  uri: 'https://react-test.atlasconsulting.cz/graphql',
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Layout style={{ minHeight: '100vh' }}>
          <Layout.Sider theme="light">
            <FileTree />
          </Layout.Sider>
          <Layout.Content style={{ margin: '0 16px' }}>
            <Router>
              <Switch>
                <Route path="/:fileId">
                  <FileDetail />
                </Route>
              </Switch>
            </Router>
          </Layout.Content>
        </Layout>
      </div>
    </ApolloProvider>
  );
}

export default App;
