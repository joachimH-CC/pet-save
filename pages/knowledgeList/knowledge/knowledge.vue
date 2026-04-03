<template>
	<view class="knowledge content">
		<view class="header">
			<view class="user-info flex">
				<u--image :src="userInfo.avatar" shape="circle" width="100rpx" height="100rpx"></u--image>
				<view style="margin: 0 20rpx;">
					<u--text :margin="'16rpx 0 6rpx 0'" bold :text="userInfo.knowledgeTitle+ ' Lv.'+userInfo.level"
						size="13" color="#ffffff"></u--text>
					<u--text :text="userInfo.progress+'%完成度'" size="10" color="#eff2ff"></u--text>
				</view>
			</view>
			<view>
				<u--text :margin="'10rpx 0 6rpx 0'" :text="'学习进度: '+userInfo.progress+'%'" size="12"
					color="#eff2ff"></u--text>
				<u-line-progress height="16rpx" :percentage="userInfo.progress" activeColor="#ffffff"
					inactiveColor="#8399d2"></u-line-progress>
				<u-tag shape="circle" :text="'领养优先级: '+userInfo.priority" bgColor="#819ad4" size="small"></u-tag>
			</view>
		</view>
		<view class="knowledge-container">
			<h3>领养课堂</h3>
			<u-subsection bgColor="#6887cb" activeColor="#5c7bc5" inactiveColor="#fff" :list="list" :current="curNow"
				@change="sectionChange"></u-subsection>
			<view class="knowledge-content" v-if="curNow == 0">
				<common-scroll v-if="videoList" :items="videoList" :pageSize="5" height="calc(100vh - 560rpx)"
					keyField="knowledgeId">
					<template v-slot="{ item, index }">
						<view v-if="item" class=" item" @click="toPetLesson(item.knowledgeId)">
							<view class="flex">
								<u-icon name="play-circle-fill" size="60rpx" color="#6887cb"></u-icon>
								<view class="essay-msg">
									<view class="flex class-top">
										<u--text :margin="'10rpx 0 6rpx 0'" bold :text="item.title" size="12"
											color="#787878"></u--text>
										<u-tag plainFill plain color="#6988cb" borderColor="#6988cb"
											:text="item.classTypeName" size="mini"></u-tag>
									</view>
									<u--text prefixIcon="clock-fill" :margin="'10rpx 0 6rpx 0'"
										:text="'已观看:' + item.time" size="10" color="#535353"></u--text>
									<u-line-progress height="16rpx" :percentage="item.watchProgress"
										activeColor="#6685ca"></u-line-progress>
								</view>
							</view>
							<u--text :margin="'10rpx 0 6rpx 0'" :lines="1" :text="item.content" size="10"
								color="#535353"></u--text>
						</view>
					</template>
				</common-scroll>
			</view>
			<view class="knowledge-content" v-if="curNow == 1">
				<common-scroll v-if="testList" :items="testList" :pageSize="4" height="calc(100vh - 560rpx)"
					keyField="knowledgeId">
					<template v-slot="{ item, index }">
						<view v-if="item" class="item" :data-id="item.knowledgeId" @click="toPetTest">
							<view class="flex">
								<view style="height: 120rpx;">
									<u-icon name="edit-pen-fill" size="60rpx" color="#6887cb"></u-icon>
								</view>
								<view class="essay-msg">
									<u--text :margin="'10rpx 0 6rpx 0'" bold :text="item.title" size="12"
										color="#787878"></u--text>
									<view class="flex">
										<u--text prefixIcon="star-fill" :margin="'6rpx 2rpx 10rpx 0'"
											:text="'正确率:' + item.completeProgress + '%'" size="10"
											color="#535353"></u--text>
										<u-tag :type="item.testType" plain :text="item.testDifficulty"
											size="mini"></u-tag>
									</view>

									<u-line-progress height="16rpx" :percentage="item.completeProgress"
										activeColor="#6685ca"></u-line-progress>
								</view>
							</view>
						</view>
					</template>
				</common-scroll>
			</view>
		</view>

	</view>
</template>

