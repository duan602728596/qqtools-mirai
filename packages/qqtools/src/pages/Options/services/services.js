import request from '../../../utils/request';

/**
 * 获取直播间的信息，包括真实id、直播状态等
 * @param { string } id: 直播间id
 */
export function requestRoomInfo(id) {
  return request(`https://api.live.bilibili.com/room/v1/Room/room_init?id=${ id }`);
}