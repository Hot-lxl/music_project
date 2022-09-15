<template>
  <div class="Swiper" v-show="swiper.length">
    <div>
      <swiper class="swiper" :options="swiperOption">
        <swiper-slide v-for="item in swiper" :key="item.bannerId">
          <a href="https://music.163.com/">
            <img class="swiper-img" :src="item.pic" />
          </a>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
  </div>
</template>

<script>
export default {
  name: "Carousel",
  props: {
    swiper: Array,
  },
  data() {
    return {
      // 轮播图
      notNextTick: true,
      swiperOption: {
        autoplay: 2100, //是否自动播放2秒后播放
        grabCursor: true, //光标在Swiper上时成手掌状
        loop: true, //是否循环
        // 当用户操作了轮播图后 是否停止 autoplayn
        autoplayDisableOnInteraction: false,
        // 分页小点
        pagination: ".swiper-pagination",
      },
    };
  },

};
</script>

<style lang="stylus" scoped>
.Swiper >>> .swiper-pagination-bullet-active {
  background: #FD6C62 !important;
}

.Swiper {
  width: 100%;
  height: 0;
  overflow: hidden;
  padding-bottom: 38.88%;
  background: rgb(231, 23, 23);
  padding-top: 8px;

  .swiper-img {
    width: 100%;
    background: #eeeeee;
    border-radius: 2px;
  }
}
</style>