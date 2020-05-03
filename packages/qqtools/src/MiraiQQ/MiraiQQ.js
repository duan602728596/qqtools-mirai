import { message } from 'antd';
import nunjucks from 'nunjucks';
import BilibiliLiveWorker from 'worker-loader!./bilibiliLive.worker';
import WeiboWorker from 'worker-loader!./weibo.worker';
import {
  requestAuth,
  requestVerify,
  requestRelease,
  requestSendGroupMessage,
  requestInfoByRoom
} from './services/services';
import miraiTemplate from './function/miraiTemplate';

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
    this.weiboWorker = null;        // 微博监听
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

    // 新人入群
    if (data.type === 'MemberJoinEvent') {
      this.welcomeNewHuman(data.member.id, data.member.memberName);
    }
  };

  /**
   * 欢迎新人入群
   * @param { number } id
   * @param { string } memberName
   */
  async welcomeNewHuman(id, memberName) {
    const { basic, welcome } = this.config;

    if (!(welcome && welcome.use)) return;

    const msg = nunjucks.renderString(welcome.welcomeMessage ?? '', {
      name: memberName
    });
    const msgArr = miraiTemplate(msg, {
      qqNumber: id,
      name: memberName
    });

    await requestSendGroupMessage(basic.groupNumber, basic.port, this.session, msgArr);
  }

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
      const msg = nunjucks.renderString(
        `${ cfg.atAll ? ' ' : '' }B站直播通知：{{ name }} 在B站开启了直播。`,
        { name: cfg.name });
      const msgArr = [{ type: 'Plain', text: msg }];

      if (cfg.atAll) {
        msgArr.unshift({ type: 'AtAll', target: 0 });
      }

      await requestSendGroupMessage(basic.groupNumber, basic.port, this.session, msgArr);
    } catch (err) {
      console.error(err);
    }
  };

  // 初始化bilibili直播的webworker
  async initBilibiliWebWorker() {
    try {
      const { bilibili } = this.config;
      const { bilibiliLive, time } = bilibili;

      if (bilibiliLive && bilibiliLive.length > 0) {
        const liveConfig = bilibiliLive.filter((o) => o.use);

        if (liveConfig.length > 0) {
          const infoResult = await Promise.all(liveConfig.map((item, index) => requestInfoByRoom(item.id))); // 获取信息
          const info = infoResult.map((item, index) => item.data.data.anchor_info.base_info.uname);

          this.bilibiliLiveWorker = new BilibiliLiveWorker();
          this.bilibiliLiveWorker.addEventListener('message', this.handleBilibiliWebWorkerMessage, false);
          this.bilibiliLiveWorker.postMessage({ config: liveConfig, time, info });
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  // 微博的webworker监听
  handleWeiboWebWorkerMessage = async (event) => {
    const result = event.data.result;
    const { basic } = this.config;

    for (const item of result) {
      const msg = nunjucks.renderString(
        `${ cfg.atAll ? ' ' : '' }{{ name }} {{ time }}发送了一条微博：{{ text }}
类型：{{ type }}
地址：{{ scheme }}`, item);
      const msgArr = [{ type: 'Plain', text: msg }];

      if (item.atAll) {
        msgArr.unshift({ type: 'AtAll', target: 0 });
      }

      if (item.pics.length > 0) {
        msgArr.push({
          type: 'Image',
          url: item.pics[0]
        });
      }

      await requestSendGroupMessage(basic.groupNumber, basic.port, this.session, msgArr);
    }
  };

  // 初始化微博的webworker
  initWeiboWebWorker() {
    const { weibo } = this.config;
    const { container, time } = weibo;

    if (container && container.length > 0) {
      const containerConfig = container.filter((o) => o.use);

      if (containerConfig.length > 0) {
        this.weiboWorker = new WeiboWorker();
        this.weiboWorker.addEventListener('message', this.handleWeiboWebWorkerMessage, false);
        this.weiboWorker.postMessage({ config: containerConfig, time });
      }
    }
  }

  // 项目初始化
  async init() {
    try {
      const result = await this.getSession();

      if (!result) throw new Error('登陆失败！');

      this.initWebSocket();
      await this.initBilibiliWebWorker();
      this.initWeiboWebWorker();

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

      await requestRelease(basic.qqNumber, basic.port, this.session); // 清除sessicon

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

      if (this.weiboWorker) {
        this.weiboWorker.terminate();
        this.weiboWorker = null;
      }

      return true;
    } catch (err) {
      console.error(err);

      return false;
    }
  }
}

export default MiraiQQ;