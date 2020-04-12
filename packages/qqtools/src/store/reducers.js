import { combineReducers } from 'redux';
import loginModels from '../pages/Login/models/models';

/* reducers */
const reducers = {
  ...loginModels
};

/* 创建reducer */
export function createReducer(asyncReducers) {
  return combineReducers({
    ...reducers,
    ...asyncReducers
  });
}