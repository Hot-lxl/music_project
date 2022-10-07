import storage from 'good-storage'
const SEARCH_KEY = '_search_'
const SEARCH_MAX_LEGNTH = 15

const PLAY_KEY = '_play_'
const PLAY_MAX_LENGTH = 200

// 向数组插入关键词
function insertArray (arr, val, compare, maxLen) {
  // 对比是否存在关键词
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    // 截取
    arr.splice(index, 1)
  }
  // 开头添加数组
  arr.unshift(val)
  // 如果最大长度大于了15那么就是需要从尾部删除元素
  if (maxLen && arr.length > maxLen) {
    // 尾部删除一个元素
    arr.pop()
  }
}
// 保存历史记录
export function saveSearch (query) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LEGNTH)
  storage.set(SEARCH_KEY, searches)
  return searches
}

// 获取本地缓存
export function loadSearch () {
  return storage.get(SEARCH_KEY, [])
}
// 对比历史记录然后截取
function deleteFromArray (arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}
// 删除单个历史记录
export function deleteSearch (query) {
  // 首先获取
  let searches = storage.get(SEARCH_KEY, [])

  deleteFromArray(searches, (item) => {
    return item === query
  })

  storage.set(SEARCH_KEY, searches)
  return searches
}
// 清空所有搜索记录
export function clearSearch () {
  storage.remove(SEARCH_KEY)
  return []
}

// 写入 播放历史 数据 （本地缓存中 和 vuex）
export function savePlay (song) {
  let songs = storage.get(PLAY_KEY, [])
  insertArray(songs, song, (item) => {
    return item.id === song.id
  }, PLAY_MAX_LENGTH)
  storage.set(PLAY_KEY, songs)
  return songs
}
// 读 播放历史 数据 从本地缓存中
export function loadPlay () {
  return storage.get(PLAY_KEY, [])
}

// 获取 收藏夹歌单 从本地缓存中
export function loadFavorite () {
  return storage.get(FAVORITE_KEY, [])
}
