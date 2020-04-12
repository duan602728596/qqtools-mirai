import { createAction, handleActions } from 'redux-actions';
import { fromJS, List } from 'immutable';
import { db } from '../../../utils/dbInit';
import config from '../../../utils/config';

const { objectStore } = config.indexedDB;
const optionsName = objectStore[0].name;
const initData = {
  qqOptions: [] // qq配置列表
};

export const saveQqOption = db.putAction({ objectStoreName: optionsName });       // 保存数据
export const getQQOptionById = db.getAction({ objectStoreName: optionsName });    // 获取单条数据
export const deleteQQOptionById = db.getAction({ objectStoreName: optionsName }); // 删除单条数据
export const setQqOptions = createAction('options/qq配置列表');
export const queryQqOptions = db.cursorAction({
  objectStoreName: optionsName,
  successAction: setQqOptions
});

export default {
  options: handleActions({
    [setQqOptions]($$state, action) {
      return $$state.set('qqOptions', List(action.payload.result));
    }
  }, fromJS(initData))
};