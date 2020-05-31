/* bilibili配置 */
export default function($formItemProps) {
  return {
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
            },
            atAll: {
              id: '$root/properties/bilibili/properties/bilibiliLive/items/properties/atAll',
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