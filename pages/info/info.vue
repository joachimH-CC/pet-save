<template>
	<view class="info content">
		<view class="info-container">
			<u--text text="最近消息" :margin="'10rpx 0 6rpx 0'" size="28rpx" color="#7e7f86" bold></u--text>
			<view>
				<common-scroll-list v-if="chatList.length>0" :items="chatList" :pageSize="8"
					height="calc(100vh - 200rpx)" keyField="chatPartnerId">
					<template v-slot="{ item, index }">
						<view class="item" @click="toChat(item)">
							<view class="flex">
								<view class="icon" v-if="item.chatPartnerId==0">
									<u-icon name="bell-fill" size="50rpx" color="#597dca"></u-icon>
								</view>
								<view class="icon-green" v-if="item.chatPartnerId==-1">
									<u-icon name="home-fill" size="50rpx" color="#36b248"></u-icon>
								</view>
								<u-avatar v-if="item.chatPartnerId>0" size="49" mode="aspectFill"
									:src="item.avatar"></u-avatar>
								<view class="msg-title">
									<view :class="{'badge':item.unReadCount>0}">
										<u--text :margin="'16rpx 0 0 0'" bold :text="item.nickName" size="13"
											color="#494949"></u--text>
									</view>
									<u--text :margin="'10rpx 0 0 0'" :text="item.content" lines="1" size="10"
										color="#7e7f86"></u--text>
								</view>
								<u-icon class="time" :name="item.lastSendTime" size="22rpx"></u-icon>
							</view>
						</view>
					</template>
				</common-scroll-list>
				<view v-if="chatList.length==0">
					<u-empty mode="message" text="还没有消息哦 ^_^"></u-empty>
				</view>
			</view>

		</view>
		<custom-tab-bar></custom-tab-bar>
	</view>
</template>

<script>
	import {
		adoptCenter,
		chatRecordList
	} from '../../api/commonApi/chat';
	import CommonScrollList from '@/components/CommonScrollList.vue';
	import CustomTabBar from '@/components/CustomTabBar.vue';
	export default {
		components: {
			CustomTabBar,
			CommonScrollList
		},
		data() {
			return {
				chatList: []
			}
		},
		async onShow() {
			await this.getChatList()

		},
		onLoad() {
			this.getAdoptCenter()
			this.getChatList()
		},
		methods: {
			getChatList() {
				chatRecordList().then(res => {
					console.log(res);
					this.chatList = res.data.map(item => {
						return {
							...item,
							content: this.splitString(item.lastContent)[0]
						}
					})
				})
			},
			splitString(str, separator = '::') {
				if (!str || typeof str !== 'string') {
					return [];
				}
				return str.split(separator, 2);
			},
			toInfoList() {
				uni.navigateTo({
					url: "/pages/infoList/infoList/infoList"
				})
			},
			getAdoptCenter() {
				adoptCenter().then(res => {
					console.log(res);
				})
			},
			toChat(item) {
				let data = {}
				data = {
					chatPartnerId: item.chatPartnerId,
					avatar: item.avatar,
					nickName: item.nickName,
				}

				uni.navigateTo({
					url: `/pages/infoList/chat/chat?data=${encodeURIComponent(JSON.stringify(data))}`
				})
			},
		}
	}
</script>

<style lang="scss">
	.info {
		.item {
			padding: 20rpx;
			border-bottom: 2rpx solid #cdcdcd;

			.msg-title {
				margin-left: 20rpx;
				width: 600rpx;

				.badge {


					.u-text__value::after {
						content: " . ";
						position: relative;
						bottom: 20rpx;
						right: - 6rpx;
						font-size: 50rpx;
						color: #d66865;
					}


				}
			}




			.icon {
				.u-icon.data-v-172979f2 {
					padding: 26rpx !important;
					box-sizing: border-box;
					border-radius: 50%;
					background-color: #ebf3ff;

				}
			}

			.icon-green {
				.u-icon.data-v-172979f2 {
					padding: 26rpx !important;
					box-sizing: border-box;
					border-radius: 50%;
					background-color: #e5f4e7;

				}
			}
		}


	}
</style>