import http from "@/utils/request";

/**
 * 首页轮播图
 */
export function homeBanner() {
	return http({
		url: "/user/home/page/banner",
		method: "get",
		isToken: false
	})
}
/**
 * 首页宠物列表
 * @param {Object} data
 */
export function userHomePetList(data) {
	return http({
		url: "/user/home/page/pet/list",
		method: "get",
		data,
		isToken: false
	})
}
/**
 * 宠物详情
 * @param {Object} petId
 */
export function petDetail(petId) {
	return http({
		url: `/user/home/page/pet/details/${petId}`,
		method: "get",
	})
}