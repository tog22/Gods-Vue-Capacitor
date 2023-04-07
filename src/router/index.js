import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Home,
		meta: {
			title: 'Gods'
		}
	},
	{
		path: '/rules',
		name: 'Rules',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "rules" */ '../views/Rules.vue'),
		meta: {
			title: 'Rules for Gods'
		}
	},
	{
		path: '/play',
		name: 'Pass & Play',
		component: () => import(/* webpackChunkName: "play" */ '../views/Pass_and_Play.vue'),
		meta: {
			title: 'Gods'
		}
	},
	{
		path: '/online',
		name: 'Online Games',
		component: () => import(/* webpackChunkName: "online" */ '../views/Online_Games_Menu.vue'),
		meta: {
			title: 'Gods'
		}
	},
	{
		path: '/online/load',
		name: 'Continue Game',
		component: () => import(/* webpackChunkName: "play" */ '../views/Load_Game.vue'),
		meta: {
			title: 'Gods'
		}
	},
	{
		path: '/online/play',
		name: 'Online Game',
		component: () => import(/* webpackChunkName: "online" */ '../views/Online_Game.vue'),
		meta: {
			title: 'Gods'
		}
	},
	{
		path: '/online/new',
		name: 'New Online Game',
		component: () => import(/* webpackChunkName: "online" */ '../views/New_Online_Game.vue'),
		meta: {
			title: 'Gods'
		}
	},
	{
		path: '/p2',
		name: 'Online Game - player 2',
		component: () => import(/* webpackChunkName: "online" */ '../views/Online_Other_Player.vue'),
		meta: {
			title: 'Gods'
		}
	}
]

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
})

export default router