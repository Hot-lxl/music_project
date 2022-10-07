<template>
<!-- 搜索建议页面 -->
  <Scroll
    class="suggest"
    :data="songs"
    :pullup="pullup"
    :beforeScroll="beforeScroll"
    @beforeScroll="listScroll"
    @scrollToEnd="searchMore"
    ref="suggest"
  >
    <ul class="suggest-list">
      <li
        class="suggest-item"
        v-for="(item, index) in songs"
        :key="index"
        @click="selectItem(item)"
      >
        <div class="name">
          <p class="text">{{ item.name }} — {{ item.singer }}</p>
        </div>
      </li>
    </ul>

    <loading v-show="hasMore"></loading>

    <transition
      enter-active-class="bounceInLeft"
      leave-active-class="fadeOutUp"
      :duration="{ enter: 500, leave: 800 }"
    >
      <div class="prompt-container animated" v-show="prompt">
        <prompt></prompt>
      </div>
    </transition>

    <div v-show="!hasMore && !songs.length" class="no-result-wrapper">
      抱歉，未搜索出结果
    </div>
  </Scroll>
</template>

<script>
import Scroll from '@/components/Base/scroll'
export default {

};
</script>

<style>
</style>