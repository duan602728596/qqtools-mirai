/* 项目配置 */
const config = {
  indexedDB: {
    name: 'qqtools-mirai',
    version: 1,
    objectStore: [
      {
        name: 'qq-options',
        keyPath: 'id',
        index: ['time', 'value']
      }
    ]
  }
};

export default config;