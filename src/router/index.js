import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/rules',
    name: 'Rules',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "rules" */ '../views/Rules.vue')
  },
  {
    path: '/play',
    name: 'Pass & Play',
    component: () => import(/* webpackChunkName: "play" */ '../views/Pass_and_Play.vue')
  },
  {
    path: '/online',
    name: 'Online Games',
    component: () => import(/* webpackChunkName: "online" */ '../views/Online_Games.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
