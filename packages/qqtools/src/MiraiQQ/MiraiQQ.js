import { message } from 'antd';
import { requestAuth, requestVerify, requestRelease } from './services/services';

/* qq程序 */
class MiraiQQ {
  constructor({ id, config }) {
    this.id = id;              // 判断配置是否登陆
    this.config = config;      // QQ配置
    this.eventSocket = null;   // 事件的socket实例
    this.messageSocket = null; // 监听信息的socket实例
    this.session = null;       // session
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

  // 项目初始化
  async init() {
    try {
      const result = await this.getSession();

      return true;
    } catch (err) {
      console.error(err);

      return false;
    }
  }

  // 项目销毁
  async destroy() {
    const { basic } = this.config;
    const { data } = await requestRelease(basic.qqNumber, basic.port, this.session);

    return data.code === 0;
  }
}

export default MiraiQQ;