/* 
Vuex最核心的管理对象store 大仓库
*/
import Vue from "vue";
import Vuex from 'vuex'
// 应用插件
Vue.use(Vuex);

import state from "./state";
import mutations from "./mutations";
import actions from "./actions";
import getters from './getters'
export default new Vuex.Store({
    actions,
    mutations,
    state,
    getters,
})

