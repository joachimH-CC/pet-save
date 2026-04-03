<template>
	<view class="community">
		<u-subsection bgColor="#6887cb" activeColor="#5c7bc5" inactiveColor="#fff" :list="list" :current="curNow"
			@change="sectionChange"></u-subsection>
		<u-loadmore v-if="loading" status="loading" />
		<view class="community-container">
			<common-scroll-list :items="postList" :pageSize="3" height="calc(100vh - 240rpx)" keyField="postId"
				@scrolltolower="onScrollToLower" @load="handleload">
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
						<u--image v-if="item.postPicture" :src="item.postPicture.path" radius="20rpx" width="90%"
							height="300rpx"></u--image>
						<view class="flex">
							<u-icon v-if="item.isUserLike==1" name="thumb-up-fill" color="#6887cb" labelPos="right"
								:label="item.likeNum" labelSize="24rpx"></u-icon>
							<u-icon v-if="item.isUserLike==0" name="thumb-up" color="#6887cb" labelPos="right"
								:label="item.likeNum" labelSize="24rpx"></u-icon>
							<u-icon name="chat-fill" color="#6887cb" labelPos="right" :label="item.commentNum"
								labelSize="24rpx"></u-icon>
						</view>
					</view>
				</template>
			</common-scroll-list>
		</view>
		<view class="add-btn">
			<u-icon @click="toEditPost" size="100rpx" name="plus-circle-fill" color=" rgb(78, 112, 187,0.7)"></u-icon>
		</view>
		<custom-tab-bar></custom-tab-bar>
	</view>
</template>

<script>
	import CommonScrollList from '@/components/CommonScrollList.vue';
	import {
		msPostList
	} from '@/api/userApi/community';
	import CustomTabBar from '@/components/CustomTabBar.vue';
	export default {
		components: {
			CustomTabBar,
			CommonScrollList
		},
		data() {
			return {
				curNow: 0,
				type: '',
				//0-生活记录，1-领养动态，2-饲养经验，3-救助故事
				list: ['全部', '生活记录', '领养动态', '饲养经验', '宠物救助'],
				postList: [],
				loading: false,
			}
		},
		onLoad() {
			this.getPostList()
		},
		onShow() {
			this.getPostList()
		},
		methods: {
			getPostList() {
				this.loading = true
				msPostList({
					type: this.type
				}).then(res => {
					console.log(res);
					this.loading = false
					this.postList = res.data
				})
			},
			handleload(payload) {
				// 每次 loadMore 完成后触发
				console.log('loaded', payload);
			},
			onScrollToLower() {
				// 可选：scrolltolower 事件拦截
				//console.log('reached bottom in wrapper');
			},
			sectionChange(val) {
				this.curNow = val
				if (val == 0) {
					this.type = ''
				} else {
					this.type = val - 1
				}
				this.getPostList()
				console.log(val);
			},
			toPostDetail(id) {
				uni.navigateTo({
					url: `/pages/postList/postDetail/postDetail?postId=${id}`
				})
			},
			toEditPost() {
				uni.navigateTo({
					url: "/pages/postList/editPost/editPost"
				})
			}
		}
	}
</script>

<style lang="scss">
	.community {
		padding: 30rpx;


		.community-container {
			margin-top: 20rpx;
			height: 81vh;

			.item {
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

				.u-icon--right {
					margin: 10rpx;
				}

			}
		}


	}

	.add-btn {
		position: fixed;
		bottom: 200rpx;
		right: 10rpx;
	}
</style>