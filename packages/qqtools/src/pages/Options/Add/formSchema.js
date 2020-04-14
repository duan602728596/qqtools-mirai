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
    },
    bilibiliLive: {
      id: '$root/properties/bilibiliLive',
      type: 'array',
      title: 'B站直播配置',
      description: '配置B站直播监听和推送',
      maximum: 2,
      items: {
        id: '$root/properties/bilibiliLive/items',
        type: 'object',
        title: '直播配置',
        properties: {
          name: {
            id: '$root/properties/bilibiliLive/items/properties/name',
            type: 'string',
            title: '直播间名称',
            $required: true
          },
          id: {
            id: '$root/properties/bilibiliLive/items/properties/id',
            type: 'string',
            title: '直播间ID',
            $required: true,
            $tableColumnHidden: true
          },
          msgTemplate: {
            id: '$root/properties/bilibiliLive/items/properties/msgTemplate',
            type: 'string',
            title: '推送消息模版',
            $required: true,
            $componentType: 'textArea',
            $defaultValue: '{{ name }} 在B站开启了直播。',
            $tableColumnHidden: true
          },
          use: {
            id: '$root/properties/bilibiliLive/items/properties/use',
            type: 'boolean',
            title: '开启推送',
            $defaultValue: true,
            $componentType: 'switch',
            $tableColumnHidden: true
          }
        }
      }
    }
  }
};

export default schema;