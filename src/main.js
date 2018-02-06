// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'
import images from './assets/personImageMap'

const routes = [
	{ path: '/', component: () => import('./page/config.vue') },
	{ path: '/before', component: () => import('./page/before.vue') },
	{ path: '/after', component: () => import('./page/after.vue') },
	{ path: '/record',component: () => import('./page/record.vue')},
	{ path: '/source',component: () => import('./page/Source.vue')},
]

const router=new VueRouter({
	routes
})

Vue.config.productionTip = false

Vue.use(VueRouter);
const a=new Vue();
Vue.mixin({
	computed:{
		$ctrl(){
			return a;
		}
	}
});



// const getLocal = key => JSON.parse(localStorage.getItem(key) || '{}')
// const saveLocal = (key, value) => localStorage.setItem(key, JSON.stringify(value))

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  router,
});

