import url from 'url';
import React, { Fragment, useState } from 'react';
import { Input, Space, Button, message } from 'antd';
import { SearchOutlined as IconSearchOutlined, CopyOutlined as IconCopyOutlined } from '@ant-design/icons';
import style from './bilibiliLiveIdSearch.sass';
import { requestRoomInfo } from '../services/services';

/* b站直播间真实id查询 */
function BilibiliLiveIdSearch(props) {
  const [liveUri, setLiveUri] = useState(undefined), // 直播间地址
    [liveId, setLiveId] = useState(undefined);       // 直播间查询结果

  // 获取真实id
  async function handleGetLiveIdClick(event) {
    try {
      const urlParseResult = new url.URL(liveUri);

      if (urlParseResult.host !== 'live.bilibili.com') {
        return message.warn('直播间地址错误！请输入有效的bilibili直播间地址。');
      }

      const urlArr = liveUri.split(/\//g),
        id = urlArr[urlArr.length - 1];
      const res = await requestRoomInfo(id);

      setLiveId(res.data.data.room_id.toString());
    } catch (err) {
      message.error('直播间地址错误！');
    }
  }

  // 复制
  function handleCopyClick(event) {
    document.getElementById('bilibiliLiveIdSearch-id').select();
    document.execCommand('copy');
    message.info('ID已复制。');
  }

  // 直播间地址变化
  function handleLiveUriChange(event) {
    setLiveUri(event.target.value);
  }

  return (
    <Fragment>
      <Space className={ style.space } direction="vertical">
        <label htmlFor="bilibiliLiveIdSearch-liveUri">直播间地址：</label>
        <Input id="bilibiliLiveIdSearch-liveUri" value={ liveUri } onChange={ handleLiveUriChange } />
        <label htmlFor="bilibiliLiveIdSearch-id">直播间ID：</label>
        <Input id="bilibiliLiveIdSearch-id" value={ liveId } readOnly={ true } />
      </Space>
      <Button.Group>
        <Button type="primary" icon={ <IconSearchOutlined /> } onClick={ handleGetLiveIdClick }>获取真实ID</Button>
        <Button icon={ <IconCopyOutlined /> } onClick={ handleCopyClick }>复制</Button>
      </Button.Group>
    </Fragment>
  );
}

export default BilibiliLiveIdSearch;