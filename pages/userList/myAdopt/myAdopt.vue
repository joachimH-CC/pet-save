<template>
	<view class="my-adopt content">
		<u-subsection activeColor="#5c7bc5" :list="list" :current="curNow" @change="sectionChange"></u-subsection>
		<view class="adopt-container">
			<common-scroll-list :items="applyList" :pageSize="4" height="calc(100vh - 140rpx)" keyField="applyId">
				<template v-slot="{ item, index }">
					<view class="adopt-item">
						<view class="pet-item" v-if="item">
							<u--image :src="item.petPicture" width="200rpx" height="200rpx" radius="20rpx" />
							<view class="pet-item-content">
								<view :class="{ 'woman': item.sex == 1}">
									<u--text v-if="item.sex == 1" :margin="'0 6rpx 6rpx 0'" :text="item.varietyLabel"
										bold size="16" suffixIcon="woman"></u--text>
									<u--text v-if="item.sex == 0" :margin="'0 6rpx 6rpx 0'" :text="item.varietyLabel"
										bold size="16" suffixIcon="man"></u--text>
									<u--text v-if="item.sex == 2" :margin="'0 6rpx 6rpx 0'" :text="item.varietyLabel"
										bold size="16"></u--text>
								</view>
								<span class="discribe">{{item.age+"岁|"+item.petTypeName+"|"+item.sizeName}}</span>
								<view class="pet-label flex" v-if="item.labels">
									<view class="tag" v-for="(lab,i) in item.labels" :key="i">
										<u-tag :text="lab.lab" plain size="mini" :type="lab.tagType"> </u-tag>
									</view>
								</view>
								<view class="pet-status flex">
									<view class="tag">
										<u-tag :icon="item.sterilizationStatus == 1 ? 'checkmark' : 'close'"
											borderColor="#e9f1fb" bgColor="#e9f1fb" color="#5a7eca"
											:text="item.sterilizationStatus == 1 ? '已绝育' : '未绝育'"
											size="mini"></u-tag></u-tag>
									</view>
									<view class="tag">
										<u-tag :icon="item.dewormNum > 0  ? 'checkmark' : 'close'" borderColor="#e9f1fb"
											bgColor="#e9f1fb" color="#5a7eca" :text="item.dewormNum > 0 ? '已驱虫' : '未驱虫'"
											size="mini"></u-tag>
									</view>
									<view class="tag">
										<u-tag :icon="item.vaccineNum >0 ? 'checkmark' : 'close'" borderColor="#e9f1fb"
											bgColor="#e9f1fb" color="#5a7eca" :text="item.vaccineNum >0 ? '已疫苗' : '未疫苗'"
											size="mini"></u-tag>
									</view>
								</view>
							</view>
						</view>
						<view class="just-space-be">
							<u-tag :text="item.status" plain plainFill :type="item.statusType" size="mini"></u-tag>
							<view class="flex fuc">
								<u-button icon="info-circle-fill" text="查看详情" color="#e6f4ff" size="mini"
									@click="toAdoptDetail(item.applyId,item.petId)"></u-button>
								<u-button v-if="item.reviewStatus==1 && item.contractStatus!=1" icon="edit-pen-fill"
									text="签署协议" type="warning" size="mini"
									@click="comfirmContract(item.applyId)"></u-button>
								<u-button v-if="item.reviewStatus==0" icon="trash-fill" text="取消申请" size="mini"
									type="error" @click="cancelApply(item.applyId)"></u-button>
							</view>
						</view>
					</view>
				</template>
			</common-scroll-list>
		</view>
		<view v-if="applyList.length==0">
			<u-empty mode="list" text="还没有领养宠物哦 ^_^"></u-empty>
		</view>
	</view>
</template>

