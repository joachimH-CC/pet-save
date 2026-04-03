import http from "@/utils/request";
/**
 * 宠物详情页图片和视频
 * @param {Object} petId
 */
export function petDetailFiles(petId) {
	return http({
		url: `/user/home/page/pet/details/file/${petId}`,
		method: "get",
	})
}
/**
 * 宠物详情页救助信息
 * @param {Object} petId
 */
export function petDetailRescueInfo(petId) {
	return http({
		url: `/user/home/page/pet/rescue/info/${petId}`,
		method: "get",
	})
}
/**
 * 宠物详情页申请状态
 * @param {Object} data
 */
export function userApplyStatus(petId) {
	return http({
		url: `/user/home/page/status/${petId}`,
		method: "get",
	})
}
/**
 * 申请领养
 * @param {Object} data
 */
export function applyAdopt(data) {
	return http({
		url: "/user/home/page/adopt",
		method: "post",
		data,
	})
}
/**
 * 取消-收藏宠物
 * @param {Object} petId
 */
export function petCollect(petId) {
	return http({
		url: `/user/home/page/pet/collect/${petId}`,
		method: "put",
	})
}
/**
 * AI审核领养申请
 * @param {Object} petId
 */
export function aiApply(data) {
	return http({
		url: "/ai",
		method: "post",
		data
	})
}