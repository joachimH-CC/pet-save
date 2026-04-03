import http from "@/utils/request";
/**
 * 宠物列表
 * @param {Object} data
 */
export function rescuePetList(data) {
	return http({
		url: "/msRescue/page",
		method: "get",
		data,
	})
}
/**
 * 宠物详情
 * @param {Object} data
 */
export function rescuePetDetail(rescueId) {
	return http({
		url: `/msRescue/${rescueId}`,
		method: "get",
	})
}
/**
 * 添加宠物
 * @param {Object} data
 */
export function addPet(data) {
	return http({
		url: "/msRescue",
		method: "post",
		data
	})
}
/**
 * 编辑宠物
 * @param {Object} data
 */
export function editPet(data) {
	return http({
		url: "/msRescue",
		method: "put",
		data,
	})
}

/**
 *删除宠物
 * @param {Object} data
 */
export function deletePet(rescueId) {
	return http({
		url: `/msRescue/${rescueId}`,
		method: "delete",
	})
}