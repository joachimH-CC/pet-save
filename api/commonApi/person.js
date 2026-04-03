import http from "@/utils/request";
/**
 * 查询当前用户id
 * @param {Object} data
 */
export function personUserId() {
	return http({
		url: "/person/center/getUserId",
		method: "get",
	})
}
/**
 * 个人中心页
 * @param {Object} data
 */
export function personCenter() {
	return http({
		url: "/person/center",
		method: "get",

	})
}
/**
 * 实名认证
 * @param {Object} data
 */
export function idCard(data) {
	return http({
		url: "/person/center/idCard",
		method: "post",
		data
	})
}
/**
 * 查询个人资料
 * @param {Object} data
 */
export function personInfo() {
	return http({
		url: "/person/center/info",
		method: "get",
	})
}
/**
 * 修改个人资料
 * @param {Object} data
 */
export function editPersonInfo(data) {
	return http({
		url: "/person/center/info",
		method: "put",
		data
	})
}
/**
 * 查询我的帖子列表
 * @param {Object} data
 */
export function userPost() {
	return http({
		url: "/person/center/post",
		method: "get",
	})
}
/**
 * 历史反馈
 * @param {Object} data
 */
export function historyFeedback() {
	return http({
		url: "/msFeedback/history/feedback",
		method: "get",
	})
}
/**
 * 发送反馈
 * @param {Object} data
 */
export function sendFeedback(data) {
	return http({
		url: "/msFeedback/send/feedback",
		method: "post",
		data,
		header: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
	})
}