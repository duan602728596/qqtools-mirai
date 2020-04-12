import React from 'react';
import { useRoutes } from 'react-router-dom';
import loadModels from '../../store/loadModels';
import models from './models/models';
import style from './index.sass';
import Options from './Options';
import Add from './Add/Add';

function Index(props) {
  const routes = useRoutes([
    { path: '/', element: <Options /> },
    { path: 'Add', element: <Add /> },
    { path: 'Add/:id', element: <Add /> }
  ]);

  return <div className={ style.main }>{ routes }</div>;
}

export default loadModels(models)(Index);