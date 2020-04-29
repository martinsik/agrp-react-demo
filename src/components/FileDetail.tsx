import React from 'react';
import { Row, Col, Spin } from 'antd';

import { File, useGetFileQuery } from '../graphql/types';

import styles from './FileDetail.module.scss';

export const FileDetail: React.FC<{ fileDetail: File }> = ({ fileDetail }) => {
  return (
    <Row justify="center" className={styles.FileDetail}>
      <Col span={ 12 }>
        <h1>{ fileDetail.name }</h1>
        { fileDetail.text }
      </Col>
    </Row>
  );
}

export const FileDetailContainer: React.FC<{ fileId: string }> = ({ fileId }) => {
  const { loading, data } = useGetFileQuery({
    variables: {
      id: fileId,
    },
  });

  if (loading || !data) {
    return <Spin/>;
  }

  return (
    <>
      <FileDetail fileDetail={ data.getFile }/>
    </>
  );
}
