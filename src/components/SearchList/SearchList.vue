<template>
  <div class="search-list" v-show="searches.length">
    <ul>
      <li
        class="search-item"
        v-for="(item, index) in searches"
        :key="index"
        @click="selectItem(item)"
      >
        <span class="text">{{ item }}</span>
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="fa fa-times"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "SearchList",
  props: {
    searches: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
    // 调用search的addQuery()改变输入框关键词
    selectItem(query) {
      this.$emit("select", query);
    },
    // 删除单个搜索历史
    deleteOne(item) {
      this.$emit("delete", item);
    },
  },
};
</script>

<style lang="stylus" scoped>
@import '~@/assets/stylus/variable';
// @import '~@/assets/stylus/mixin.styl';

.search-list {
  .search-item {
    display: flex;
    align-items: center;
    height: 40px;

    .text {
      flex: 1;
      color: #000;
    }

    .icon {
      extend-click();

      .fa-times {
        font-size: $font-size-small;
        color: #ccc;
      }
    }
  }
}
</style>