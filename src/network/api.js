// // 当前这个模块：用来把API进行统一管理
import requests from "./http";

// 获取轮播图接口
export const reqGetCarousel = (type) => requests.get(`/banner?type=${type}`);
// 获取推荐歌单数据
export const reqGetSongList = () => requests.get(`/personalized`)
// 获取推荐音乐数据
export const reqGetMusicList = () => requests.get(`/personalized/newsong`)
// 根据歌单id 获取歌单歌曲数据 /playlist/detail
export const reqPlayListDetail = (ids) => requests.get(`/playlist/detail?id=${ids}`,)
//获取音乐的url
export const reqSongUrl = (ids) => requests.get(`/song/url?id=${ids}`,)
// 获取歌手数据
export const reqGetSingerList = () => requests.get(`/top/artists`, { params: { limit: 150 } })
// 获取歌手单曲
export const resGetSingerDetail = (ids) => requests.get(`/artists?id=${ids}`)
// 搜索歌曲
export const reqSearchSongs = (query, offset) => requests.get(`/search`, { params: { keywords: query, offset: offset } })
// 获取歌曲详情
export const reqSongDetail = (id) => requests.get("/song/detail", { params: { ids: id } })