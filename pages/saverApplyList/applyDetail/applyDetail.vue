<template>
	<view class="apply-detail">
		<view class="pet-detail pet-content">
			<h3>申请宠物</h3>
			<view class="pet-item" v-if="applyData">
				<u--image :src="applyData.petPicture" width="200rpx" height="200rpx" radius="20rpx" />
				<view class="pet-item-content">
					<view v-if="role==101" class="adopt-status"><u-tag :text="getAdoptStatus(applyData.reviewStatus)"
							plain :type="getAdoptStatusType(applyData.reviewStatus)" size="mini"></u-tag>
					</view>
					<view :class="{ 'woman': applyData.sex == 1}">
						<u--text v-if="applyData.sex == 1" :margin="'0 6rpx 6rpx 0'" :text="applyData.variety" bold
							size="16" suffixIcon="woman"></u--text>
						<u--text v-if="applyData.sex == 0 " :margin="'0 6rpx 6rpx 0'" :text="applyData.variety" bold
							size="16" suffixIcon="man"></u--text>
						<u--text v-if="applyData.sex == 2 " :margin="'0 6rpx 6rpx 0'" :text="applyData.variety" bold
							size="16"></u--text>
					</view>
					<span class="discribe">{{applyData.age+"岁 | "+applyData.petTypeName+" | "+applyData.shape}}</span>
					<view class="pet-label flex" v-if="applyData  && applyData.petLabelList.length>0 ">
						<view class="tag" v-for="(lab,i) in applyData.petLabelList" :key="i"><u-tag
								:text="lab.labelName" plain size="mini" :type="getTagType(i)"> </u-tag>
						</view>
					</view>
					<view class="pet-status flex">
						<view class="tag">
							<u-tag :icon="applyData.sterilizationStatus == 1 ? 'checkmark' : 'close'"
								borderColor="#e9f1fb" bgColor="#e9f1fb" color="#5a7eca"
								:text="applyData.sterilizationStatus == 1 ? '已绝育' : '未绝育'" size="mini"></u-tag></u-tag>
						</view>
						<view class="tag">
							<u-tag :icon="applyData.dewormNum > 0  ? 'checkmark' : 'close'" borderColor="#e9f1fb"
								bgColor="#e9f1fb" color="#5a7eca" :text="applyData.dewormNum > 0 ? '已驱虫' : '未驱虫'"
								size="mini"></u-tag>
						</view>
						<view class="tag">
							<u-tag :icon="applyData.vaccineNum >0 ? 'checkmark' : 'close'" borderColor="#e9f1fb"
								bgColor="#e9f1fb" color="#5a7eca" :text="applyData.vaccineNum >0 ? '已疫苗' : '未疫苗'"
								size="mini"></u-tag>
						</view>
					</view>
				</view>
			</view>
			<view class="ai-advice">
				<u--text bold :margin="'10rpx 0'" :text="'AI匹配度:'+applyData.aiMatch+'%' " size="11"
					color="#6786c9"></u--text>
				<u--text bold :margin="'10rpx 0'" :text="'AI建议:'+applyData.aiSuggestion " size="11"
					color="#6786c9"></u--text>
			</view>
			<u-grid :border="false" col="2">
				<u-grid-item>
					<u--text :margin="'10rpx 0 6rpx 0'" bold text="体重状况" size="12" color="#a4a4a4"></u--text>
					<u--text :text="applyData.weight+'kg左右'" size="12"></u--text>
				</u-grid-item>
				<u-grid-item>
					<u--text :margin="'10rpx 0 6rpx 0'" bold text="疫苗次数" size="12" color="#a4a4a4"></u--text>
					<u--text :text="applyData.vaccineNum+'次'" size="12"></u--text>
				</u-grid-item>
				<u-grid-item>
					<u--text :margin="'10rpx 0 6rpx 0'" bold text="皮毛状况" size="12" color="#a4a4a4"></u--text>
					<u--text :text="applyData.coatColor" size="12"></u--text>
				</u-grid-item>
				<u-grid-item>
					<u--text :margin="'10rpx 0 6rpx 0'" bold text="驱虫次数" size="12" color="#a4a4a4"></u--text>
					<u--text :text="applyData.dewormNum+'次'" size="12"></u--text>
				</u-grid-item>
			</u-grid>

			<view>
				<u--text :margin="'10rpx 0 6rpx 0'" bold text="所在地址" size="12" color="#a4a4a4"></u--text>
				<u--text :text="applyData.address" size="12"></u--text>
			</view>
		</view>

		<view class="pet-content" v-if="applyData">
			<h3>申请人</h3>
			<view class="user-info flex">
				<u-avatar :src="applyData.avatar" size="100rpx"></u-avatar>
				<view style="margin: 0 20rpx;">
					<u--text :margin="'16rpx 0 10rpx 0'" bold :text="applyData.nickName" size="13"
						color="#5a7eca"></u--text>
					<u--text :text="applyData.introduction" size="11" color="#5a7eca"></u--text>
				</view>
			</view>

			<u-grid :border="false" col="2">
				<!-- <u-grid-item>
					<u--text :margin="'10rpx 0 6rpx 0'" bold text="姓名" size="12" color="#a4a4a4"></u--text>
					<u--text :text="applyData.nickName" size="12"></u--text>
				</u-grid-item> -->
				<u-grid-item>
					<u--text :margin="'10rpx 0 6rpx 0'" bold text="性别" size="12" color="#a4a4a4"></u--text>
					<u--text :text="applyData.userSex==0?'男':'女'" size="12"></u--text>
				</u-grid-item>
				<u-grid-item>
					<u--text :margin="'10rpx 0 6rpx 0'" bold text="联系电话" size="12" color="#a4a4a4"></u--text>
					<u--text :text="applyData.phoneNumber" size="12"></u--text>
				</u-grid-item>
				<u-grid-item>
					<u--text :margin="'10rpx 0 6rpx 0'" bold text="居住地址" size="12" color="#a4a4a4"></u--text>
					<u--text :text="applyData.userAddress" size="12"></u--text>
				</u-grid-item>
				<u-grid-item>
					<u--text :margin="'10rpx 0 6rpx 0'" bold text="婚姻状况" size="12" color="#a4a4a4"></u--text>
					<u--text :text="marryType.find(item=>item.key==applyData.marriageStatus).value || '未知'"
						size="12"></u--text>
				</u-grid-item>
				<u-grid-item>
					<u--text :margin="'10rpx 0 6rpx 0'" bold text="工作状态" size="12" color="#a4a4a4"></u--text>
					<u--text :text="petWorkStatus.find(item=>item.key==applyData.workStatus).value || '未知'"
						size="12"></u--text>
				</u-grid-item>
				<u-grid-item>
					<u--text :margin="'10rpx 0 6rpx 0'" bold text="住房类型" size="12" color="#a4a4a4"></u--text>
					<u--text :text="petHouseType.find(item=>item.key==applyData.houseType).value || '未知'"
						size="12"></u--text>
				</u-grid-item>
				<u-grid-item>
					<u--text :margin="'10rpx 0 6rpx 0'" bold text="已有宠物数量" size="12" color="#a4a4a4"></u--text>
					<u--text :text="applyData.petNum" size="12"></u--text>
				</u-grid-item>
				<u-grid-item>
					<u--text :margin="'10rpx 0 6rpx 0'" bold text="养宠经验" size="12" color="#a4a4a4"></u--text>
					<u--text :text="applyData.hasExp==0?'否':'是'" size="12"></u--text>
				</u-grid-item>

			</u-grid>
			<view>
				<u--text :margin="'10rpx 0 6rpx 0'" bold text="申请理由" size="12" color="#a4a4a4"></u--text>
				<u--text :text="applyData.reason" size="12"></u--text>
			</view>
			<view class="ai-advice" v-if="applyData.reviewStatus==1">
				<u--text bold :margin="'10rpx 0'" :text="'合同签署状态:'+(applyData.isSign==1?'已签署':'未签署') " size="11"
					color="#6786c9"></u--text>
			</view>
		</view>
		<view class="pet-content">
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
</template>

