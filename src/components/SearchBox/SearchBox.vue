<template>
  <div class="search-box">
    <i class="fa fa-search"></i>
    <input
      class="box"
      :placeholder="placeholder"
      v-model="query"
      @keyup.enter="keyupEnter"
      ref="query"
    />
    <i v-show="query" class="fa fa-times" @click="clear"></i>
  </div>
</template>

<script>
import { debounce } from "@/common/util";
export default {
  name: "SearchBox",
  props: {
    placeholder: {
      type: String,
      default: "搜索歌曲、歌手",
    },
  },
  data() {
    return {
      query: "", //输入框的数据
    };
  },
  methods: {
    // 清空搜索框
    clear() {
      this.query = "";
    },
    // 当点击热门搜索的关键词 关键词能够同步到 搜索框
    setQuery(query) {
      this.query = query;
    },
    // 输入框失去焦点触发blur()方法显示X标志
    blur() {
      this.$refs.query.blur();
    },
    // 回车就触发自定义事件保存搜索记录
    keyupEnter() {
      this.$emit("select", this.query);
    },
  },
  created() {
    //监听输入框的query变化，触发query自定义事件 ，将输入的newQuery传给search组件
    this.$watch("query", (newquery) => {
      // 防抖：规定时间才能发送数据
      debounce(this.$emit("query", newquery));
    });
  },
};
</script>

<style lang="stylus" scoped>
@import '~@/assets/stylus/variable';

.search-box {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  height: 40px;
  background: #fffaf0;
  border-radius: 6px;

  .fa-search {
    font-size: 20px;
    color: #636e72;
  }

  .box {
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    background: #636e72;
    color: #fff;
    font-size: $font-size-medium;
    border-radius: 2px;
    padding: 3px 0;

    &::placeholder {
      color: $color-text-d;
    }
  }

  .fa-times {
    font-size: 20px;
    color: #636e72;
  }
}
</style>