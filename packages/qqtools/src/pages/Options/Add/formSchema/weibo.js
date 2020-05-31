/* 微博配置 */
export default function($formItemProps) {
  return {
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
            },
            atAll: {
              id: '$root/properties/weibo/properties/container/items/properties/atAll',
              type: 'boolean',
              title: '推送时at全体成员',
              $componentType: 'switch',
              $tableColumnHidden: true
            }
          }
        }
      }
    }
  };
}