import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Space } from 'antd';
import { RollbackOutlined as IconRollbackOutlined } from '@ant-design/icons';
import style from './index.sass';

function Index(props) {
  // 渲染表格标题
  function titleRender() {
    return (
      <div>
        <Space>
          <Link to="../">
            <Button icon={ <IconRollbackOutlined /> }>返回</Button>
          </Link>
        </Space>
      </div>
    );
  }

  return (
    <div className={ style.main }>
      <Table title={ titleRender } />
    </div>
  );
}

export default Index;