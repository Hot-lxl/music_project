// 歌的构造函数，提取需要的数据
export default class Song {
  constructor({ id, mid, singer, name, album, duration, image, url }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
}
// 获取歌手的name
function singerName (arr) {
  let name = []
  // 因为是数组所以需要遍历得到名字
  name = arr.map((item) => {
    // console.log(arr)
    return item.name
  })

  return name.join('/')
}

// 歌曲基本结构
export function createSong (music) {
  return new Song({
    // 歌手歌曲 id
    id: music.id,
    // 歌手 name
    singer: singerName(music.ar),
    // 专辑歌曲 name
    album: music.al.name,
    // 歌曲 name
    name: music.name,
    image: music.al.picUrl
  })
}

// 推荐页面 推荐歌单 数据结构
export function createRecommendListSong (music) {
  return new Song({
    id: music.id,
    singer: singerName(music.ar),
    name: music.name,
    album: music.al.name,
    image: music.al.picUrl
  })
}

// 推荐页面 推荐新音乐 数据结构
export function createNewMusic (music) {
  return new Song({
    id: music.id,
    singer: singerName(music.song.artists),
    name: music.name,
    album: music.song.album.name,
    image: music.picUrl
  })
}

// 排行页面 歌曲列表
export function createRankMusic (music) {
  return new Song({
    id: music.id,
    name: music.name,
    singer: singerName(music.ar),
    image: music.al.picUrl
  })
}

// 搜索页面 搜索框
export function createSearchSong (music) {
  return new Song({
    id: music.id,
    singer: singerName(music.artists),
    name: music.name,
    album: music.album.name
  })
}