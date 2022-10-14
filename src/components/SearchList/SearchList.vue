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
    methods: {
      // 调用search的addQuery()改变输入框关键词
      selectItem(query) {
        this.$emit("select", query);
      },
    },
  },
};
</script>

<style>
</style>