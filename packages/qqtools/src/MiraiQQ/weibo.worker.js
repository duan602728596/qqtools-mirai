import { orderBy } from 'lodash-es';
import { requestWeiboContainer } from './services/worker';

let id = null;            // { BigInt } 记录时间id
let config = null;        // 记录配置文件
let intervalTime = 20000; // 轮询间隔时间
let timer = null;         // 轮询定时器

/**
 * 过滤信息
 * @param { Array<object> } cards: 微博信息
 */
function filterCards(cards) {
  return orderBy(cards
    .filter((o) => {
      return o.card_type === 9 && 'mblog' in o;
    })
    .map((item, index) => {
      return Object.assign(item, {
        _id: BigInt(item.mblog.id)
      });
    }),
  ['_id'], ['desc']);
}

async function handleQueryTimer() {
  try {
    const results = await Promise.all(config.map((item, index) => requestWeiboContainer(item.lfid))); // 获取初始状态
    const formatResults = results.map((item, index) => filterCards(item.data.data.cards));

    if (id === null) {
      id = formatResults.map((item, index) => {
        if (item.length > 0) {
          return BigInt(item[0].mblog.id);
        } else {
          return null;
        }
      });
    } else {
      const send = formatResults.map((item, index) => (
        item
          .filter((o) => {
            const cardId = BigInt(o.mblog.id);

            return id[index] && (cardId > id[index]);
          })
          .map((item, index) => {
            const mblog = item.mblog;

            return {
              id: BigInt(mblog.id),
              name: mblog.user.screen_name,
              type: 'retweeted_status' in item.mblog ? '转载' : '原创',
              scheme: item.scheme,
              time: mblog.created_at === '刚刚' ? mblog.created_at : ('在' + mblog.created_at),
              text: mblog.text.replace(/<[^<>]+>/g, ' '),
              pics: (mblog.pics ?? []).map((item) => item.url),
              atAll: config[index].atAll
            };
          })
      ));

      send.forEach(function(value, index) {
        if (value && value.length > 0 && id) {
          id[index] = value[0].id;
        }
      });

      postMessage({ result: send.flat() });
    }
  } catch (err) {
    console.error(err);
  }

  timer = setTimeout(handleQueryTimer, intervalTime);
}

async function init() {
  try {
    const results = await Promise.all(config.map((item, index) => requestWeiboContainer(item.lfid))); // 获取初始状态
    const formatResults = results.map((item, index) => filterCards(item.data.data.cards));

    id = formatResults.map((item, index) => {
      if (item.length > 0) {
        return BigInt(item[0].mblog.id);
      } else {
        return null;
      }
    });
  } catch (err) {
    console.error(err);
  }

  timer = setTimeout(handleQueryTimer, intervalTime);
}

addEventListener('message', function(event) {
  config = event.data.config;
  intervalTime = (event.data.time < 20 ? 20 : event.data.time) * 1000;
  init();
}, false);