<script>
	import {
		applyReview,
	} from '../../../api/userApi/myAdopt';
	import {
		mapGetters
	} from 'vuex';
	import {
		rescueApplyDetail
	} from '../../../api/rescuerApi/rescueApply';

	export default {
		data() {
			return {
				role: 1,
				collectIcon: "heart",
				applyData: undefined,
				applyId: undefined,
				reviewList: [],
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
				],
				//婚姻状态
				marryType: [{
					value: "单身",
					key: 0,
				}, {
					value: "恋爱",
					key: 1,
				}, {
					value: "已婚",
					key: 2,
				}],
				//住房类型
				petHouseType: [{
					value: "整租",
					key: 0,
				}, {
					value: "合租",
					key: 1,
				}, {
					value: "自有住房",
					key: 2,
				}, {
					value: "其他",
					key: 3,
				}, ],
				//工作状态
				petWorkStatus: [{
						value: "在职",
						key: 0,
					},
					{
						value: "自由职业",
						key: 1,
					},
					{
						value: "学生",
						key: 2,
					},
					{
						value: "无业",
						key: 3,
					},
					{
						value: "退休",
						key: 4,
					},
				],
			};
		},
		onLoad(options) {
			console.log('接收的参数：', options);
			this.applyId = options.applyId || 0
			// 获取数据
			this.getApplyDetail(options.applyId);
			this.getApplyReview(options.applyId)
		},
		computed: {
			...mapGetters(['getPetSize', 'getTagType'])
		},
		methods: {
			getApplyDetail(id) {
				rescueApplyDetail(id).then(res => {
					console.log(res);
					this.applyData = res.data
				})
			},
			getApplyReview(id) {
				applyReview(id).then(res => {
					console.log(res);
					this.reviewList = res.data
				})

			},
			collectPet() {
				this.collectIcon = this.collectIcon == "heart-fill" ? "heart" : "heart-fill"
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
			toAdoptPet() {
				uni.navigateTo({
					url: "/pages/petDetailList/petAdopt/petAdopt"
				})
			}
		}
	}
