import http from "@/utils/request";

/**
 * AI自动审核问卷筛选合适领养宠物列表
 * @param {Object} data
 */
export function aiPetList() {
	return http({
		url: "/ai",
		method: "get",
	})
}
/**
 * AI自动创建问卷调查
 * @param {Object} data
 */
export function aiSearch(data) {
	return http({
		url: "/ai/knowledge",
		method: "post",
		data,
	})
}
/**
 * 返回用户是否有进行过问卷调查
 * @param {Object} data
 */
export function isQuestionnaire() {
	return http({
		url: "/msKnowledge/isQuestionnaire",
		method: "get",
	})
}