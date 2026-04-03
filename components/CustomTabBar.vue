<template>
	<view class="custom">
		<u-tabbar class="tab" activeColor="#597dca" :value="tabbarIndex" :safeAreaInsetBottom="false">
			<u-tabbar-item v-for="(item,index) in tabbarList" :key="index" :text="item.text" :icon="item.icon"
				:name="item.pagePath" @click="switchTab(item,index)"></u-tabbar-item>
		</u-tabbar>
	</view>
</template>

<script>
	export default {
		name: "CustomTabBar",
		options: {
			styleIsolation: 'shared'
		},
		data() {
			return {
				tabbarIndex: 0,
				tabbarList: [{
						pagePath: "pages/index/index",
						text: "首页",
						icon: 'home-fill'
					}, {
						pagePath: "pages/community/community",
						text: "社区",
						icon: 'chat-fill'
					},
					{
						pagePath: "pages/info/info",
						text: "消息",
						icon: 'email-fill'
					},
					{
						pagePath: "pages/user/user",
						text: "我的",
						icon: 'account-fill'
					},
				]
			};
		},
		created() {
			this.getCurrentPage()
		},
		methods: {
			//获取页面实例
			getCurrentPage() {
				const pages = getCurrentPages()
				const {
					route: curPagePath
				} = pages[pages.length - 1]
				this.tabbarIndex = curPagePath
			},
			switchTab(item, index) {
				uni.switchTab({
					url: "/" + item.pagePath
				})
			}
		}
	}
</script>

<style lang="scss">
	.custom {
		.u-tabbar__content__item-wrapper {
			height: 120rpx;
		}

		.u-border-top {
			border-top: 6rpx solid #a2b7ef !important;
			border-radius: 30rpx;
		}
	}
</style>