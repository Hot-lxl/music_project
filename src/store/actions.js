/*
action:处理action响应用户的操作，可以写自己的业务逻辑，也可以处理异步向服务器发送请求
 */

// 引入api
import { reqGetCarousel, reqGetSongList, reqGetMusicList, reqSongUrl } from "@/network/api"
import * as types from '@/store/mutations-types'
import { playMode } from "@/common/config";
import { random } from "@/common/util";
// 封装一个findIndex方法
function findIndex(list, song) {
    return list.findIndex((item) => {
        return item.id === song.id
    })
}
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
    selectPlay({ commit, state }, { list, index, url }) {
        // 播放列表
        commit("SET_PLAYLIST", list)
        // 循环顺序
        if (state.mode === playMode.random) {
            let randomList = random(list);
            commit("SET_SEQUENCE_LIST", randomList)
            // 获取顺序列表当前歌曲的下标
            index = findIndex(randomList, list[index])
        } else {
            // 不是循环
            commit("SET_SEQUENCE_LIST", list)
        }
        commit("SET_CURRENT_INDEX", index)
        commit("SET_CURRENT_URL", url)
        // 显示播放页面
        commit("SET_FULL_SCREEN", true)
        commit("SET_PLAYING_STATE", true)
    },
    //异步删除歌曲
    async deleteSong({ commit, state }, song) {
        // 需要修改的地方，播放列表、顺序列表、索引、当前歌曲、地址
        let playlist = state.playlist.slice(); //slice():浅拷贝
        let sequenceList = state.sequenceList.slice();
        let currentIndex = state.currentIndex;
        let currentSong = playlist[currentIndex];
        // 首先删除在播放列表的这首歌
        let pIndex = findIndex(playlist, song)
        // 删除
        playlist.splice(pIndex, 1);

        // 删除顺序列表的歌曲
        let sIndex = findIndex(sequenceList, song);
        sequenceList.splice(sIndex, 1);
        // 判断删除的这首歌是否是正在播放的音乐
        if (song === currentSong) {
            //如果为一首歌，那么不请求地址
            if (!playlist.length) {
                return
            }
            // 删除了当前歌曲下一首歌的索引就是变成当前的
            // console.log(pIndex, playlist[pIndex]);
            // 删除了就请求下一首歌的地址
            let result = await reqSongUrl(playlist[pIndex]);
            if (result.code === 200) {
                // 把地址赋值给他mutations
                commit(types.SET_CURRENT_URL, result.data[0].url);
            }
        }
        // 判断删除的歌曲索引是否小于播放的歌曲索引以及是否之后一首歌(改变当前音乐的索引)
        if (currentIndex > pIndex || currentIndex === playlist.length) {
            currentIndex--;
        }
        // 改变state中状态
        commit(types.SET_CURRENT_INDEX, currentIndex);
        commit(types.SET_PLAYLIST, playlist);
        commit(types.SET_SEQUENCE_LIST, sequenceList)

        // 改变播放状态
        if (!playlist.length) {
            commit(types.SET_PLAYING_STATE, false)
        } else {
            commit(types.SET_PLAYING_STATE, true)

        }

    },
    // 清空歌曲列表
    deleteSongList({ commit }) {
        commit(types.SET_PLAYLIST, [])
        commit(types.SET_SEQUENCE_LIST, [])
        commit(types.SET_PLAYING_STATE, false)
        commit(types.SET_CURRENT_INDEX, -1)
        commit(types.SET_CURRENT_URL, "")
    }

}