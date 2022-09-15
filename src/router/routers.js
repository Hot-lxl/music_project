
import Recommend from "@/views/Recommend/Recommend.vue"
import Ranking from '@/views/Ranking/Ranking.vue'
import Singer from '@/views/Singer/Singer.vue'
import Search from '@/views/Search/Search.vue'
import Bisc from '@/views/Recommend/Disc/Disc'
// 对外暴露routers
export default [
    {
        path: "/recommend",
        component: Recommend,
        meta: { isShow: true },
        children: [
            {
                path: ":id",//把子组件路径当成占位符
                component: Bisc,
                meta: { isShow: false },
            }
        ]
    },
    {
        path: "/ranking",
        component: Ranking,
        meta: { isShow: true }
    },
    {
        path: "/singer",
        component: Singer,
        meta: { isShow: true }
    },
    {
        path: "/search",
        component: Search,
        meta: { isShow: false }
    },
    // 重定向recommend
    {
        path: "*",
        redirect: "/recommend"
    }
]