import { createAction, handleActions } from 'redux-actions';
import { fromJS, List } from 'immutable';

const initData = {
  loginList: [] // 已登陆的列表
};

export const setLoginList = createAction('login/已登陆列表');

export default {
  login: handleActions({
    [setLoginList]($$state, action) {
      return $$state.set('loginList', List(action.payload));
    }
  }, fromJS(initData))
};