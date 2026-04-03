<template>
	<view class="post-detail content">
		<u-loadmore v-if="loading" status="loading" />
		<view ref="postRef" class="post-container" v-if="postInfo">
			<view class="user-info flex">
				<u--image :src="postInfo.avatar" shape="circle" width="90rpx" height="90rpx"></u--image>
				<view style="margin: 0 20rpx;">
					<u--text :margin="'16rpx 0 6rpx 0'" bold :text="postInfo.nickName" size="13"
						color="#494949"></u--text>
					<u--text :text="postInfo.createTime" size="10" color="#7e7f86"></u--text>
				</view>
			</view>
			<!-- <view class="post-label flex">
				<view class="tag"><u-tag shape="circle" text="#领养" borderColor="#e6f4ff" color="#6887cb"
						bgColor="#e6f4ff" plain size="mini"> </u-tag>
				</view>
				<view class="tag"><u-tag shape="circle" text="#猫咪" borderColor="#e6f4ff" color="#6887cb"
						bgColor="#e6f4ff" size="mini" plain></u-tag>
				</view>
			</view> -->
			<u--text :margin="'10rpx 4rpx'" :text="postInfo.title" size="13" bold color="#6887cb"></u--text>
			<view class="post-content">
				<u--text :text="postInfo.content" size="13"></u--text>
			</view>
			<u-grid :border="false" v-if="postInfo && postInfo.postFiles.length>0" col="3">
				<u-grid-item v-for="(item,i) in postInfo.postFiles" :key="i">
					<u--image :src="item.path" width="220rpx" height="220rpx"></u--image>
				</u-grid-item>
			</u-grid>
			<view class="flex">

				<u-icon v-if="postInfo.isUserLike==1" name="thumb-up-fill" color="#6887cb" @click="handleDislikePost"
					labelPos="right" :label="postInfo.likeNum" labelSize="24rpx"></u-icon>
				<u-icon v-if="postInfo.isUserLike==0" name="thumb-up" color="#6887cb" @click="handleLikePost"
					labelPos="right" :label="postInfo.likeNum" labelSize="24rpx"></u-icon>
				<u-icon name="chat-fill" color="#6887cb" labelPos="right" :label="postInfo.commentNum"
					labelSize="24rpx"></u-icon>
			</view>
		</view>
		<view class="post-response" v-if="postInfo">
			<!-- 回复评论 -->
			<u--input @confirm="handleEnter()" :placeholderStyle="{fontSize:'20rpx'}" placeholder="说点什么..."
				border="surround" v-model="response" shape="circle"></u--input>
			<u--text :margin="'20rpx 4rpx'" :text="'评论('+postInfo.commentNum+')'" size="13" bold
				color="#6887cb"></u--text>
			<common-scroll-list :items="postInfo.commentList" :pageSize="7" :height="commentHeight"
				keyField="commentId">
				<template v-slot="{ item, index }">
					<view v-if="item">
						<view class="response-item flex" @longpress="responseComment(item.commentId)">
							<u--image :src="item.avatar" shape="circle" width="80rpx" height="80rpx"></u--image>
							<view style="margin: 0 20rpx;">
								<u-row justify="space-between" style="width: 500rpx !important;">
									<u--text :margin="'0 0 6rpx 0'" bold :text="item.nickName" size="11"
										color="#494949"></u--text>
									<u-icon name="trash" @click="delComment(item.commentId)" v-if="item.isMy"></u-icon>
									<!-- <u-icon name="楼主" size="22rpx" v-if="item.isUser"></u-icon> -->
								</u-row>
								<u--text :margin="'0 0 6rpx 0'" :text="item.content" size="11"
									color="#525257"></u--text>
								<u--text :text="item.createTime" size="10" color="#7e7f86"></u--text>
							</view>

						</view>
						<view class="comment-item flex" style="margin-left: 50rpx;" v-if="item.comments"
							v-for="(comment,i) in item.comments" :key="i">
							<u--image :src="item.avatar" shape="circle" width="70rpx" height="70rpx"></u--image>
							<view style="margin: 0 10rpx;">
								<u-row justify="space-between">
									<u--text :margin="'0 0 6rpx 0'" bold :text="comment.nickName" size="11"
										color="#494949"></u--text>
									<view>
										<u-icon name="trash" @click="delComment(comment.commentId)"
											v-if="comment.isMy"></u-icon>
										<u-icon name="楼主" size="22rpx" v-if="comment.isUser"></u-icon>
									</view>

								</u-row>
								<u--text :margin="'0 0 6rpx 0'" :text="comment.content" size="11"
									color="#525257"></u--text>
								<u--text :text="comment.createTime" size="10" color="#7e7f86"></u--text>
							</view>
						</view>

					</view>
				</template>
			</common-scroll-list>

		</view>
		<u-popup :show="show" @close="close" :round="10">
			<view class="response-pop">
				<u--input @confirm="handleEnter()" :placeholderStyle="{fontSize:'20rpx'}" placeholder="说点什么..."
					border="surround" v-model="response" shape="circle"></u--input>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import CommonScrollList from '@/components/CommonScrollList.vue';
	import {
		personUserId
	} from '../../../api/commonApi/person';
	import {
		comment,
		deleteComment,
		dislikePost,
		likePost,
		msPostDetail
	} from '@/api/userApi/community';
	export default {
		components: {
			CommonScrollList
		},
		data() {
			return {
				show: false,
				loading: false,
				// src: "../../../../static/01.png",
				response: "",
				postInfo: undefined,
				postId: undefined,
				userId: undefined,
				display: 0,
				relaterId: undefined,
				commentHeight: "calc(100vh - 810rpx)"
			};
		},
		onLoad(options) {
			console.log('接收的参数：', options);
			this.postId = options.postId || 0
			// 获取数据
			this.getPostDetail(options.postId);
			this.getUserId()

		},
		methods: {
			//发出评论
			handleEnter() {
				if (!this.response) return
				let id = this.postId
				if (this.display == 1) {
					id = this.relaterId
				}

				const data = {
					relaterId: id,
					display: this.display,
					content: this.response
				};
				comment(data).then(res => {
					console.log(res);
					this.response = ""
					this.getPostDetail(this.postId)
					if (this.display == 1) this.show = false
				})

			},
			getPostDetail(id) {
				this.loading = true
				msPostDetail(id).then(res => {
					console.log(res);
					if (res.data.postFiles.length == 0) {
						this.commentHeight = "calc(100vh - 590rpx)"
					}
					res.data.commentList = res.data.commentList.map(item => {
						if (item.comments.length > 0) {
							item.comments = item.comments.map(i => {
								return {
									...i,
									isMy: this.userId == i.userId,
									isUser: res.data.userId == i.userId
								}
							})
						}
						return {
							...item,
							isMy: this.userId == item.userId,
							isUser: res.data.userId == item.userId
						}
					})

					this.postInfo = res.data
					console.log(this.postInfo);
					this.loading = false
				})
			},
			//获取当前用户id
			getUserId() {
				personUserId().then(res => {
					//console.log(res);
					this.userId = res.data
				})
			},
			//删除评论
			delComment(val) {
				deleteComment(val).then(res => {
					console.log(res);
					uni.showToast({
						icon: "none",
						title: "删除成功"
					})
					this.getPostDetail(this.postId)
				})
			},
			responseComment(val) {
				this.relaterId = val
				this.display = 1
				this.show = true
			},
			close() {
				this.show = false
				this.display = 0
				// console.log('close');
			},
			//点赞
			handleLikePost() {
				likePost(this.postId).then(res => {
					console.log(res);
					this.getPostDetail(this.postId)
				})
			},
			handleDislikePost() {
				dislikePost(this.postId).then(res => {
					console.log(this.postId);
					this.getPostDetail(this.postId)
				})
			}
		}
	}
</script>

<style lang="scss">
	.post-detail {
		.response-pop {
			padding: 20rpx;
		}

		.post-container {
			margin-bottom: 20rpx;
			border-bottom: 2rpx solid #d2dbef;

			.post-content {
				margin: 10rpx 0;
				font-size: 26rpx;
			}

			.post-label {
				padding: 10rpx 0;
				box-sizing: border-box;

				.u-tag--mini {
					height: 20rpx !important;
				}

				.u-tag__text--mini {
					font-size: 20rpx !important;
				}

				.tag {
					margin-right: 10rpx;
				}

			}

			.u-icon--right {
				margin: 10rpx;
			}


		}

		.post-response {
			margin: 10rpx;

			.response-item {
				margin: 20rpx 0;
				padding-bottom: 10rpx;
				border-bottom: 2rpx solid #d1dbec;
			}

			.u-row {
				width: 560rpx;
			}

			.u-icon__icon {
				margin-left: 300rpx;
				color: #6887cb !important;
			}

			.comment-item {

				margin: 20rpx 0;
				padding-bottom: 10rpx;

				.u-row {
					width: 530rpx;
				}

			}
		}

		.u-input__content__field-wrapper input {
			font-size: 24rpx !important;
		}
	}
</style>