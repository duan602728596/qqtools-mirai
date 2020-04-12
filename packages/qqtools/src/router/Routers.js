import React from 'react';
import { useRoutes } from 'react-router-dom';
import asyncModule from './asyncModule';
import Index from '../pages/Index/index';

const Options = asyncModule(() => import(/* webpackChunkName: 'options' */ '../pages/Options/index'));

function Routers(props) {
  const routes = useRoutes([
    { path: '/', element: <Index /> },
    { path: 'Options/*', element: <Options /> }
  ]);

  return routes;
}

export default Routers;