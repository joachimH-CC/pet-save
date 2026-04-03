import http from "@/utils/request";
/**
 * 添加帖子
 * @param {Object} data
 */
export function addPost(data) {
	return http({
		url: "/msPost",
		method: "post",
		data,
	})
}
/**
 * 编辑帖子
 * @param {Object} data
 */
export function editPost(data) {
	return http({
		url: "/msPost",
		method: "put",
		data
	})
}
/**
 * 模糊查询社区帖子
 * @param {Object} data
 */
export function msPostList(data) {
	return http({
		url: "/msPost/list",
		method: "get",
		data
	})
}
/**
 * 查询社区帖子详情
 * @param {Object} postId
 */
export function msPostDetail(postId) {
	return http({
		url: `/msPost/${postId}`,
		method: "get",
	})
}
/**
 * 删除帖子
 * @param {Object} postId
 */
export function deleteMsPost(postId) {
	return http({
		url: `/msPost/${postId}`,
		method: "delete",
	})
}
/**
 * 发表评论
 * @param {Object} data
 */
export function comment(data) {
	return http({
		url: '/msComment',
		method: "post",
		data,
	})
}
/**
 * 发表评论
 * @param {Object} commentId
 */
export function deleteComment(commentId) {
	return http({
		url: `/msComment/${commentId}`,
		method: "delete",
	})
}
/**
 * 对帖子进行点赞
 * @param {Object} postId
 */
export function likePost(postId) {
	return http({
		url: `/msPost/like/${postId}`,
		method: "put",
	})
}
/**
 *对帖子进行取消点赞
 * @param {Object} postId
 */
export function dislikePost(postId) {
	return http({
		url: `/msPost/removeLike/${postId}`,
		method: "put",
	})
}