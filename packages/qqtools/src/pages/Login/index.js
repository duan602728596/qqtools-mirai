import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { Link } from 'react-router-dom';
import { Table, Button, Select, Space } from 'antd';
import { RollbackOutlined as IconRollbackOutlined, QqOutlined as IconQqOutlined } from '@ant-design/icons';
import style from './index.sass';
import { queryQqOptions } from './models/models';

/* state */
const state = createStructuredSelector({
  qqOptions: createSelector(
    ({ login: $$login }) => $$login.get('qqOptions'),
    ($$data) => $$data.toJS()
  ),
  loginList: createSelector(
    ({ login: $$login }) => $$login.get('loginList'),
    ($$data) => $$data.toJS()
  )
});

function Index(props) {
  const { qqOptions, loginList } = useSelector(state);
  const dispatch = useDispatch();

  // 渲染select
  function loginOptionsSelectRender() {
    return qqOptions.map((item, index) => {
      return <Select.Option key={ item.id } value={ item.id }>{ item.value.basic.configName }</Select.Option>;
    });
  }

  // 渲染表格标题
  function titleRender() {
    return (
      <div>
        <Space>
          <Select className={ style.loginSelect } placeholder="选择登陆的配置文件">
            { loginOptionsSelectRender() }
          </Select>
          <Button.Group>
            <Button type="primary" icon={ <IconQqOutlined /> }>登陆</Button>
            <Link to="../">
              <Button icon={ <IconRollbackOutlined /> }>返回</Button>
            </Link>
          </Button.Group>
        </Space>
      </div>
    );
  }

  const columns = [
    {
      title: '配置名称',
      dataIndex: ['value', 'basic', 'configName']
    },
    {
      title: 'QQ号',
      dataIndex: ['value', 'basic', 'qqNumber']
    },
    {
      title: '群号',
      dataIndex: ['value', 'basic', 'groupNumber']
    },
    {
      title: '操作',
      key: 'handle',
      width: '200px',
      render: (value, record, index) => {
        return <Button>登陆</Button>;
      }
    }
  ];

  useEffect(function() {
    ({ query: { indexName: 'time' } })
      |> queryQqOptions
      |> dispatch;
  }, []);

  return (
    <div className={ style.main }>
      <Table columns={ columns }
        dataSource={ loginList }
        title={ titleRender }
        rowKey="id"
      />
    </div>
  );
}

export default Index;