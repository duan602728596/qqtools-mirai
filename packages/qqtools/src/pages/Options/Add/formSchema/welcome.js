/* 群欢迎配置 */
export default function($formItemProps) {
  return {
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
        $formItemProps
      },
      welcomeMessage: {
        id: '$root/properties/welcome/properties/welcomeMessage',
        type: 'string',
        title: '群欢迎信息',
        $componentType: 'textArea',
        $defaultValue: '欢迎 <%= qqtools: at, {{ id }} %> 入群。'
      }
    }
  };
}