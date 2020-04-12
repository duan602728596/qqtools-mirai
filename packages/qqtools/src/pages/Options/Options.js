import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { Link } from 'react-router-dom';
import { Table, Button, Popconfirm, message } from 'antd';
import {
  ControlFilled as IconControlFilled,
  RollbackOutlined as IconRollbackOutlined,
  EditFilled as IconEditFilled,
  DeleteFilled as IconDeleteFilled
} from '@ant-design/icons';
import { findIndex } from 'lodash-es';
import { queryQqOptions, deleteQQOptionById, setQqOptions } from './models/models';

/* state */
const state = createStructuredSelector({
  qqOptions: createSelector(
    ({ options: $$options }) => $$options?.get?.('qqOptions'),
    ($$data) => $$data?.toJS?.() ?? []
  )
});

/* 配置列表 */
function Options(props) {
  const { qqOptions } = useSelector(state);
  const dispatch = useDispatch();

  // 删除配置
  async function handleDeleteByIdClick(item, event) {
    await dispatch(deleteQQOptionById({ query: item.id }));

    const index = findIndex(qqOptions, (o) => o.id === item.id);

    qqOptions.splice(index, 1);
    ({ result: qqOptions })
      |> setQqOptions
      |> dispatch;
    message.success('成功删除配置！');
  }

  // 渲染表格标题
  function titleRender() {
    return (
      <Button.Group>
        <Link to="Add">
          <Button type="primary" icon={ <IconControlFilled /> }>添加新配置</Button>
        </Link>
        <Link to="../">
          <Button icon={ <IconRollbackOutlined /> }>返回</Button>
        </Link>
      </Button.Group>
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
        return (
          <Button.Group>
            <Link to={ `Add/${ record.id }` }>
              <Button icon={ <IconEditFilled /> }>修改</Button>
            </Link>
            <Popconfirm title="确定要删除配置吗？" onConfirm={ (event) => handleDeleteByIdClick(record, event) }>
              <Button type="primary" danger={ true } icon={ <IconDeleteFilled /> }>删除</Button>
            </Popconfirm>
          </Button.Group>
        );
      }
    }
  ];

  useEffect(function() {
    ({ query: { indexName: 'time' } })
      |> queryQqOptions
      |> dispatch;
  }, []);

  return (
    <Table columns={ columns }
      dataSource={ qqOptions }
      title={ titleRender }
      rowKey="id"
    />
  );
}

export default Options;