/**
 * 创建异步的action
 * @param { Function } func: 异步的函数
 */
function createAsyncAction(func) {
  return function(...args) {
    return function(dispatch, getState) {
      // 封装常用的函数
      const _ = {
        // 执行函数
        call(fn, ...args) {
          const [context, runFn] = Array.isArray(fn) ? fn : [undefined, fn];

          return runFn.call(context, ...args);
        },

        // 执行函数
        apply(fn, args) {
          const [context, runFn] = Array.isArray(fn) ? fn : [undefined, fn];

          return runFn.apply(context, args);
        },

        // 执行action
        put(action) {
          return dispatch(action);
        },

        // 获取值
        select() {
          return getState();
        },

        // 延迟执行
        delay(time, value) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(value);
            }, time);
          });
        }
      };

      return func.call(undefined, _, ...args);
    };
  };
}

export default createAsyncAction;