const schema = {
  id: '$root',
  type: 'object',
  title: '机器人功能配置',
  properties: {
    basic: {
      id: '$root/properties/basic',
      type: 'object',
      title: '基础配置',
      properties: {
        configName: {
          id: '$root/properties/basic/properties/configName',
          type: 'string',
          title: '配置名称',
          $required: true
        },
        qqNumber: {
          id: '$root/properties/basic/properties/qqNumber',
          type: 'number',
          title: '监听QQ号',
          $required: true
        },
        groupNumber: {
          id: '$root/properties/basic/properties/groupNumber',
          type: 'number',
          title: '监听群号',
          $required: true
        },
        port: {
          id: '$root/properties/basic/properties/port',
          type: 'number',
          title: 'socket端口号',
          $required: true
        },
        authKey: {
          id: '$root/properties/basic/properties/authKey',
          type: 'string',
          title: 'authKey',
          $required: true
        }
      }
    }
  }
};

export default schema;