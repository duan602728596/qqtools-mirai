import { createAction, handleActions } from 'redux-actions';
import { fromJS, List } from 'immutable';
import { db } from '../../../utils/dbInit';
import config from '../../../utils/config';

const { objectStore } = config.indexedDB;
const optionsName = objectStore[0].name;
const initData = {
  loginList: [], // 已登陆的列表
  qqOptions: [] // qq配置列表
};

export const setLoginList = createAction('login/已登陆列表');
export const setQqOptions = createAction('login/qq配置列表');
export const queryQqOptions = db.cursorAction({
  objectStoreName: optionsName,
  successAction: setQqOptions
});

export default {
  login: handleActions({
    [setLoginList]($$state, action) {
      return $$state.set('loginList', List(action.payload));
    },
    [setQqOptions]($$state, action) {
      return $$state.set('qqOptions', List(action.payload.result));
    }
  }, fromJS(initData))
};