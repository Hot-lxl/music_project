import * as types from "./mutations-types"
// mutations:用于修改state的唯一手段
export default {
    GETCAROUSEL(state, data) {
        state.carousel = data;
    },
    GETSONGLIST(state, data) {
        state.SongList = data;
    },
    GETMUSICLIST(state, data) {
        state.MusicList = data;
    },
    SETDISC(state, data) {
        state.Disc = data;
    },
    SET_PLAYLIST(state, data) {
        state.playlist = data;
    },
    SET_SEQUENCE_LIST(state, data) {
        state.sequenceList = data;
    },
    SET_CURRENT_INDEX(state, data) {
        state.currentIndex = data;
    },
    SET_CURRENT_URL(state, data) {
        state.currentUrl = data;
    },
    SET_PLAYING_STATE(state, data) {
        state.playing = data;
    },
    SET_FULL_SCREEN(state, data) {
        state.fullScreen = data;
    },
    SET_PLAY_MODE(state, data) {
        state.mode = data;
    },
    [types.SET_TOPLIST](state, data) {
        state.topList = data;
    },
    [types.SET_SINGER](state, data) {
        state.singer = data;
    },
    [types.SET_SEARCH_HISTORY](state, data) {
        state.searchHistory = data;
    },

}