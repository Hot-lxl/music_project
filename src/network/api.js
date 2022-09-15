// // 当前这个模块：用来把API进行统一管理
import requests from "./http";

// 获取轮播图接口
export const reqGetCarousel = (type) => requests.get(`/banner?type=${type}`);
// 获取推荐歌单数据
export const reqGetSongList = () => requests.get(`/personalized`)
// 获取推荐音乐数据
export const reqGetMusicList = () => requests.get(`/personalized/newsong`)
// 根据歌单id 获取歌单歌曲数据 /playlist/detail
export const reqSongDetail = (ids) => requests.get(`/playlist/detail?id=${ids}`,)
//获取音乐的url
export const reqSongUrl = (ids) => requests.get(`/song/url?id=${ids}`,)
