import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { Link } from 'react-router-dom';
import { Table, Button, Select, Space, message, Popconfirm } from 'antd';
import {
  RollbackOutlined as IconRollbackOutlined,
  QqOutlined as IconQqOutlined,
  LogoutOutlined as IconLogoutOutlined
} from '@ant-design/icons';
import { findIndex } from 'lodash-es';
import style from './index.sass';
import { queryQqOptions, setLoginList } from './models/models';
import MiraiQQ from '../../MiraiQQ/MiraiQQ';

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
  const [optionId, setOptionId] = useState(undefined);

  // 退出登陆
  async function handleLogoutQQClick(item, event) {
    const index = findIndex(loginList, (o) => o.id === item.id);

    if (index >= 0) {
      const result = await loginList[index].destroy();

      if (result) {
        loginList.splice(index, 1);
        loginList |> setLoginList |> dispatch;
        message.success('成功退出。');
      } else {
        message.error('退出失败！');
      }
    }
  }

  // 初始化
  async function qqLogin(option) {
    const miraiQQ = new MiraiQQ({
      id: option.id,
      config: option.value
    });
    const result = await miraiQQ.init();

    if (result) {
      loginList.push(miraiQQ);
      loginList |> setLoginList |> dispatch;
    }
  }

  // 登陆
  function handleLoginQQClick(event) {
    const index = findIndex(qqOptions, (o) => o.id === optionId);

    if (index < 0) {
      return message.warn('请选择一个配置文件。');
    }

    const option = qqOptions[index];
    const index1 = findIndex(loginList, (o) => o.id === optionId);

    if (index1 >= 0) {
      return message.warn('该配置已经登陆。');
    }

    qqLogin(option);
  }

  // 选择id
  function handleOptionIdSelect(value, option) {
    setOptionId(value);
  }

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
          <Select className={ style.loginSelect }
            placeholder="选择登陆的配置文件"
            value={ optionId }
            onSelect={ handleOptionIdSelect }
          >
            { loginOptionsSelectRender() }
          </Select>
          <Button.Group>
            <Button type="primary" icon={ <IconQqOutlined /> } onClick={ handleLoginQQClick }>登陆</Button>
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
      dataIndex: ['config', 'basic', 'configName']
    },
    {
      title: 'QQ号',
      dataIndex: ['config', 'basic', 'qqNumber']
    },
    {
      title: '群号',
      dataIndex: ['config', 'basic', 'groupNumber']
    },
    {
      title: '操作',
      key: 'handle',
      width: '145px',
      render: (value, record, index) => {
        return (
          <Popconfirm title="确定要退出登陆吗？"
            onConfirm={ (event) => handleLogoutQQClick(record, event) }
          >
            <Button type="primary" danger={ true } icon={ <IconLogoutOutlined /> }>退出登陆</Button>
          </Popconfirm>
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