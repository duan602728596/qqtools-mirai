import { requestRoomInfo } from './services/worker';

let status = null; // 记录状态
let config = null; // 记录配置文件
let timer = null;  // 轮询定时器

async function handleQueryTimer() {
  try {
    const results = await Promise.all(config.map((item, index) => requestRoomInfo(item.id))); // 获取状态

    results.forEach(function(value, index) {
      // 上次查询不在直播状态，但是这次直播在播放状态，说明开启了直播
      if (status && status[index] !== 1 && value.data.data.live_status === 1) {
        postMessage({ config: config[index] });
      }
    });

    status = results.map((item, index) => item.data.data.live_status); // 记录状态
  } catch (err) {
    console.error(err);
  }

  timer = setTimeout(handleQueryTimer, 45000);
}

async function init() {
  try {
    const results = await Promise.all(config.map((item, index) => requestRoomInfo(item.id))); // 获取初始状态

    status = results.map((item, index) => item.data.data.live_status); // 记录初始查询状态
  } catch (err) {
    console.error(err);
  }

  timer = setTimeout(handleQueryTimer, 45000);
}

addEventListener('message', function(event) {
  config = event.data.config;
  init();
}, false);