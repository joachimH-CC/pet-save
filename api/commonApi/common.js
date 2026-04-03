import http from "@/utils/request";
/**
 * 查询宠物性格-品种标签列表
 * @param {Object} data
 */
export function petLabel(data) {
	return http({
		url: "/msLabel/pet/label",
		method: "get",
		data
	})
}
/**
 * 查询宠物类型列表
 * @param {Object} data
 */
export function petType() {
	return http({
		url: "/msPetType/pet/label",
		method: "get",
	})
}
/**
 * 登录
 * @param {Object} data
 */
export function login(data) {
	return http({
		url: "/common/user/login",
		method: "post",
		data,
		isToken: false
	})
}
/**
 * 登录
 * @param {Object} data
 */
export function logout() {
	return http({
		url: "/common/logout",
		method: "post",
	})
}