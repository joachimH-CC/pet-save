import http from "@/utils/request";
/**
 * 需回访宠物列表
 * @param {Object} data
 */
export function returnPetList(data) {
	return http({
		url: "/msReturnVisit/list",
		method: "get",
		data
	})
}
/**
 * 添加护理
 * @param {Object} data
 */
export function visitList(applyId) {
	return http({
		url: `/msReturnVisit/list/${applyId}`,
		method: "get",
	})
}

/**
 * 编辑护理
 * @param {Object} data
 */
export function addPetVisit(data) {
	return http({
		url: "/msReturnVisit",
		method: "post",
		data
	})
}
/**
 * 编辑护理
 * @param {Object} data
 */
export function editPetVisit(data) {
	return http({
		url: "/msReturnVisit",
		method: "put",
		data
	})
}
/**
 * 删除记录
 * @param {Object} data
 */
export function deleteVisit(returnVisitId) {
	return http({
		url: `/msReturnVisit/${returnVisitId}`,
		method: "delete",
	})
}