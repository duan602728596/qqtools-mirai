/**
 * 定义template模板，解析文字
 * 规则为<%= qqtools:type, xxxxxxx %>
 * type: image，解析为图片 <%= qqtools: image, https://example.com/1.jpg %>
 *       at，at人 <%= qqtools: at, 淡忘一切 %>
 *       atAll，at全体成员 <%= qqtools:atAll %>
 * @param { string } message: 信息
 * @param { number } qqNumber: qq号
 */
function miraiTemplate(message, qqNumber) {
  const msgArr = message.split('');
  const result = [];
  let cache = '';
  let type = 'Plain'; // Plain 正常的文字，Other 其他类型

  // 将文字解析成数组
  for (let i = 0, j = msgArr.length, k = j - 1; i < j; i++) {
    const item = msgArr[i];

    // 判断下一个是不是%，不是的话，解析为正常的text
    if (item === '<') {
      if (i + 2 < j && msgArr[i + 1] === '%' && msgArr[i + 2] === '=') {
        result.push({ type, text: cache });
        type = 'Other';
        cache = item;
      } else {
        cache += item;
      }
    } else if (item === '>') {
      if (msgArr[i - 1] === '%' && type === 'Other') {
        cache += item;
        result.push({ type, text: cache });
        type = 'Plain';
        cache = '';
      } else {
        cache += item;
      }
    } else if (i === k) {
      cache += item;
      result.push({ type, text: cache });
    } else {
      cache += item;
    }
  }

  // 解析数组内的Other类型，不满足条件的将会变成Plain类型
  result.forEach(function(value, index) {
    if (value.type === 'Other') {
      const formatStrArr = value.text.replace(/<%=\s*qqtools\s*:\s*/, '')
        .replace(/\s*%>/, '')
        .split(',');
      const [type, ...other] = formatStrArr;
      const str = other.join('');

      if (type === 'image') {
        value.type = 'Image';
        value.url = str;
        delete value.text;
      } else if (type === 'at') {
        value.type = 'At';
        value.target = qqNumber;
        value.display = str;
        delete value.text;
      } else if (type === 'atAll') {
        value.type = 'AtAll';
        value.target = 0;
        delete value.text;
      } else {
        value.type = 'Plain';
      }
    }
  });

  return result;
}

export default miraiTemplate;