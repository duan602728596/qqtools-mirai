import style from './add.sass';

const $formItemProps = { className: style.formItem },
  $formItemProps1 = { className: style.formItem1 };

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
    bilibili: {
      id: '$root/properties/bilibili',
      type: 'object',
      title: 'B站直播配置',
      description: '配置B站直播监听和推送',
      properties: {
        time: {
          id: '$root/properties/bilibili/properties/time',
          type: 'number',
          title: '轮询间隔',
          minimum: 30,
          $defaultValue: 45,
          $formItemProps
        },
        bilibiliLive: {
          id: '$root/properties/bilibili/properties/bilibiliLive',
          type: 'array',
          title: 'B站直播配置',
          description: '配置B站直播监听和推送',
          maximum: 2,
          items: {
            id: '$root/properties/bilibili/properties/bilibiliLive/items',
            type: 'object',
            title: '直播配置',
            properties: {
              name: {
                id: '$root/properties/bilibili/properties/bilibiliLive/items/properties/name',
                type: 'string',
                title: '直播间名称',
                $required: true
              },
              id: {
                id: '$root/properties/bilibili/properties/bilibiliLive/items/properties/id',
                type: 'string',
                title: '直播间ID',
                $required: true,
                $tableColumnHidden: true
              },
              use: {
                id: '$root/properties/bilibili/properties/bilibiliLive/items/properties/use',
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
    },
    weibo: {
      id: '$root/properties/weibo',
      type: 'object',
      title: '微博监听配置',
      description: '配置微博监听和推送',
      properties: {
        time: {
          id: '$root/properties/weibo/properties/time',
          type: 'number',
          title: '轮询间隔',
          minimum: 30,
          $defaultValue: 45,
          $formItemProps
        },
        container: {
          id: '$root/properties/weibo/properties/container',
          type: 'array',
          title: '微博监听配置',
          description: '配置微博监听和推送',
          maximum: 2,
          items: {
            id: '$root/properties/weibo/properties/container/items',
            type: 'object',
            title: '微博配置',
            properties: {
              name: {
                id: '$root/properties/weibo/properties/container/items/properties/name',
                type: 'string',
                title: '微博名称',
                $required: true
              },
              lfid: {
                id: '$root/properties/weibo/properties/container/items/properties/lfid',
                type: 'string',
                title: '微博lfid',
                $required: true,
                $tableColumnHidden: true
              },
              use: {
                id: '$root/properties/weibo/properties/container/items/properties/use',
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
    },
    welcome: {
      id: '$root/properties/welcome',
      type: 'object',
      title: '群欢迎功能',
      description: '群欢迎配置',
      properties: {
        use: {
          id: '$root/properties/welcome/properties/use',
          type: 'boolean',
          title: '是否开启群欢迎功能',
          $defaultValue: true,
          $formItemProps: $formItemProps1
        },
        welcomeMessage: {
          id: '$root/properties/welcome/properties/welcomeMessage',
          type: 'string',
          title: '群欢迎信息',
          $componentType: 'textArea'
        }
      }
    }
  }
};

export default schema;