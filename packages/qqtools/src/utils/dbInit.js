import IndexedDB from 'indexeddb-tools';
import IndexedDBRedux from 'indexeddb-tools-redux';
import config from './config';

const { name, version, objectStore } = config.indexedDB;

export const db = new IndexedDBRedux(name, version);

/* 初始化数据库 */
function dbInit() {
  const callback = {
    success(event) {
      this.close();
    },
    upgradeneeded(event) {
      for (const item of objectStore) {
        this.createObjectStore(
          item.name,
          item.keyPath,
          item.index.map((o) => ({ name: o, index: o }))
        );
      }
    }
  };

  IndexedDB(name, version, callback);
}

export default dbInit;