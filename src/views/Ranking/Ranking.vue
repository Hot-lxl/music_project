<template>
  <div class="rank" ref="rank">
    <Scroll class="toplist" ref="toplist" :data="topList">
      <ul>
        <li
          class="item"
          v-for="(item, index) in topList"
          :key="index"
          @click="selectItem(item)"
        >
          <div class="icon">
            <img width="100" height="100" :src="item.coverImgUrl" />
          </div>
          <!-- 歌曲前三首 -->
          <ul class="songlist">
            <li class="song" v-for="(song, index) in item.top" :key="index">
              <span>{{ index + 1 }}</span>
              <span>{{ song.name }}-{{ song.ar[0].name }}</span>
            </li>
          </ul>
        </li>
      </ul>
      <!--加载提示  -->
      <div class="loading-container" v-show="!topList.length">
        <Loading></Loading>
      </div>
    </Scroll>

    <router-view></router-view>
  </div>
</template>

<script>
import Loading from "@/components/Base/Loading";
import Scroll from "@/components/Base/scroll";
import { reqPlayListDetail } from "@/network/api";
import { mapMutations } from "vuex";
// 定义一个数组用来装排行榜的id
var RANK_TOP = [
  2900343697,
  2179431622,
  391125700,
  924680166,
  2075587022,
  2037020941,
  563942723,
  2430524968,
];

export default {
  name: "Ranking",
  components: {
    Scroll,
    Loading,
  },
  data() {
    return {
      // 排行榜数据
      topList: [],
    };
  },
  created() {
    // 页面创建之前获取数据
    this.getTopList();
  },
  methods: {
    ...mapMutations({
      setTopList: "SET_TOPLIST",
    }),
    //获取歌单排行数据
    async getTopList() {
      // 一共请求9个排行榜
      for (let index = 0; index < RANK_TOP.length; index++) {
        let result = await reqPlayListDetail(RANK_TOP[index]);
        if (result.code === 200) {
          // 存储点击的歌曲分类所以相关信息
          let list = result.playlist;
          // 获取 该排行榜 前三位歌曲信息 作为TOP前三名
          list.top = result.playlist.tracks.slice(0, 3);
          // 把list装入toplist
          this.topList.push(list);
        }
      }
    },
    // 点击进入歌单详情
    selectItem(item) {
      //页面跳转
      this.$router.push(`/ranking/${item.id}`);
      // 把点击的歌单存入vuex
      this.setTopList(item);
    },
  },
};
</script>
<style lang="stylus" scoped>
@import '~@/assets/stylus/mixin.styl';
@import '~@/assets/stylus/variable.styl';

.rank {
  position: fixed;
  top: 88px;
  left: 0;
  right: 0;
  bottom: 0;

  .toplist {
    height: 100%;
    overflow: hidden;

    .item {
      display: flex;
      margin: 0 20px;
      padding-top: 20px;

      &.last-child {
        padding-bottom: 20px;
      }

      .icon {
        flex: 0 0 100px;
        width: 100px;
        height: 100px;
      }

      .songlist {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 20px;
        height: 100px;
        overflow: hidden;
        background: #bdc3c7;
        color: #2c3e50;
        font-size: $font-size-small;

        .song {
          no-wrap();
          line-height: 26px;
        }
      }
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>