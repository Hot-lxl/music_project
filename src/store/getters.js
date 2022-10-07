/*
包含多个基于state的getter计算属性的对象
 */
export default {
    // 播放状态
    playing(state) {
        return state.playing;
    },
    // 当前播放模式
    mode(state) {
        return state.mode;
    },
    // 播放器的展开和隐藏
    fullScreen(state) {
        return state.fullScreen;
    },
    // 播放列表
    playlist(state) {
        return state.playlist || []
    },
    // 歌曲顺序列表
    sequenceList(state) {
        return state.sequenceList || [];
    },
    // 当前的歌曲的的索引
    currentIndex(state) {
        return state.currentIndex
    },
    // 当前播放歌曲
    currentSong(state) {
        return state.playlist[state.currentIndex] || [];
    },
    // 当前播放歌曲map3的url地址
    currentUrl(state) {
        return state.currentUrl
    },
    // 排行详情数据
    topList(state) {
        return state.topList || []
    },
    // 点击的歌手
    singer(state) {
        return state.singer || {}
    },

}