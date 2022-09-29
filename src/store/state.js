import { playMode } from "@/common/config"
/*
状态对象
 */
export default {
    // 存放轮播数据
    carousel: [],
    // 存放推荐歌单数据
    SongList: [],
    // 存放推荐音乐数据
    MusicList: [],
    // 存放歌单详情的数据   
    Disc: [],//点击的推荐歌单
    playing: false, // 播放状态
    fullScreen: false, // 播放器的展开 和 隐藏
    playlist: [], // 播放列表
    sequenceList: [], // 顺序列表
    mode: playMode.sequence, // 播放模式
    currentIndex: -1, // 播放当前歌曲的索引
    currentUrl: '', // 当前播放歌曲map3的url地址,
    topList:[],//点击的排行榜歌单
}