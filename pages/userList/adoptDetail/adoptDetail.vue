<template>
	<view class="adopt-detail content">
		<view class="adopt-detail-container">
			<view class="care-detail pet-content">
				<view class="pet-item" @click="toPetDetail" v-if="petData">
					<u--image :src="petData.petPicture" width="200rpx" height="200rpx" radius="20rpx" />
					<view class="pet-item-content">
						<view style="margin-top: 20rpx;" :class="{ 'woman': petData.sex == 1}">
							<u--text v-if="petData.sex == 1" :margin="'0 6rpx 6rpx 0'" :text="petData.varietyLabel" bold
								size="16" suffixIcon="woman"></u--text>
							<u--text v-if="petData.sex == 0" :margin="'0 6rpx 6rpx 0'" :text="petData.varietyLabel" bold
								size="16" suffixIcon="man"></u--text>
							<u--text v-if="petData.sex == 2" :margin="'0 6rpx 6rpx 0'" :text="petData.varietyLabel" bold
								size="16"></u--text>
						</view>
						<span
							class="discribe">{{petData.age+"岁|"+petData.petTypeName+"|"+getPetSize(petData.size)}}</span>
						<view class="pet-label flex" v-if="petData.personalityLabels.length>0">
							<view class="tag" v-for="(lab,i) in petData.personalityLabels" :key="i"><u-tag :text="lab"
									plain size="mini" :type="getTagType(i)"> </u-tag></view>
						</view>
						<view class="pet-status flex">
							<view class="tag">
								<u-tag :icon="petData.sterilizationStatus == 1 ? 'checkmark' : 'close'"
									borderColor="#e9f1fb" bgColor="#e9f1fb" color="#5a7eca"
									:text="petData.sterilizationStatus == 1 ? '已绝育' : '未绝育'"
									size="mini"></u-tag></u-tag>
							</view>
							<view class="tag">
								<u-tag :icon="petData.dewormNum > 0  ? 'checkmark' : 'close'" borderColor="#e9f1fb"
									bgColor="#e9f1fb" color="#5a7eca" :text="petData.dewormNum > 0 ? '已驱虫' : '未驱虫'"
									size="mini"></u-tag>
							</view>
							<view class="tag">
								<u-tag :icon="petData.vaccineNum >0 ? 'checkmark' : 'close'" borderColor="#e9f1fb"
									bgColor="#e9f1fb" color="#5a7eca" :text="petData.vaccineNum >0 ? '已疫苗' : '未疫苗'"
									size="mini"></u-tag>
							</view>
						</view>
					</view>

				</view>
				<view class="apply-tag flex" v-if="petData">
					<span>申请状态: </span>
					<u-tag :text="getApplyStatus(petData.reviewStatus)" plain plainFill
						:type="getApplyStatusType(petData.reviewStatus)" size="mini"></u-tag>
				</view>
				<h3>申请流程</h3>
				<u-steps activeColor="#6685ca" :current="reviewList.length" direction="column">
					<u-steps-item :title="step.processName" v-for="(step,index) in reviewList" :key="index">
						<template #desc>
							<p>{{step.createTime}}</p>
						</template>
					</u-steps-item>
				</u-steps>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex';
	import {
		applyReview,
		petApplyDetail
	} from '../../../api/userApi/myAdopt';

	export default {
		data() {
			return {
				applyId: undefined,
				reviewList: [],
				petData: undefined,
				applyStatusType: [{
						value: "审核中",
						key: 0,
						type: "warning"
					},
					{
						value: "已通过",
						key: 1,
						type: "success"
					},
					{
						value: "未通过",
						key: 2,
						type: "error"
					},
					{
						value: "已取消",
						key: 3,
						type: "info"
					}
				]
			};
		},
		onLoad(options) {
			console.log('接收的参数：', options);
			this.applyId = options.applyId || 0
			// 获取数据
			this.getApplyDetail(this.applyId);
			this.getApplyPetDetail(this.applyId)
		},
		computed: {
			...mapGetters(['getPetSize', 'getTagType'])
		},
		methods: {
			getApplyDetail(id) {
				applyReview(id).then(res => {
					console.log(res);
					this.reviewList = res.data
				})

			},
			getApplyPetDetail(id) {
				petApplyDetail(id).then(res => {
					console.log(res);
					this.petData = res.data
				})
			},
			//获取申请状态
			getApplyStatus(val) {
				const type = this.applyStatusType.find(item => item.key == val)
				return type.value
			},
			//获取申请状态
			getApplyStatusType(val) {
				const type = this.applyStatusType.find(item => item.key == val)
				return type.type
			},
		}
	}
</script>

<style lang="scss">
	.adopt-detail {

		.adopt-detail-container {
			background-color: #fff;
			padding: 20rpx;
			border-radius: 20rpx;

			.u-steps-item__content {
				margin: 20rpx;
				padding: 10rpx;
				border-radius: 10rpx;
				background-color: #f4f4f5;
				box-sizing: border-box;
			}

			.apply-tag {
				margin: 20rpx 0;

				span {
					line-height: 46rpx;
					font-size: 26rpx;
					font-weight: 600;
				}

				.u-tag--mini {
					width: 80rpx;
					margin-left: 20rpx;

				}
			}

			h3 {
				font-size: 26rpx;
				margin-bottom: 10rpx;
				padding: 10rpx 0;
				box-sizing: border-box;
				font-weight: 600;
				border-bottom: 2rpx solid #c3c3c3;
			}

			p {
				font-size: 24rpx;
				margin: 10rpx 0;
			}

			.pet-item {

				margin-bottom: 20rpx;
				// border-radius: 20rpx;
				// border-bottom: 2rpx solid #aac3e2;
				display: flex;
				overflow: hidden;

				.pet-item-content {
					margin: 10rpx 20rpx;
					display: flex;
					flex-direction: column;

					.pet-type {
						font-weight: 600;
					}

					.u-icon__icon {
						font-weight: 600 !important;
						color: #5a7eca !important;
					}

					.discribe {
						margin: 10rpx 0;
						font-size: 25rpx;
						color: #7b7b7b;
					}



					.pet-label {
						padding: 10rpx 0;
						box-sizing: border-box;
						border-bottom: 1px solid #c3c3c3;

						.u-tag--mini {
							height: 24rpx !important;
						}

						.u-tag--info--plain {
							border: #67aee4 2rpx solid !important;
						}

						.u-tag__text--info--plain {
							color: #67aee4;
						}

						.u-tag__text--mini {
							font-size: 20rpx !important;
						}

						.tag {
							margin-right: 10rpx;
						}

					}


					.pet-status {
						margin-top: 10rpx;

						.tag {
							margin-right: 16rpx;
						}

						.u-tag--mini {
							height: 25rpx !important;
						}

						.u-icon__icon {
							font-size: 20rpx !important;
						}

						.u-tag__text--mini {
							font-size: 18rpx !important;
							font-weight: 600;
						}

					}
				}
			}
		}
	}
</style>