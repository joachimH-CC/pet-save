<template>
	<view class="apply-list content">
		<view class="apply-list-container">
			<u-subsection bgColor="#e9f1fb" activeColor="#5c7bc5" inactiveColor="#343644" :list="list" :current="curNow"
				@change="sectionChange"></u-subsection>
			<common-scroll-list :items="applyList" :pageSize="4" height="calc(100vh - 160rpx)" keyField="applyId">
				<template #default="{ item, index }">
					<view class="saver-pet-item" v-if="item">
						<view class="pet-item" @click="toApplyDetail(item.applyId)">
							<u--image :src="item.petPicture" width="200rpx" height="200rpx" radius="20rpx" />
							<view class="pet-item-content">
								<view class="adopt-status"
									v-if="item.reviewStatus !== undefined && item.reviewStatus !== null"><u-tag
										:text="item.statusText" plain plainFill :type="item.statusType"
										size="mini"></u-tag>
								</view>
								<view :class="{ 'woman': item.sex == 1 }">
									<u--text v-if="item.sex == 1" :margin="'0 6rpx 6rpx 0'" :text="item.variety" bold
										size="16" suffixIcon="woman"></u--text>
									<u--text v-if="item.sex == 0" :margin="'0 6rpx 6rpx 0'" :text="item.variety" bold
										size="16" suffixIcon="man"></u--text>
									<u--text v-if="item.sex == 2" :margin="'0 6rpx 6rpx 0'" :text="item.variety" bold
										size="16"></u--text>
								</view>
								<u--text :margin="'6rpx 0'"
									:text="item.age + '岁 | ' + item.petTypeName + ' | ' + (item.size === 0 ? '小型' : item.size === 1 ? '中型' : item.size === 2 ? '大型' : '未知')"
									size="11" color="#787878"></u--text>
								<u--text :margin="'10rpx 0 10rpx 0'" bold :text="'申请人: ' + item.nickName" size="13"
									color="#787878"></u--text>
								<u--text :margin="'6rpx 0'" :text="'申请时间: ' + item.applyTime" size="11"
									color="#787878"></u--text>
							</view>
						</view>
						<view class="ai-advice">
							<u--text bold :text="'AI匹配度:' + item.aiMatchData + '%'" size="11" color="#6786c9"></u--text>
						</view>
						<view class="just-space-be">
							<u-button icon="server-fill" text="在线聊天" color="#e6f4ff" size="mini"
								@click="toChat(item)"></u-button>
							<view class="flex fuc">
								<u-button v-if="item.reviewStatus == 0" icon="close-circle-fill" text="拒绝" size="mini"
									type="error" @click="refuseApply(item.applyId)"></u-button>
								<u-button v-if="item.reviewStatus == 0" icon="checkmark-circle-fill" text="通过"
									type="success" plain size="mini" @click="approvedApply(item.applyId)"></u-button>
							</view>
						</view>
					</view>
				</template>
			</common-scroll-list>
			<view v-if="applyList.length == 0">
				<u-empty mode="data" text="还没有申请记录^_^"></u-empty>
			</view>
		</view>
		<u-popup :show="reasonPop.show" mode="center" :safeAreaInsetBottom="false">
			<view class="refuse-pop">
				<u--text :margin="'10rpx 0'" bold :text="mode == 'approve' ? '同意理由:' : '拒绝理由:'" size="15"
					color="#666"></u--text>
				<u--textarea v-model="reasonPop.form.reason" maxlength="-1" placeholder="请输入内容"></u--textarea>
				<view class="btn just-space-be" style="margin-top: 10rpx;">
					<u-button size="small" text="取消" @click="reasonPop.show = false"></u-button>
					<u-button size="small" style="width: 400rpx;" color="#6685ca" type="primary" text="确定"
						@click="handleComfirm"></u-button>
				</view>
			</view>

		</u-popup>
	</view>
</template>

