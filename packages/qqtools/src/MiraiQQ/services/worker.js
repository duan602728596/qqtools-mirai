import axios from 'axios';

/**
 * 获取直播间的信息，包括真实id、直播状态等
 * @param { string } id: 直播间id
 */
export function requestRoomInfo(id) {
  return axios.get(`https://api.live.bilibili.com/room/v1/Room/room_init?id=${ id }`);
}