import env from './env.js'
import {
	getToken,
	removeToken
} from './auth.js'
/**
 * 基础请求封装
 * @param {Object} options
 */
export default function http(options) {
	let {
		url = '', method = "GET", header = {}, data = {}, isToken = true
	} = options
	if (isToken) {
		header = {
			...header,
			Authorization: getToken()
		}
	}
	return new Promise((resolve, reject) => {
		uni.request({
			url: env.BASE_URL + url,
			method,
			header,
			data,
			success: (res) => {
				// 响应成功的回都调函数
				//相应拦截
				if (res.data.code !== 200) {
					//401 无权限 未登录
					if (res.data.code === 401) return handleUnToken()
					handleCommentError(res)
					reject(res.data)
				}
				resolve(res.data)
			},
			fail: (err) => {
				handleCommentError({
					msg: "系统错误,请稍后再试"
				})
				reject(err)
			}
		})
	})
}
/**
 * 通用的异常信息提示
 * @param {Object} res
 */
function handleCommentError(res) {
	console.log(res);
	uni.showToast({
		title: res.msg || res.data.msg || "系统错误",
		icon: "none",
		duration: 2000,
	})
}
/**
 * 401处理
 */
function handleUnToken() {
	removeToken()
	uni.showModal({
		title: '提示',
		content: "当前登录无效,请重新登录",
		showCancel: false,
		success: (confirm) => {
			if (confirm) {
				//重定向
				uni.reLaunch({
					url: "/pages/login/login"
				})
			}
		}
	})
}