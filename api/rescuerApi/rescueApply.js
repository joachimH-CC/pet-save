import http from "@/utils/request";
/**
 * 申请列表
 * @param {Object} data
 */
export function rescueApplyList(data) {
	return http({
		url: "/msApply/list",
		method: "get",
		data
	})
}
/**
 * 申请详情
 * @param {Object} data
 */
export function rescueApplyDetail(applyId) {
	return http({
		url: `/msApply/${applyId}`,
		method: "get",
	})
}
/**
 * 申请审核通过
 * @param {Object} data
 */
export function approvedApply(data) {
	return http({
		url: "/msApply/approved",
		method: "put",
		data
	})
}
/**
 * 申请审核拒绝通过
 * @param {Object} data
 */
export function refuseApply(data) {
	return http({
		url: '/msApply/refuse',
		method: "put",
		data
	})
}
/**
 * 签署合同
 * @param {Object} data
 */
export function comfirmContract(data) {
	return http({
		url: '/msApply/contract',
		method: "put",
		data
	})
}