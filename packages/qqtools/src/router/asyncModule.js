import React, { lazy, Suspense } from 'react';
import { injectReducers } from '../store/store';
import Loading from '../components/PageLoading/PageLoading';

/**
 * 异步加载、注入模块和reducer
 * @param { Function } loader: 需要异步注入的模块
 */
function asyncModule(loader) {
  const Module = lazy(loader);

  return () => (
    <Suspense fallback={ <Loading /> }>
      <Module injectReducers={ injectReducers } />
    </Suspense>
  );
}

export default asyncModule;