import {
	hasToken
} from "@/utils/auth.js";

function routerInter() {
	const whitePages = [
		"/pages/login/login",
		"/pages/index/index",
	]
	const handler = (options) => {
		if (!whitePages.includes(options.url)) {
			//没有token的情况下先提醒登录
			if (!hasToken()) {
				uni.showModal({
					title: '提示',
					content: "请先登录!",
					showCancel: false,
					success: (confirm) => {
						if (confirm) {
							//重定向到登录页
							uni.reLaunch({
								url: "/pages/login/login"
							})
						}
					}
				})
				return false
			}
			//有则直接放行
			return
		};
	}
	//拦截器
	uni.addInterceptor("navigateTo", {
		invoke: handler

	})
	//拦截器
	uni.addInterceptor("switchTab", {
		invoke: handler
	})

}
export default {
	enable: true, //是否开启路由拦截
	routerInter
}