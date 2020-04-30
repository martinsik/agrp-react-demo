import React from 'react';
import { Row, Col, Spin } from 'antd';

import { File, useGetFileQuery } from '../graphql/types';

import styles from './FileDetail.module.scss';
import { NodeDetail } from '../types';

export const FileDetail: React.FC<{ file: File }> = ({ file }) => {
  return (
    <Row justify="center" className={styles.FileDetail}>
      <Col span={ 12 }>
        <h1>{ file.name }</h1>
        { file.text }
      </Col>
    </Row>
  );
}

export const FileDetailContainer: React.FC<{ fileDetail: NodeDetail }> = ({ fileDetail }) => {
  const { loading, data } = useGetFileQuery({
    variables: {
      id: fileDetail.key,
    },
  });

  if (loading || !data) {
    return <Spin/>;
  }

  return <FileDetail file={ data.getFile }/>;
}
