import http from "@/utils/request";

/**
 * 领养
 * @param {Object} data
 */
export function userApplyPet(data) {
	return http({
		url: "/msApply/user/apply/pet",
		method: "get",
		data,
	})
}
/**
 * 查看领养审核流程
 * @param {Object} data
 */
export function applyReview(petId) {
	return http({
		url: `/msApply/pet/review/${petId}`,
		method: "get",
	})
}
/**
 * 取消领养
 * @param {Object} data
 */
export function cancelApply(applyId) {
	return http({
		url: `/msApply/pet/apply/cancel/${applyId}`,
		method: "put",
	})
}
/**
 * 审核流程中宠物基本详情
 * @param {Object} data
 */
export function petApplyDetail(petId) {
	return http({
		url: `/msApply/pet/detail/${petId}`,
		method: "get",
	})
}