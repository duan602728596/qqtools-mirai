import { requestAuth, requestVerify } from './services/services';

/* qq程序 */
class MiraiQQ {
  constructor({ config }) {
    this.config = config;      // QQ配置
    this.eventSocket = null;   // 事件的socket实例
    this.messageSocket = null; // 监听信息的socket实例
    this.session = null;       // session
  }

  // 获取session
  async getSession() {
    const authRes = await requestAuth(this.config.port, this.config.authKey);
  }

  // 项目初始化
  async init() {
    const result = await this.getSession();
  }
}

export default MiraiQQ;