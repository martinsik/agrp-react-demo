import React  from 'react';
import { Empty } from 'antd';

export const NoFileSelected = () => {
  return (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Select file in the left menu" />
  );
}
