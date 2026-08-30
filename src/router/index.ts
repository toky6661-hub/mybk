//用于定义网页路径和页面组件之间的对应关系
import { createRouter, createWebHistory } from 'vue-router'
import Clock from '../components/Clock.vue'
import Home from '../views/Home.vue'


//定义路由规则
const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,Clock,

        meta: {
            hideClock:false,
            hideHome:false
        },
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router