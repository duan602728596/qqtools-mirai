import { shell } from 'electron';

/**
 * 使用默认浏览器打开网址
 * @param { string } uri: 网址
 */
export function openExternal(uri) {
  return function(event) {
    shell.openExternal(uri);
  };
}

/**
 * 随机id
 * @param { number } len: 长度
 */
export function randomId(len) {
  const KEY = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890_-',
    keyLen = KEY.length;
  let result = '',
    index = 0;

  while (index < len) {
    result += KEY[Math.floor(Math.random() * keyLen)];

    index++;
  }

  return result;
}