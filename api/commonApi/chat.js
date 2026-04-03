import http from "@/utils/request";
/**
 * 查询消息列表
 * @param {Object} data
 */
export function chatRecordList() {
	return http({
		url: "/msChatRecord/list",
		method: "get",
	})
}
/**
 * 查看聊天记录
 * @param {Object} data
 */
export function chatHistory(data) {
	return http({
		url: "/msChatRecord/chat/history",
		method: "get",
		data
	})
}
/**
 *领养提醒
 * @param {Object} data
 */
export function adoptCenter(data) {
	return http({
		url: "/msChatRecord/adopt/notice",
		method: "get",
	})
}