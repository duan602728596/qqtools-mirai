import dayjs from 'dayjs';
import { orderBy } from 'lodash-es';
import { requestWeiboContainer } from './services/worker';

let id = null;            // { BigInt } 记录时间id
let config = null;        // 记录配置文件
let intervalTime = 20000; // 轮询间隔时间
let timer = null;         // 轮询定时器

/**
 * 根据created_at字段解析时间，可能出现的情况有
 *   刚刚
 *   ss秒前
 *   mm分钟前
 *   HH小时前
 *   昨天 HH:mm
 *   MM-DD
 *   YYYY-MM-DD
 * @param { string } timeStr: 字符串
 */
function timeStringParse(timeStr) {
  /**
   * 字符串为刚刚时，返回当前时间
   */
  if (timeStr === '刚刚') {
    return dayjs().valueOf();
  }

  /**
   * 当字符串为秒时，计算时间差
   */
  if (/秒(前)?/.test(timeStr)) {
    const amount = Number(timeStr.match(/[0-9]+/)[0]);
    const time = dayjs().subtract(amount, 'seconds');

    return time.valueOf();
  }

  /**
   * 当字符串为分时，计算时间差
   */
  if (/分(钟前)?/.test(timeStr)) {
    const amount = Number(timeStr.match(/[0-9]+/)[0]);
    const time = dayjs().subtract(amount, 'minutes');

    return time.valueOf();
  }

  /**
   * 当字符串为分时，计算时间差
   */
  if (/小?时前?/.test(timeStr)) {
    const amount = Number(timeStr.match(/[0-9]+/)[0]);
    const time = dayjs().subtract(amount, 'hours');

    return time.valueOf();
  }

  /**
   * 计算昨天的时间
   */
  if (/昨天/.test(timeStr)) {
    const timeArr = timeStr.match(/[0-9]+/g);
    const time = dayjs();

    const HH = Number(timeArr[0]);
    const mm = Number(timeArr[1]);

    // 调整时间
    time.minutes(mm);
    time.hours(HH);
    time.subtract(1, 'days');

    return time.valueOf();
  }

  /**
   * 计算日期
   */
  if (/^[0-9]{1,2}-[0-9]{1,2}$/.test(timeStr)) {
    const timeArr = timeStr.match(/[0-9]+/g);
    const time = dayjs();

    const MM = Number(timeArr[0] - 1);
    const DD = Number(timeArr[1]);

    time.date(DD);
    time.month(MM);

    return time.valueOf();
  }

  /**
   * 日期中包含年份的
   */
  if (/^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$/.test(timeStr)) {
    const timeArr = timeStr.match(/[0-9]+/g);
    const time = dayjs();

    const YYYY = Number(timeArr[0]);
    const MM = Number(timeArr[1] - 1);
    const DD = Number(timeArr[2]);

    time.date(DD);
    time.month(MM);
    time.year(YYYY);

    return time.valueOf();
  }

  /**
   * 不返回任何数据
   */
  return undefined;
}

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
      return Object.assign(item, { _time: timeStringParse(item.mblog.created_at) });
    }),
  ['_time'], ['asc']);
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