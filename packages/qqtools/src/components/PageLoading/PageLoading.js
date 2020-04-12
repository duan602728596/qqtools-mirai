import React from 'react';
import style from './pageLoading.sass';

/* 异步组件加载的loading动画 */
function PageLoading(props) {
  return (
    <div className={ style.loadingBox }>
      <div className={ style.loading } />
    </div>
  );
}

export default PageLoading;