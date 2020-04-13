import request from '../../utils/request';

/**
 * 根据authKey获取session
 * @param { number } port: 端口号
 * @param { String } authKey: 配置的authKey
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
 * @param { String } session
 */
export function requestVerify(qq, port, session) {
  return request(`http://localhost:${ port }/verify`, {
    method: 'POST',
    json: { qq, 'sessionKey': session }
  });
}

/**
 * 释放session
 * @param { int } qq: qq号
 * @param { int } port: 端口号
 * @param { String } session
 */
export function requestRelease(qq, port, session) {
  return request(`http://localhost:${ port }/release`, {
    method: 'POST',
    json: { qq, 'sessionKey': session }
  });
}