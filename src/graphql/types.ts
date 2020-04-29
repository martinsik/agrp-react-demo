import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
}

export interface Query {
   __typename?: 'Query';
  /** Get list of ListItem */
  getList: Array<ListItem>;
  /** Get File */
  getFile: File;
}


export interface QueryGetListArgs {
  id?: Maybe<Scalars['String']>;
}


export interface QueryGetFileArgs {
  id: Scalars['String'];
}

/** Object representing an item in hierarchy list */
export interface ListItem {
   __typename?: 'ListItem';
  id: Scalars['String'];
  name: Scalars['String'];
  type: ItemType;
}

/** Type of item */
export enum ItemType {
  File = 'FILE',
  Folder = 'FOLDER'
}

/** Object representing a file */
export interface File {
   __typename?: 'File';
  id: Scalars['String'];
  name: Scalars['String'];
  text: Scalars['String'];
}

export type GetFileQueryVariables = {
  id: Scalars['String'];
};


export type GetFileQuery = (
  { __typename?: 'Query' }
  & { getFile: (
    { __typename?: 'File' }
    & Pick<File, 'id' | 'name' | 'text'>
  ) }
);

export type GetListQueryVariables = {
  id?: Maybe<Scalars['String']>;
};


export type GetListQuery = (
  { __typename?: 'Query' }
  & { getList: Array<(
    { __typename?: 'ListItem' }
    & Pick<ListItem, 'id' | 'name' | 'type'>
  )> }
);


export const GetFileDocument = gql`
    query getFile($id: String!) {
  getFile(id: $id) {
    id
    name
    text
  }
}
    `;

/**
 * __useGetFileQuery__
 *
 * To run a query within a React component, call `useGetFileQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFileQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetFileQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetFileQuery, GetFileQueryVariables>) {
        return ApolloReactHooks.useQuery<GetFileQuery, GetFileQueryVariables>(GetFileDocument, baseOptions);
      }
export function useGetFileLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetFileQuery, GetFileQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetFileQuery, GetFileQueryVariables>(GetFileDocument, baseOptions);
        }
export type GetFileQueryHookResult = ReturnType<typeof useGetFileQuery>;
export type GetFileLazyQueryHookResult = ReturnType<typeof useGetFileLazyQuery>;
export type GetFileQueryResult = ApolloReactCommon.QueryResult<GetFileQuery, GetFileQueryVariables>;
export const GetListDocument = gql`
    query getList($id: String) {
  getList(id: $id) {
    id
    name
    type
  }
}
    `;

/**
 * __useGetListQuery__
 *
 * To run a query within a React component, call `useGetListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetListQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetListQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetListQuery, GetListQueryVariables>) {
        return ApolloReactHooks.useQuery<GetListQuery, GetListQueryVariables>(GetListDocument, baseOptions);
      }
export function useGetListLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetListQuery, GetListQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetListQuery, GetListQueryVariables>(GetListDocument, baseOptions);
        }
export type GetListQueryHookResult = ReturnType<typeof useGetListQuery>;
export type GetListLazyQueryHookResult = ReturnType<typeof useGetListLazyQuery>;
export type GetListQueryResult = ApolloReactCommon.QueryResult<GetListQuery, GetListQueryVariables>;