import http from "@/utils/request";
/**
 * 护理列表
 * @param {Object} data
 */
export function petNurseList(petId) {
	return http({
		url: `/msNurse/list/${petId}`,
		method: "get",
	})
}
/**
 * 添加护理
 * @param {Object} data
 */
export function addNurse(data) {
	return http({
		url: '/msNurse',
		method: "post",
		data
	})
}
/**
 * 编辑护理
 * @param {Object} data
 */
export function delNurse(nurseId) {
	return http({
		url: `/msNurse/${nurseId}`,
		method: "delete",
	})
}