<template>
	<view class="user content">
		<view class="header">
			<view class="user-info flex">
				<!-- <u-avatar :src="personData.avatar" size="100rpx" mode="widthFix"></u-avatar> -->
				<u--image :src="personData.avatar" shape="circle" width="100rpx" height="100rpx"></u--image>
				<view style="margin: 0 20rpx;">
					<u--text :margin="'16rpx 0 10rpx 0'" bold :text="personData.nickName" size="13"
						color="#ffffff"></u--text>
					<u--text :text="personData.introduction" size="11" color="#eff2ff"></u--text>
				</view>
			</view>
		</view>
		<view class="user-container">
			<u--text :margin="'6rpx 0 20rpx 0'" bold text="个人中心" size="13"></u--text>
			<u-cell-group>
				<u-cell icon="account-fill" title="个人资料" :isLink="true" @click="toPersonInfo"></u-cell>
				<u-cell icon="coupon-fill" title="实名认证" :isLink="personData.idCardExist!=1" @click="toIdentify">
					<template #value>
						<view v-if="personData.idCardExist==1">
							<u-tag text="已认证" size="mini" plainFill plain></u-tag>
						</view>

					</template>
				</u-cell>
				<u-cell v-if="role==2" icon="heart-fill" title="我的收藏" :isLink="true" @click="toCollect"> </u-cell>
				<u-cell icon="file-text-fill" title="我的帖子" :isLink="true" @click="toMyPost"></u-cell>
				<!-- 救助者端 -->
				<u-cell v-if="role==101" icon="server-fill" title="发出回访" :isLink="true" @click="toVisitList"></u-cell>
				<u-cell v-if="role==101" icon="order" title="领养申请审核" :isLink="true" @click="toAdoptList"></u-cell>

				<u-cell v-if="role==2" icon="order" title="我的领养" :isLink="true" @click="toMyAdopt"></u-cell>
				<u-cell icon="question-circle-fill" title="疑问与反馈" :isLink="true" @click="toQuestion"></u-cell>
			</u-cell-group>
			<view style="margin: 20rpx  0;">
				<u-button color="#5f82c7" text="退出登录" size="small" @click="exitSystem"></u-button>
			</view>
		</view>
		<custom-tab-bar></custom-tab-bar>
	</view>
</template>

<script>
	import {
		logout
	} from '../../api/commonApi/common';
	import {
		personCenter,
		personInfo
	} from '../../api/commonApi/person';
	import {
		removeToken
	} from '../../utils/auth';
	import CustomTabBar from '@/components/CustomTabBar.vue';
	export default {
		components: {
			CustomTabBar,
		},
		data() {
			return {
				role: 2,
				personData: undefined,
			}
		},
		onLoad() {
			this.getPersonInfo()
		},
		computed: {
			getRole() {
				this.role = this.$store.state.roleId
			},
		},
		methods: {
			exitSystem() {
				uni.showModal({
					title: '提示',
					content: "是否确定退出登录?",
					success: ({
						confirm
					}) => {
						if (confirm) {
							removeToken()
							//重定向
							uni.reLaunch({
								url: "/pages/login/login"
							})


						}
					}
				})

			},
			getPersonInfo() {
				personCenter().then(res => {
					console.log(res);
					this.personData = res.data
				})
			},
			toPersonInfo() {
				uni.navigateTo({
					url: "/pages/userList/personInfo/personInfo"
				})
			},
			toIdentify() {
				if (this.personData.idCardExist == 1) return
				uni.navigateTo({
					url: "/pages/userList/identify/identify"
				})
			},
			toCollect() {
				uni.navigateTo({
					url: "/pages/userList/myCollect/myCollect"
				})
			},
			toMyPost() {
				uni.navigateTo({
					url: "/pages/userList/myPost/myPost"
				})
			},
			toMyAdopt() {
				uni.navigateTo({
					url: "/pages/userList/myAdopt/myAdopt"
				})
			},
			toQuestion() {
				uni.navigateTo({
					url: "/pages/userList/myQuestion/myQuestion"
				})
			},
			toVisitList() {
				uni.navigateTo({
					url: "/pages/userList/visitList/visitList"
				})
			},
			toAdoptList() {
				uni.navigateTo({
					url: "/pages/saverApplyList/applyList/applyList"
				})
			}
		}
	}
</script>

<style lang="scss">
	.user {
		.header {
			padding: 30rpx;
			box-sizing: border-box;
			background: linear-gradient(to right, #7198cf, #5372c1);
			border-radius: 20rpx;
			box-shadow: 2rpx 2rpx 9rpx 10rpx rgba(128, 151, 202, 0.2);
		}

		.user-container {
			margin-top: 20rpx;
			box-sizing: border-box;
			padding: 20rpx;
			border-radius: 20rpx;
			box-shadow: 2rpx 2rpx 9rpx 10rpx rgba(128, 151, 202, 0.2);

			.u-cell {
				margin: 10rpx 0;
			}

			.u-cell__title-text {
				font-size: 26rpx !important;
			}

			.u-icon__icon {
				color: #5372c1 !important;
				margin-right: 6rpx;
				padding: 6rpx;
				box-sizing: border-box;
				border-radius: 10rpx;
				background-color: #e9f1fb;
			}

			.u-icon__icon--info {
				background-color: #fff;
			}

			.u-button {
				width: 300rpx;
			}
		}

		.u-image {
			border: 4rpx solid #fff;

		}
	}
</style>