</script>

<style lang="scss">
	.apply-detail {
		padding: 0rpx 20rpx 20rpx;

		.pet-content {
			margin-bottom: 20rpx;
			background-color: #fff;
			padding: 20rpx 30rpx;
			box-sizing: border-box;
			border-bottom: 2rpx solid #6685ca;

			.ai-advice {
				border-radius: 10rpx;
				box-sizing: border-box;
				margin: 20rpx 0;
				padding: 10rpx;
				background-color: #f2f5f8;
			}
		}

		.pet-detail {
			background-color: #fff;
			padding: 20rpx 30rpx;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;



			.pet-item {

				box-sizing: border-box;
				// border-radius: 20rpx;
				display: flex;
				overflow: hidden;


				.pet-item-content {
					position: relative;
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

					.adopt-status {
						position: absolute;
						right: 0rpx;
						top: 0rpx;

						.u-tag--mini {
							width: 80rpx;
							height: 28rpx !important;
						}

						.u-tag__text--mini {
							font-size: 24rpx !important;
						}
					}


					.pet-label {
						padding: 10rpx 0;
						box-sizing: border-box;
						border-bottom: 1px solid #c3c3c3;

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

					.woman {
						.u-icon__icon {
							color: #d08b92 !important;
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

					.serve {
						font-weight: 600;
						font-size: 24rpx;
						margin: 10rpx 0;
					}


				}


			}

			.serve {
				font-weight: 600;
				font-size: 24rpx;
				margin: 10rpx 0;
			}

			.address {
				margin: 10rpx 0 0 0rpx;
				font-size: 22rpx;
				color: #7b7b7b;
				font-weight: 600;
				padding-bottom: 14rpx;
				box-sizing: border-box;

				span {
					margin-top: 6rpx;
				}

				.u-icon {
					margin-right: 10rpx;
				}

				.u-icon__icon {
					color: #6685ca !important;
				}
			}

			.adopt-btn {
				margin: 20rpx 0;

				.u-button {
					margin-right: 20rpx;
					border-radius: 10rpx;
				}

				.u-icon__icon {
					color: #6685ca !important;
				}

				.u-button--small:last-child {
					width: 240rpx !important;
				}
			}
		}

		.user-info {
			border-radius: 20rpx;
			box-sizing: border-box;
			margin: 10rpx 0;
			padding: 10rpx;
			background-color: #f2f5f8;
		}

		h3 {
			margin-bottom: 10rpx;
			padding: 10rpx 0;
			box-sizing: border-box;
			font-weight: 600;

		}

		p {
			font-size: 24rpx;
			margin: 10rpx 0;
		}

		.user-info {
			margin: 10rpx 0;
		}


	}
</style>