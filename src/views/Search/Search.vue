<template>
  <!-- 搜索页面 -->
  <div class="search">
    <!-- 输入框 -->
    <div class="search-box-wrapper">
      <SearchBox ref="searchBox" @query="onQueryChange"></SearchBox>
    </div>
    <div class="shortcut-wrapper" v-show="!query">
      <Scroll class="shortcut" :data="shortcut" ref="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li
                @click="addQuery(item.first)"
                class="item"
                v-for="(item, index) in hots"
                :key="index"
              >
                <span>{{ item.first }}</span>
              </li>
            </ul>
          </div>

          <!-- <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="fa fa-trash"></i>
              </span>
            </h1>
            <search-list
              @select="addQuery"
              @delete="deleteOne"
              :searches="searchHistory"
            ></search-list>
          </div> -->
        </div>
      </Scroll>
    </div>
    <!-- 搜索详情 -->
    <div class="search-result" v-show="query">
      <Suggest
        :query="query"
        @listScroll="blurInput"
        @select="saveSearch"
      ></Suggest>
    </div>
    <!-- 提示框 -->
    <!-- <confirm
      ref="confirm"
      text="是否清空搜索历史数据"
      confirBtnText="清空"
      @confirm="deleteAll"
    ></confirm> -->

    <router-view></router-view>
  </div>
</template>

<script>
import Scroll from "@/components/Base/scroll";
import Suggest from "@/components/Suggest/Suggest";
import SearchBox from "@/components/SearchBox/SearchBox";
import { mapActions } from "vuex";
export default {
  name: "Search",
  components: {
    SearchBox,
    Suggest,
    Scroll,
  },
  data() {
    return {
      query: "", //输入的关键词
      hots: [], //热门搜索
      shortcut: [],
    };
  },
  created() {
    // 页面加载前或热门搜索
    this.getHotSearch();
  },
  methods: {
    ...mapActions(["saveSearchHistory"]),
    // 获取热门搜索
    async getHotSearch() {
      let res = await this.$API.resGetHotSearch();
      console.log(res);
      if (res.code === 200) {
        let ret = [];
        res.result.hots.forEach((item) => {
          ret.push(item.first);
        });
        console.log(ret);
        // 赋值
        this.hots = ret;
      }
    },
    // 自定义事件接受触发得参数
    onQueryChange(newquery) {
      this.query = newquery;
    },
    // SerachBox组件触发blur()
    blurInput() {
      this.$refs.searchBox.blur();
    },
    // 保存搜索记录
    saveSearch() {
      this.saveSearchHistory(this.query);
    },
  },
};
</script>

<style lang="stylus" scoped>
@import '~@/assets/stylus/variable';
@import '~@/assets/stylus/mixin';

.search {
  .search-box-wrapper {
    padding: 20px 20px 10px 20px;
    background: #fffaf0;
  }

  .shortcut-wrapper {
    position: fixed;
    top: 155px;
    bottom: 0;
    width: 100%;
    background: #fffaf0;

    .shortcut {
      height: 100%;
      overflow: hidden;

      .hot-key {
        margin: 0 20px 20px 20px;

        .title {
          margin-bottom: 20px;
          font-size: $font-size-medium;
          color: #757575;
        }

        .item {
          display: inline-block;
          padding: 5px 10px;
          margin: 0 20px 10px 0;
          border-radius: 6px;
          font-size: $font-size-medium;
          color: #2d3436;
        }
      }

      .search-history {
        position: relative;
        margin: 0 20px;

        .title {
          display: flex;
          align-items: center;
          height: 40px;
          font-size: $font-size-medium;
          color: #757575;

          .text {
            flex: 1;
          }

          .clear {
            extend-click();

            .fa-trash {
              font-size: 15px;
              color: #cccccc;
            }
          }
        }
      }
    }
  }

  .search-result {
    position: fixed;
    width: 100%;
    top: 155px;
    bottom: 0;
  }
}
</style>