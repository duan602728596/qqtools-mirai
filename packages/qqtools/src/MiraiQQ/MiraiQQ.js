import { message } from 'antd';
import nunjucks from 'nunjucks';
import BilibiliLiveWorker from 'worker-loader!./bilibiliLive.worker';
import {
  requestAuth,
  requestVerify,
  requestRelease,
  requestSendGroupMessage
} from './services/services';

nunjucks.configure({
  autoescape: false
});

/* qq程序 */
class MiraiQQ {
  constructor({ id, config }) {
    this.id = id;              // 判断配置是否登陆
    this.config = config;      // QQ配置
    this.eventSocket = null;   // 事件的socket实例
    this.messageSocket = null; // 监听信息的socket实例
    this.session = null;       // session

    // 监听相关
    this.bilibiliLiveWorker = null; // B站直播监听
  }

  // 获取session
  async getSession() {
    const { basic } = this.config;
    const { data: authRes } = await requestAuth(basic.port, basic.authKey);

    if (authRes.code !== 0) {
      return message.error('登陆失败：获取session失败。');
    }

    this.session = authRes.session;

    const { data: verifyRes } = await requestVerify(basic.qqNumber, basic.port, authRes.session);

    if (verifyRes.code === 0) {
      return true;
    } else {
      message.error('登陆失败：session认证失败。');

      return false;
    }
  }

  // 信息（message）监听
  handleMsgSocketMessage = (event) => {
    const data = JSON.parse(event.data);

    console.log(data);
  };

  // 事件（event）监听
  handleEventSocketMessage = (event) => {
    const data = JSON.parse(event.data);

    console.log(data);
  };

  // 初始化websocket
  initWebSocket() {
    const { basic } = this.config;

    this.messageSocket = new WebSocket(`ws://localhost:${ basic.port }/message?sessionKey=${ this.session }`);
    this.eventSocket = new WebSocket(`ws://localhost:${ basic.port }/event?sessionKey=${ this.session }`);

    this.messageSocket.addEventListener('message', this.handleMsgSocketMessage, false);
    this.eventSocket.addEventListener('message', this.handleEventSocketMessage, false);
  }

  // bilibili直播的webworker监听
  handleBilibiliWebWorkerMessage = async (event) => {
    try {
      const cfg = event.data.config;
      const { basic } = this.config;
      const msg = nunjucks.renderString(cfg.msgTemplate, { name: cfg.name });

      await requestSendGroupMessage(basic.groupNumber, basic.port, this.session, msg);
    } catch (err) {
      console.error(err);
    }
  };

  // 初始化bilibili直播的webworker
  initBilibiliWebWorker() {
    const { bilibiliLive } = this.config;

    if (bilibiliLive && bilibiliLive.length > 0) {
      const liveConfig = bilibiliLive.filter((o) => o.use);

      if (liveConfig.length > 0) {
        this.bilibiliLiveWorker = new BilibiliLiveWorker();
        this.bilibiliLiveWorker.addEventListener('message', this.handleBilibiliWebWorkerMessage, false);
        this.bilibiliLiveWorker.postMessage({ config: liveConfig });
      }
    }
  }

  // 项目初始化
  async init() {
    try {
      const result = await this.getSession();

      if (!result) throw new Error('登陆失败！');

      this.initWebSocket();
      this.initBilibiliWebWorker();

      return true;
    } catch (err) {
      console.error(err);

      return false;
    }
  }

  // 项目销毁
  async destroy() {
    try {
      const { basic } = this.config;
      const { data } = await requestRelease(basic.qqNumber, basic.port, this.session); // 清除sessicon

      // 关闭websocket
      if (this.messageSocket) {
        this.messageSocket.close();
        this.messageSocket = null;
      }

      if (this.eventSocket) {
        this.eventSocket.close();
        this.eventSocket = null;
      }

      if (this.bilibiliLiveWorker) {
        this.bilibiliLiveWorker.terminate();
        this.bilibiliLiveWorker = null;
      }

      return true;
    } catch (err) {
      console.error(err);

      return false;
    }
  }
}

export default MiraiQQ;