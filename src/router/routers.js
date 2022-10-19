
// 对外暴露routers
export default [
    {
        path: "/recommend",
        component: () => import("@/views/Recommend/Recommend.vue"),//路由懒加载
        meta: { isShow: true },
        children: [
            {
                path: ":id",//把子组件路径当成占位符
                component: () => import('@/views/Recommend/Disc/Disc'),
            }
        ]
    },
    {
        path: "/ranking",
        component: () => import('@/views/Ranking/Ranking.vue'),
        meta: { isShow: true },
        children: [
            {
                path: ":id",
                component: () => import('@/views/Ranking/TopList/TopList'),
            }
        ]
    },
    {
        path: "/singer",
        component: () => import('@/views/Singer/Singer.vue'),
        meta: { isShow: true },
        children: [
            {
                path: ":id",
                component: () => import("@/views/Singer/SingerDetail/SingerDetail"),
            }
        ]
    },
    {
        path: "/search",
        component: () => import('@/views/Search/Search.vue'),
        meta: { isShow: false }
    },
    // 重定向recommend
    {
        path: "*",
        redirect: "/recommend"
    }
]