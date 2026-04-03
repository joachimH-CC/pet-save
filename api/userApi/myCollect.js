import http from "@/utils/request";

/**
 * 我的收藏
 * @param {Object} data
 */
export function userCollect() {
	return http({
		url: "/msUserCollection",
		method: "get",
	})
}
/**
 * 用户设置领养提醒
 * @param {Object} data
 */
export function adoptNotice(data) {
	return http({
		url: "/msUserCollection/set/adopt/notice",
		method: "post",
		data,
		header: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
	})
}