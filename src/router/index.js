import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/main/Home.vue'
import recommend from "@/views/main/findMusic/recommend.vue"

Vue.use(VueRouter)


const routes = [{
		path: '/',
		name: 'home',
		component: Home,
		redirect: "/find",
	},
	{
		path: '/find',
		name: 'find',
		redirect: "/find/recommend",
		component: Home,
		children: [{
				name: "recommend",
				path: "recommend",
				component: recommend
			},
			{
				name: "playlist",
				path: "playlist",
				component: resolve => require(["@/views/main/findMusic/playlist/playlist.vue"], resolve)
			},
			{
				name: "anchor",
				path: "anchor",
				component: resolve => require(["@/views/main/findMusic/anchor/anchor.vue"], resolve)
			},
			{
				name: "rank",
				path: "rank",
				component: resolve => require(['@/views/main/findMusic/rank/rank.vue'], resolve)
			},
			{
				name: "artists",
				path: "artists",
				component: resolve => require(["@/views/main/findMusic/artists/artists.vue"], resolve)
			},
			{
				name: "new",
				path: "new",
				component: resolve => require(["@/views/main/findMusic/new/new.vue"], resolve)
			}
		]
	},
	{
		name: 'rankdetail',
		path: "/rankdetail/:idx",
		props: true,
		component: resolve => require(["@/views/main/findMusic/rank/rankDetail.vue"], resolve)
	},
	
	{
		name:'radio',
		path:'/radio/:radio_id',
		props:true,
		component:resolve => require(["@/views/main/radio.vue"], resolve)
	},
	{
		name:'list',
		path:'/list/:list_id',
		props:true,
		component:resolve => require(["@/views/main/list.vue"], resolve)
	},
	{
		name:'art',
		path:'/art/:art_id',
		props:true,
		component:resolve => require(["@/views/main/artist.vue"], resolve)
	},
	{
		name:'album',
		path:'/album/:id',
		props:true,
		component:resolve => require(["@/views/main/album.vue"], resolve)
	},
	{
		name:'search',
		path:'/search/:keyword',
		props:true,
		component:resolve => require(["@/views/main/search.vue"], resolve)
	},
	{
		name: 'fm',
		path: "/fm",
		component: resolve => require(['@/views/main/fm/fm.vue'], resolve)
	},
	{
		path: '/about',
		name: 'About',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import( /* webpackChunkName: "about" */ '../views/main/About.vue')
	},
	{
		path: "/videolist",
		name: "videolist",
		component: resolve => require(["@/views/main/video/index.vue"], resolve),
		redirect: "/videolist/video",
		children: [{

			name: "video",
			path: "video",
			component: resolve => require(["@/views/main/video/video.vue"], resolve)

		}]
	},
	{
		name: 'mark',
		path: "/mark",
		component: resolve => require(['@/views/main/mark/mark.vue'], resolve)
	},
	{
		name: 'favorite',
		path: "/favorite",
		component: resolve => require(['@/views/main/favorite/favorite.vue'], resolve)
	}
]

const router = new VueRouter({
	mode: 'hash',
	base: process.env.BASE_URL,
	routes
})

export default router
