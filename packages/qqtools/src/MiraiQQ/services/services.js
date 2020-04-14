import request from '../../utils/request';

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
 * TODO: 会出现发送错误的提示（https://github.com/mamoe/mirai-api-http/issues/51）
 * @param { int } groupNumber: 群号
 * @param { int } port: 端口号
 * @param { string } session
 * @param { string } msg: 发送信息
 */
export function requestSendGroupMessage(groupNumber, port, session, msg) {
  return request(`http://localhost:${ port }/sendGroupMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    json: {
      sessionKey: session,
      target: groupNumber,
      messageChain: [{ type: 'Plain', text: msg }]
    }
  });
}