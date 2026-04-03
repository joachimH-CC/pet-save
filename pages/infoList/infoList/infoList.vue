<template>
	<view class="content info-list">
		<view class="info-list-container">
			<u--text :margin="'6rpx 0 0 0'" bold text="系统通知" size="13" color="#597dca"></u--text>
			<view class="info-item flex" @click="showModel">
				<view style="width: 600rpx;">
					<u--text :margin="'10rpx 0'" bold text="宠物健康提醒" size="13" color="#494949"></u--text>
					<u--text :margin="'10rpx 0 0 0'" lines="1" text="您收藏的'小金有了新动态,健康报告已更新" size="11"
						color="#494949"></u--text>
				</view>
				<u-icon name="10:19" size="22rpx"></u-icon>
			</view>
			<view class="info-item flex">
				<view style="width: 600rpx;">
					<u--text :margin="'10rpx 0'" bold text="测试完成通知" size="13" color="#494949"></u--text>
					<u--text :margin="'10rpx 0 0 0'" lines="1" text="您收藏的'小金有了新动态,健康报告已更新" size="11"
						color="#494949"></u--text>
				</view>
				<u-icon name="昨天" size="22rpx"></u-icon>
			</view>
			<u-modal @confirm="confirmInfo" :show="show" :title="title" :content='content'></u-modal>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				title: undefined,
				content: undefined
			};
		},
		methods: {
			//展示系统通知
			showModel() {
				this.show = true
				this.title = "宠物健康提醒"
				this.content = "您收藏的小金有了新动态,健康报告已更新"
			},
			confirmInfo() {
				this.show = false
			}
		}
	}
</script>

<style lang="scss">
	.info-list {


		.info-list-container {
			padding: 20rpx;

			box-sizing: border-box;
			background-color: #fff;

			.info-item {
				padding: 20rpx 10rpx;
				border-bottom: 2rpx solid #dfdfdf;
			}
		}

	}
</style>