<script>
	import {
		approvedApply,
		refuseApply,
		rescueApplyList
	} from '../../../api/rescuerApi/rescueApply';
	import CommonScrollList from '@/components/CommonScrollList.vue';
	export default {
		components: {
			CommonScrollList
		},
		data() {
			return {
				mode: "approve",
				curNow: 0,
				list: ['全部', '待审核', '已通过', '已拒绝', "已取消"],
				reasonPop: {
					show: false,
					form: {
						reason: undefined,
						applyId: undefined,
					}

				},
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
				],
				applyList: []

			};
		},
		onLoad() {
			this.getRescueApplyList()
		},
		methods: {
			getRescueApplyList() {
				const reviewStatus = this.curNow === 0 ? '' : this.curNow - 1
				rescueApplyList({
					reviewStatus
				}).then(res => {
					console.log(res);
					this.applyList = res.data.map(item => {
						return {
							...item,
							statusText: this.getApplyStatus(item.reviewStatus),
							statusType: this.getApplyStatusType(item.reviewStatus),
							aiMatchData: item.aiMatch || 0,
						}
					});
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
				this.getRescueApplyList()
			},
			toApplyDetail(id) {
				uni.navigateTo({
					url: `/pages/saverApplyList/applyDetail/applyDetail?applyId=${id}`
				})
			},
			toChat(item) {
				const data = {
					chatPartnerId: item.userId,
					avatar: item.avatar,
					nickName: item.nickName,
					page: 0,
				}
				uni.navigateTo({
					url: `/pages/infoList/chat/chat?data=${encodeURIComponent(JSON.stringify(data))}`
				})
			},
			toContract(id) {
				uni.navigateTo({
					url: `/pages/saverApplyList/contract/contract?applyId=${id}`
				})
			},
			refuseApply(id) {
				this.mode = "refuse"
				this.reasonPop.show = true
				this.reasonPop.form.reason = undefined
				this.reasonPop.form.applyId = id
			},
			handleComfirm() {
				switch (this.mode) {
					case 'approve':
						approvedApply(this.reasonPop.form).then(res => {
							console.log(res);
							this.getRescueApplyList()
							uni.showToast({
								icon: "none",
								title: res.msg
							})
							this.reasonPop.show = false
						})
						break;
					case 'refuse':
						refuseApply(this.reasonPop.form).then(res => {
							console.log(res);
							this.getRescueApplyList()
							uni.showToast({
								icon: "none",
								title: res.msg
							})
							this.reasonPop.show = false
						})
						break;
				}



			},
			approvedApply(id) {
				this.mode = "approve"
				this.reasonPop.show = true
				this.reasonPop.form.reason = undefined
				this.reasonPop.form.applyId = id
			},
			toAImatch(id) {
				uni.navigateTo({
					url: `/pages/matchList/matchPetList/matchPetList?petId=${id}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.apply-list {


		.pet-item {
			padding: 20rpx;
			box-sizing: border-box;
			// border-radius: 20rpx;
			border-bottom: 2rpx solid #aac3e2;
			display: flex;
			overflow: hidden;
			position: relative;

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

				.adopt-status {
					position: absolute;
					right: 0rpx;
					top: 20rpx;

					.u-tag--mini {
						// width: 80rpx;
						height: 28rpx !important;
					}

					.u-tag__text--mini {
						font-size: 24rpx !important;
					}
				}

			}


		}

		.apply-list-container {



			.saver-pet-item {
				margin-bottom: 20rpx;
				background-color: #fff;
				padding: 20rpx;
				box-sizing: border-box;
				border-bottom: 2rpx solid #aac3e2;


				.ai-advice {
					border-radius: 10rpx;
					box-sizing: border-box;
					margin: 0 0 20rpx 0;
					padding: 10rpx;
					background-color: #f2f5f8;
				}

				.u-button--warning {
					background-color: #fcf8f2;
					color: #efa73a !important;
					border-color: #fcf8f2;
					width: 200rpx;
					margin: 2rpx;

					.u-icon__icon {
						color: #f9ae3d !important;
					}
				}

				.u-button--mini {
					color: #6786c9 !important;
					margin-left: 10rpx;
					width: 200rpx;
					margin: 2rpx;

					.u-icon__icon {
						color: #6786c9 !important;
					}
				}

				.fuc {
					.u-button--mini {
						color: #6786c9 !important;
						margin-left: 10rpx;
						width: 160rpx;

						.u-icon__icon {
							color: #6786c9 !important;
						}
					}

					.u-button--success {
						background-color: #eef8ec;
						color: #5ac725 !important;
						border-color: #eef8ec;


						.u-icon__icon {
							color: #5ac725 !important;
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


				}

				.pet-item {

					border-bottom: none;
				}
			}
		}

		.refuse-pop {
			width: 600rpx;
			padding: 30rpx;

			.btn {
				margin: 20rpx 0s;

				.u-button--info {
					margin-right: 20rpx;

				}

				.u-button--mini {

					width: 300rpx !important;
				}
			}
		}


	}
</style>