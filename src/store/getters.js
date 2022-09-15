/*
包含多个基于state的getter计算属性的对象
 */
export default {
    // 播放状态
    playing(state) {
        return state.playing;
    },
    // 播放器的展开和隐藏
    fullScreen(state) {
        return state.fullScreen;
    },
    // 播放列表
    playlist(state) {
        return state.playlist || []
    },
    // 播放循序
    sequenceList(state) {
        return state.sequenceList || [];
    },
    // 当前播放歌曲
    currentSong(state) {
        return state.playlist[state.currentIndex] || [];
    }
}