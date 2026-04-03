<template>
	<view class="my-post content">
		<common-scroll-list :items="postList" :pageSize="4" height="calc(100vh - 80rpx)" keyField="postId">
			<template v-slot="{ item, index }">
				<view class="item" @click="toPostDetail(item.postId)">
					<view class="user-info flex">
						<u--image :src="item.avater" shape="circle" width="90rpx" height="90rpx"></u--image>
						<view style="margin: 0 20rpx;">
							<u--text :margin="'16rpx 0 6rpx 0'" bold :text="item.nickName" size="13"
								color="#494949"></u--text>
							<u--text :text="item.createTime" size="10" color="#7e7f86"></u--text>
						</view>
					</view>
					<u--text lines="2" :margin="'10rpx'" :text="item.title" size="12" color="#494949"></u--text>
					<u--image :src="item.postImages[0]" radius="20rpx" width="300rpx" height="200rpx"></u--image>
					<view class="flex">
						<u-icon v-if="item.isUserLike == 0" name="thumb-up" color="#6887cb" labelPos="right"
							:label="item.likeNum" labelSize="24rpx"></u-icon>
						<u-icon v-if="item.isUserLike == 1" name="thumb-up-fill" color="#6887cb" labelPos="right"
							:label="item.likeNum" labelSize="24rpx"></u-icon>
						<u-icon name="chat-fill" color="#6887cb" labelPos="right" :label="item.commentNum"
							labelSize="24rpx"></u-icon>
						<view class="flex" style="margin-left: 240rpx;" @click.stop>
							<u-button icon="edit-pen-fill" text="编辑" color="#e6f4ff" size="mini"
								@click="editPost(item.postId)"></u-button>
							<u-button icon="trash-fill" text="删除" size="mini" type="error"
								@click="delPost(item.postId)"></u-button>
						</view>
					</view>
				</view>
			</template>
		</common-scroll-list>
		<view v-if="postList.length == 0">
			<u-empty mode="list" text="快去发布帖子吧 ^_^"></u-empty>
		</view>

	</view>
</template>

<script>
import {
	userPost
} from '@/api/commonApi/person';
import {
	deleteMsPost
} from '@/api/userApi/community';
import CommonScrollList from '@/components/CommonScrollList.vue';
export default {
	components: {
		CommonScrollList
	},
	data() {
		return {
			postList: []
		};
	},
	onLoad() {
		this.getMyPost()
	},
	methods: {
		editPost(id) {
			console.log(id);
			uni.navigateTo({
				url: `/pages/postList/editPost/editPost?postId=${id}`
			})
		},
		getMyPost() {
			userPost().then(res => {
				console.log(res);
				this.postList = res.data
			})
		},
		toPostDetail(id) {
			uni.navigateTo({
				url: `/pages/postList/postDetail/postDetail?postId=${id}`
			})
		},
		delPost(id) {
			uni.showModal({
				title: '提示',
				content: "是否确定删除帖子",
				success: ({
					confirm
				}) => {
					if (confirm) {
						deleteMsPost(id).then(res => {
							console.log(res);
							uni.showToast({
								title: "删除成功!",
								icon: "none"
							})
							this.getMyPost()
						})
					}
				}
			})

		}
	}
}
</script>

<style lang="scss">
.my-post {

	.item {
		padding: 20rpx;
		box-sizing: border-box;
		background-color: #fff;
		margin-bottom: 20rpx;
		border-bottom: 2rpx solid #d2dbef;

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

		.u-button--mini {
			color: #6786c9 !important;
			margin-left: 10rpx;

			.u-icon__icon {
				color: #6786c9 !important;
			}
		}

		.u-icon--right {
			margin: 10rpx;
		}

		.u-button--error {
			background-color: #fcf0f0;
			color: #d94048 !important;
			border-color: #fcf0f0;

			.u-icon__icon {
				color: #d94048 !important;
			}
		}

	}
}
</style>