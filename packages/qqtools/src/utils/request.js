import got from 'got';

/**
 * 请求方法
 * @param { string } uri: 请求地址
 * @param { object } options: http.request的配置
 */
async function httpRequest(uri, options) {
  const reqOptions = { responseType: 'json' };

  Object.assign(reqOptions, options);

  const res = await got(uri, reqOptions);

  return { data: res.body, status: res.statusCode, response: res };
}

export default httpRequest;