import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Typography, List } from 'antd';
import style from './index.sass';
import { openExternal } from '../../utils/utils';

const routers = [
  { path: 'Login', name: '机器人登陆' },
  { path: 'Options', name: '机器人配置' }
];

/* 首页导航 */
function Index(props) {
  // 渲染
  function routersItemRender(item) {
    return (
      <List.Item key={ item.name }>
        <Link to={ item.path }>{ item.name }</Link>
      </List.Item>
    );
  }

  return (
    <Fragment>
      <Typography className={ style.main }>
        <Typography.Title level={ 2 }>qqtools-mirai</Typography.Title>
        <Typography.Paragraph>
          基于
          <a role="button" onClick={ openExternal('https://github.com/mamoe/mirai') }>mirai</a>
          和
          <a role="button" onClick={ openExternal('https://github.com/mamoe/mirai-api-http') }>mirai-api-http</a>
          的QQ机器人客户端。
        </Typography.Paragraph>
      </Typography>
      <List className={ style.list } bordered={ true } dataSource={ routers } renderItem={ routersItemRender } />
    </Fragment>
  );
}

export default Index;