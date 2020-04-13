import style from './add.sass';

const $formItemProps = {
  className: style.formItem
};

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
          $required: true,
          $formItemProps
        },
        qqNumber: {
          id: '$root/properties/basic/properties/qqNumber',
          type: 'number',
          title: '监听QQ号',
          $required: true,
          $formItemProps
        },
        groupNumber: {
          id: '$root/properties/basic/properties/groupNumber',
          type: 'number',
          title: '监听群号',
          $required: true,
          $formItemProps
        },
        port: {
          id: '$root/properties/basic/properties/port',
          type: 'number',
          title: 'socket端口号',
          $required: true,
          $formItemProps
        },
        authKey: {
          id: '$root/properties/basic/properties/authKey',
          type: 'string',
          title: 'authKey',
          $required: true,
          $formItemProps
        }
      }
    }
  }
};

export default schema;