/*
action:处理action响应用户的操作，可以写自己的业务逻辑，也可以处理异步向服务器发送请求
 */

// 引入api
import { reqGetCarousel, reqGetSongList, reqGetMusicList } from "@/network/api"

export default {
    // 异步获取轮播图数据
    async GetCarousel({ commit }, type) {
        const result = await reqGetCarousel(type);
        if (result.code == 200) {
            commit("GETCAROUSEL", result.banners)
        }
    },
    // 获取推荐歌单数据
    async GetSongList({ commit }) {
        const result = await reqGetSongList();
        if (result.code == 200) {
            commit("GETSONGLIST", result.result)
        }
    },
    // 获取推荐音乐数据
    async GetMusicList({ commit }) {
        const result = await reqGetMusicList();
        if (result.code == 200) {
            commit("GETMUSICLIST", result.result)
        }
    },
    // 存储点击的歌单和下标以及map3地址
    selectPlay({ commit }, { list, index, url }) {
        // 播放列表
        commit("SET_PLAYLIST", list)
        // 顺序
        commit("SET_SEQUENCE_LIST", list)
        commit("SET_CURRENT_INDEX", index)
        commit("SET_CURRENT_URL", url)
        // 显示播放页面
        commit("SET_FULL_SCREEN", true)
        commit("SET_PLAYING_STATE", true)
    }
}