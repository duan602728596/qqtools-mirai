import style from '../add.sass';
import basic from './basic';
import bilibili from './bilibili';
import weibo from './weibo';
import welcome from './welcome';

export const $formItemProps = { className: style.formItem };
export const $formItemProps1 = { className: style.formItem1 };

const schema = {
  id: '$root',
  type: 'object',
  title: '机器人功能配置',
  properties: {
    basic: basic($formItemProps),
    bilibili: bilibili($formItemProps),
    weibo: weibo($formItemProps),
    welcome: welcome($formItemProps1)
  }
};

export default schema;