<script>
	import CommonScrollList from '@/components/CommonScrollList.vue';
	import {
		cancelApply,
		userApplyPet
	} from '@/api/userApi/myAdopt';
	import {
		mapGetters
	} from 'vuex'
	export default {
		components: {
			CommonScrollList
		},
		data() {
			return {
				curNow: 0,
				list: ['全部', '审核中', '已通过', '已拒绝', '已取消'],
				applyList: [],
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
						value: "已拒绝",
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
		onLoad() {
			this.getMyApply()
		},
		computed: {
			...mapGetters(['getPetSize', 'getTagType'])
		},
		methods: {
			getMyApply() {
				let reviewStatus = 4
				reviewStatus = this.curNow == 0 ? 4 : this.curNow - 1
				userApplyPet({
					reviewStatus
				}).then(res => {
					this.applyList = res.data.map(item => {
						let labels = []
						if (item.personalityLabels.length > 0) {
							labels = item.personalityLabels.map((i, index) => {
								return {
									lab: i,
									tagType: this.$store.getters.getTagType(index)
								}
							})
						}
						return {
							...item,
							labels,
							sizeName: this.$store.getters.getPetSize(item.size),
							status: this.getApplyStatus(item.reviewStatus),
							statusType: this.getApplyStatusType(item.reviewStatus)
						}
					})
					console.log(this.applyList);
				})
			},
			//获取申请状态
			getApplyStatus(val) {
				if (val == 'AI审核') return 'AI审核拒绝';
				if (val == '人工审核') return '人工审核拒绝';
				const type = this.applyStatusType.find(item => item.key == val)
				return type.value
			},
			//获取申请状态
			getApplyStatusType(val) {
				if (val == 'AI审核' || val == '人工审核') return "error";
				const type = this.applyStatusType.find(item => item.key == val)
				return type.type
			},
			sectionChange(val) {
				this.curNow = val
				this.getMyApply()
			},
			toAdoptDetail(id, pet) {
				uni.navigateTo({
					url: `/pages/userList/adoptDetail/adoptDetail?applyId=${id}&petId=${pet}`
				})
			},
			comfirmContract(id) {
				uni.navigateTo({
					url: `/pages/saverApplyList/contract/contract?applyId=${id}`
				})
			},
			//取消申请
			cancelApply(id) {
				uni.showModal({
					title: '提示',
					content: "是否确定取消申请",
					showCancel: true,
					success: ({
						confirm
					}) => {
						if (confirm) {
							cancelApply(id).then(res => {
								console.log(res);
								uni.showToast({
									title: '取消成功',
									icon: 'none'
								});
								this.getMyApply()
							})

						}
					},
				})

			}
		}
	}
</script>

<style lang="scss">
	.my-adopt {
		height: calc(100vh - 70rpx);
		background-color: #f4f4f5;

		.u-subsection__item--first {
			border-radius: 20rpx !important;

		}

		.adopt-container {
			margin-top: 20rpx;

			.adopt-item {
				margin-bottom: 20rpx;
				background-color: #fff;
				padding: 20rpx;
				border-radius: 20rpx;
				box-sizing: border-box;

				.u-tag--mini {
					height: 40rpx !important;
				}

				.u-tag__text--mini {
					font-size: 20rpx !important;
				}


				.fuc {
					.u-button--mini {
						color: #6786c9 !important;
						margin-left: 10rpx;

						.u-icon__icon {
							color: #6786c9 !important;
						}
					}

					.u-button--error {
						background-color: #fcf0f0;
						color: #d94048 !important;
						border-color: #fcf0f0;

						.u-icon__icon {
							color: #d94048 !important;
						}
					}

					.u-button--warning {
						background-color: #fcf8f2;
						color: #f9ae3d !important;
						border-color: #fcf8f2;

						.u-icon__icon {
							color: #f9ae3d !important;
						}
					}

				}

				.pet-item {
					padding-bottom: 10rpx;
					margin-bottom: 20rpx;
					// border-radius: 20rpx;
					border-bottom: 2rpx solid #aac3e2;
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
	}
</style>