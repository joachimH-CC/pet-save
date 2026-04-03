import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'


Vue.config.productionTip = false
import store from '@/store/index.js'
import inter from '@/interceptor/index.js'
App.mpType = 'app'
//引入uView
// main.js
import uView from "uview-ui";
Vue.use(uView);
import "@/static/style/common.css"
const app = new Vue({
	...App,
	store
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif