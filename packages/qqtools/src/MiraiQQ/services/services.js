import request from '../../utils/request';

/* ================== QQ登陆相关 ================== */

/**
 * 根据authKey获取session
 * @param { number } port: 端口号
 * @param { string } authKey: 配置的authKey
 */
export function requestAuth(port, authKey) {
  return request(`http://localhost:${ port }/auth`, {
    method: 'POST',
    json: { authKey }
  });
}

/**
 * session认证
 * @param { number } qq: qq号
 * @param { number } port: 端口号
 * @param { string } session
 */
export function requestVerify(qq, port, session) {
  return request(`http://localhost:${ port }/verify`, {
    method: 'POST',
    json: { qq, sessionKey: session }
  });
}

/**
 * 释放session
 * @param { int } qq: qq号
 * @param { int } port: 端口号
 * @param { string } session
 */
export function requestRelease(qq, port, session) {
  return request(`http://localhost:${ port }/release`, {
    method: 'POST',
    json: { qq, sessionKey: session }
  });
}

/**
 * 发送群消息
 * 文字消息：{ type: 'Plain', text: '' }
 * 图片消息：{ type: 'Image', url: '' }
 * At: { type: 'At', target: 123456, display: 'name' }
 * AtAll: { type: 'AtAll', target: 0 }
 * @param { int } groupNumber: 群号
 * @param { int } port: 端口号
 * @param { string } session
 * @param { string | Array<object> } msg: 发送信息
 */
export function requestSendGroupMessage(groupNumber, port, session, msg) {
  const messageChain = typeof msg === 'string' ? [{ type: 'Plain', text: msg }] : msg;

  return request(`http://localhost:${ port }/sendGroupMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    json: {
      sessionKey: session,
      target: groupNumber,
      group: groupNumber,
      messageChain
    }
  });
}

/**
 * 发送图片
 * @param { int } groupNumber: 群号
 * @param { int } port: 端口号
 * @param { string } session
 * @param { Array<string> } urls: 发送图片
 */
export function requestSendGroupImageMessage(groupNumber, port, session, urls) {
  return request(`http://localhost:${ port }/sendImageMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    json: {
      sessionKey: session,
      target: groupNumber,
      group: groupNumber,
      urls
    }
  });
}

/* ================== B站相关 ================== */

/**
 * 获取直播间的直播人信息
 * @param { string } id: 直播间id
 */
export function requestInfoByRoom(id) {
  return request(`https://api.live.bilibili.com/xlive/web-room/v1/index/getInfoByRoom?room_id=${ id }`, {
    headers: {
      Referer: `https://live.bilibili.com/${ id }`
    }
  });
}