<template>
  <!--  热门歌手页面 -->
  <div class="singer">
    <ListView @select="selectSinger" :data="singers"></ListView>
    <router-view></router-view>
  </div>
</template>

<script>
import ListView from "@/components/Base/listview";
import { mapMutations } from "vuex";
import Singer from "@/common/singer";
import { reqGetSingerList } from "@/network/api";
import pinyin from "pinyin";
const HOTname = "热门";
const HOTsinger = 16;
export default {
  name: "Singer",
  data() {
    return {
      singers: [], //处理好的歌手数据
    };
  },
  components: {
    ListView,
  },
  created() {
    // 页面创建之前获取歌手数据
    this.getSingerList();
  },
  methods: {
    ...mapMutations({
      setSinger: "SET_SINGER",
    }),
    // 获取请求歌手数据
    async getSingerList() {
      let result = await reqGetSingerList();
      if (result.code == 200) {
        //歌手名字首字母转成大写
        this.SingerList(result.artists);
      }
    },
    // 得到歌手的数据进行处理
    SingerList(res) {
      // 只是遍历并且添加res的属性
      res.map((item) => {
        // 把歌手名字首字母转成拼音
        let py = pinyin(item.name[0], {
          style: pinyin.STYLE_FIRST_LETTER,
        });
        // 转成大写并且向每个歌手添加一个py属性
        item.py = py[0][0].toUpperCase();
      });
      // 对歌手进一步处理
      this.singers = this.normalizeSinger(res);
    },
    // 处理歌手数据热门
    normalizeSinger(singers) {
      // 定一个对象来存放热门歌手
      let map = {
        Hot: {
          title: HOTname,
          items: [], //歌手
        },
      };
      // 遍历获取前16位歌手为热门歌手
      singers.forEach((item, index) => {
        if (index < HOTsinger) {
          // 装入数组
          map.Hot.items.push(
            new Singer({
              id: item.id,
              name: item.name,
              avatar: item.img1v1Url,
              aliaName: item.alias.join("/"),
            })
          );
        }
        // 处理不是热门歌手的数据
        let key = item.py;
        //判断是否有map[key],没有就创建一个
        if (!map[key]) {
          //map[key]:相当于为map中添加属性只能是数组才能遍历添加
          map[key] = {
            title: key,
            items: [],
          };
          // 添加歌手
          map[key].items.push(
            new Singer({
              id: item.id,
              name: item.name,
              avatar: item.img1v1Url,
              aliaName: item.alias[0],
            })
          );
        }
      });
      // 定义两个空的数组，来存放热门歌手和不是其他歌手
      let hot = [];
      let ret = [];
      for (const key in map) {
        // 要得不是对象的key而是整个对象
        let val = map[key];
        // 判断title是否为热门
        if (val.title === HOTname) {
          // 装入hot
          hot.push(val);
          // 正则方法：match()会返回一个匹配到的字符串的数组
        } else if (val.title.match(/[A-Z]/)) {
          ret.push(val);
        }
      }
      // 对不是热门的数据进行排序
      ret.sort((a, b) => {
        // charCodeAt() 方法可返回指定位置的字符的 Unicode 编码
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });

      // 合并数组并返回出去
      return hot.concat(ret);
    },
    //点进进入歌手详情
    selectSinger(singer) {
      // 进入子组件
      this.$router.push(`/singer/${singer.id}`);
      // 把点击个歌手数据传入vuex存储
      this.setSinger(singer);
    },
  },
};
</script>
<style lang="stylus" scoped>
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>