<script>
	import CommonScroll from '@/components/CommonScrollList.vue';
	import {
		classVideoList,
		knowledgeHome,
		testList
	} from '@/api/userApi/knowlegde';

	export default {
		components: {
			CommonScroll
		},
		data() {
			return {
				userInfo: undefined,
				videoList: [],
				testList: [],
				curNow: 0,
				list: ['视频课程', '知识测试'],
				type: "success" //测试难度样式
			};
		},
		onLoad() {
			this.getClassVideo()
			this.getTestList()
			this.getClassVideo()
		},
		onShow() {
			this.getTestList()
			this.getKnowledgeHome()
		},
		methods: {
			getClassVideo() {
				classVideoList().then(res => {
					this.videoList = res.data.map(item => {
						return {
							...item,
							classTypeName: this.getClassType(item.classType),
							time: this.secondsToMinutes(item.watchTime)

						}
					})
					//console.log(this.videoList);
				})
			},
			getTestList() {
				testList().then(res => {
					this.testList = res.data.map(item => {
						return {
							...item,
							testType: this.getTestType(item.testDifficulty)

						}
					})
					//console.log(this.testList);
				})
			},
			getClassType(val) {
				switch (val) {
					case "0":
						return '品种知识'
					case '1':
						return '养育技巧'
					default:
						return '未知'
						break;
				}
			},
			secondsToMinutes(seconds) {
				if (seconds == 0) {
					return `${seconds}分钟`;
				} else if (seconds < 60) {
					return `${seconds}秒`;
				} else {
					const mins = Math.floor(seconds / 60);
					const secs = seconds % 60;
					return secs === 0 ? `${mins}分` : `${mins}分${secs}秒`;
				}
			},
			getTestType(type) {
				switch (type) {
					case "困难":
						return "error"
						break;
					case "中等":
						return "warning"
						break;
					case "简单":
						return "success"
						break;
				}
			},

			toPetTest(e) {
				const id = e.currentTarget.dataset.id;
				if (!id) {
					console.error('knowledgeId is undefined');
					return;
				}
				uni.navigateTo({
					url: `/pages/knowledgeList/petTest/petTest?knowledgeId=${id}`
				})
			},
			sectionChange(val) {
				this.curNow = val
			},
			getKnowledgeHome() {
				knowledgeHome().then(res => {
					console.log(res);
					this.userInfo = res.data
				})
			},
			toPetLesson(id) {
				uni.navigateTo({
					url: `/pages/knowledgeList/petLesson/petLesson?knowledgeId=${id}`
				})
			},

		}
	}
</script>

<style lang="scss">
	.knowledge {
		background-color: #f8f9fa;

		h3 {
			margin-bottom: 10rpx;
			padding: 10rpx 0;
			box-sizing: border-box;
			font-weight: 600;
			border-bottom: 2rpx solid #c3c3c3;
		}

		.header {
			padding: 20rpx;
			box-sizing: border-box;
			background: linear-gradient(to right, #6988cb, #5372c1);
			border-radius: 20rpx;
			box-shadow: 2rpx 2rpx 9rpx 10rpx rgba(128, 151, 202, 0.2);

			.u-image {
				border: 4rpx solid #fff;
			}

			.u-tag--small {
				width: 170rpx !important;
				margin: 14rpx 0 !important;
				padding: 10rpx 16rpx;
			}

			.u-tag__text--small {
				font-size: 24rpx !important;
			}
		}

		.knowledge-container {
			padding: 20rpx;
			margin-top: 20rpx;
			box-sizing: border-box;
			border-radius: 20rpx;
			background-color: #ffffff;

			.knowledge-content {
				margin: 20rpx 0;

				.item {
					padding: 14rpx;
					margin-bottom: 20rpx;
					border: 2rpx solid #f4f4f5;
					box-sizing: border-box;
					border-radius: 20rpx;

					.u-icon {
						padding: 20rpx;
						box-sizing: border-box;
						border-radius: 20rpx;
						background-color: #e3f2fd;
					}

					.essay-msg {
						width: 100%;
						margin-left: 20rpx;

						.class-top {

							.u-tag--mini {
								width: 74rpx !important;
								height: 30rpx;
								margin: 10rpx 0;

							}
						}

						.u-icon {
							padding: 0;
							background-color: #fff;
							margin-right: 6rpx;
						}

						.u-tag__text--mini {
							font-size: 18rpx !important;
						}

						.u-tag--mini {
							width: 40rpx !important;
							height: 30rpx;
							margin: 10rpx 0;
						}

						.u-icon__icon {
							color: #6988cb !important;
						}
					}
				}
			}
		}
	}
</style>