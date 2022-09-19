<template>
  <!-- 进度条 -->
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <!-- 已播放的进度条 -->
      <div class="progress" ref="progress"></div>
      <!-- 小球 -->
      <div
        class="progress-btn-wrapper"
        ref="progressBtn"
        @touchstart="progressTouchStart"
        @touchmove="progressTouchMove"
        @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Progressbar",
  props: {
    type: Number,
    default: 0,
  },
  created() {
    // 存放有关 触摸事件的数据
    this.touch = {};
  },
  computed: {
    // 得到小球的宽度
    progressBthWidth() {
      this.$refs.progressBtn.clientWidth;
    },
  },
  methods: {
    //手指刚接触屏幕时触发
    progressTouchStart(e) {
      // 触摸开始
      this.touch.init = true;
      console.log(e.touches[0].pageX);
      // 记录刚刚开始触摸小球的位置
      this.touch.startX = e.touches[0].pageX;
      // 记录小球偏移的位置（小球的位置= 已经播放部分的进度条clientWidth）
      this.touch.left = this.$refs.progress.clientWidth;
    },
    //手指在屏幕上移动时触发
    progressTouchMove(e) {
      //没有经过 progressTouchStart 函数时 return
      if (!this.touch.init) {
        return;
      }
      // 现在触摸的位置-刚刚开始时触摸的位置 = 移动了多少距离
      const deltax = e.touches[0].pageX - this.touch.startX;
      // 剩余的宽度:(进度条总宽度 - 小球的宽度) this.$refs.progressBar.clientWidth - this.progressBthWidth;
      //计算小球移动后的位置：（小球偏移的位置 + 移动了多少距离）this.touch.left + deltax;
      // 使用Math.min()裁剪一个值，以便使其总是小于或等于某个边界值(第一个值为边界)
      const offsetWidth = Math.min(
        this.$refs.progressBar.clientWidth - this.progressBthWidth,
        Math.max(0, this.touch.left + deltax)
      );
      //  调用方法把值进行计算
      this.offsetWidth(offsetWidth);
    },

    //手指从屏幕上移开时触发
    progressTouchEnd() {
      // 触摸结束
      this.touch.init = false;
      //   显示当前播放的时间
      this.triggerPercent()
    },
    // 计算移动滚动条和小球的位置
    offsetWidth(offsetWidth) {
      // 滚动条的位置（不断变化）
      this.$refs.progress.style.width = `${offsetWidth}px`;
      // 小球的位置（不断变化）
      this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth}px,0,0)`;
    },
    // 点击进度条
    progressClick() {},
  },
};
</script>

<style>
</style>