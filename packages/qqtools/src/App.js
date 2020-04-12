import React from 'react';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale-provider/zh_CN';
import { hot } from '@sweet-milktea/milktea/react-hot-loader/root';
import { storeFactory } from './store/store';
import Routers from './router/Routers';
import dbInit from './utils/dbInit';

dbInit();

/* 热替换 */
function App(props) {
  return (
    <Provider store={ storeFactory() }>
      <ConfigProvider locale={ zhCN }>
        <HashRouter>
          <Routers />
        </HashRouter>
      </ConfigProvider>
    </Provider>
  );
}

export default hot(App);