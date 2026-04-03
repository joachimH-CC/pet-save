import http from "@/utils/request";
/**
 * 查询视频课程详情
 * @param {Object} knowledgeId
 */
export function classVideoDetail(knowledgeId) {
	return http({
		url: `/msKnowledge/classVideo/${knowledgeId}`,
		method: "get",
	})
}
/**
 * 查询视频课程列表
 */
export function classVideoList() {
	return http({
		url: "/msKnowledge/classVideo",
		method: "get",
	})
}
/**
 * 查询知识测试列表
 */
export function testList() {
	return http({
		url: "/msKnowledge/test",
		method: "get",
	})
}
/**
 * 用户第一次点击测试-重新测试
 * @param {Object} data
 */
export function beginTest(data) {
	return http({
		url: "/msKnowledge/test",
		method: "post",
		data
	})
}
/**
 * 查询知识测试详情
 * @param {Object} postId
 */
export function testDetail(knowledgeId) {
	return http({
		url: `/msKnowledge/test/${knowledgeId}`,
		method: "get",
	})
}
/**
 * 测试答题
 * @param {Object} postId
 */
export function testAnswer(data) {
	return http({
		url: "/msKnowledge/testAnswer",
		method: "post",
		data
	})
}
/**
 * 用户知识页面数据显示
 * @param {Object} postId
 */
export function knowledgeHome() {
	return http({
		url: "/msKnowledge/home",
		method: "get",
	})
}
/**
 * 用户课堂视频数据保存
 * @param {Object} postId
 */
export function watchVideo(data) {
	return http({
		url: "/msClassWatch/classVideo",
		method: "put",
		data
	})
}