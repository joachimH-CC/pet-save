<template>
	<view class="collect content">
		<u--text prefixIcon="info-circle-fill" text="设置领养提醒可以及时接受到宠物的健康情况变化和目前的领养情况哦~" size="11"
			color="#bdbdca"></u--text>

		<common-scroll-list :items="collectList" :pageSize="4" height="calc(100vh - 240rpx)" keyField="petId">
			<template v-slot="{ item, index }">
				<view class="pet-item-container">
					<view class="pet-item" @click="toPetDetail(item.petId)">
						<u--image :src="item.petPicture" width="200rpx" height="200rpx" radius="20rpx" />
						<view class="pet-item-content">
							<view :class="{ 'woman': item.sex == 1 }">
								<u--text v-if="item.sex == 1" :margin="'0 6rpx 6rpx 0'" :text="item.varietyLabel" bold
									size="16" suffixIcon="woman"></u--text>
								<u--text v-if="item.sex == 0" :margin="'0 6rpx 6rpx 0'" :text="item.varietyLabel" bold
									size="16" suffixIcon="man"></u--text>
								<u--text v-if="item.sex == 2" :margin="'0 6rpx 6rpx 0'" :text="item.varietyLabel" bold
									size="16"></u--text>
							</view>
							<span class="discribe">{{ item.age + "岁|" + item.petTypeName + "|" + item.sizeName }}</span>
							<view class="pet-label flex" v-if="item.labels">
								<view class="tag" v-for="(lab, i) in item.labels" :key="i">
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
									<u-tag :icon="item.dewormNum > 0 ? 'checkmark' : 'close'" borderColor="#e9f1fb"
										bgColor="#e9f1fb" color="#5a7eca" :text="item.dewormNum > 0 ? '已驱虫' : '未驱虫'"
										size="mini"></u-tag>
								</view>
								<view class="tag">
									<u-tag :icon="item.vaccineNum > 0 ? 'checkmark' : 'close'" borderColor="#e9f1fb"
										bgColor="#e9f1fb" color="#5a7eca" :text="item.vaccineNum > 0 ? '已疫苗' : '未疫苗'"
										size="mini"></u-tag>
								</view>
							</view>
						</view>
					</view>
					<view class="apply-btn">
						<u-button size="mini" :text="item.adoptReminder == 1 ? '取消领养提醒' : '设置领养提醒'" color="#e9f1fb"
							@click="handleAdoptNotice(item.petId)"></u-button>
						<u-button size="mini" text="取消收藏" plain
							@click.stop="handleCancelCollect(item.petId)"></u-button>
					</view>
				</view>
			</template>
		</common-scroll-list>
		<view v-if="collectList.length == 0">
			<u-empty mode="list" text="还没有收藏宠物哦 ^_^"></u-empty>
		</view>

	</view>
</template>

<script>
import CommonScrollList from '@/components/CommonScrollList.vue';
import {
	adoptNotice,
	userCollect
} from '../../../api/userApi/myCollect';
import {
	petCollect
} from '../../../api/userApi/petDetail';
import {
	mapGetters
} from 'vuex'
export default {
	components: {
		CommonScrollList
	},
	data() {
		return {
			noticeText: "设置领养提醒",
			collectList: []
		};
	},
	onLoad() {
		this.getMyCollect()
	},
	computed: {
		...mapGetters(['getPetSize', 'getTagType'])
	},
	methods: {
		//获取收藏列表
		getMyCollect() {
			userCollect().then(res => {
				console.log(res);
				this.collectList = res.data.map(item => {
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
					}
				})

			})
		},
		toPetDetail(id) {
			uni.navigateTo({
				url: `/pages/petDetailList/petDetail/petDetail?petId=${id}`
			})
		},
		handleAdoptNotice(id) {
			adoptNotice({
				petId: id
			}).then(res => {
				uni.showToast({
					icon: "none",
					title: res.data,
				})
				this.getMyCollect()

			})
		},
		// 新增取消收藏方法
		handleCancelCollect(id) {
			uni.showModal({
				title: '取消收藏',
				content: '确定要取消收藏该宠物吗？',
				confirmColor: '#6c95e0',
				success: (res) => {
					if (res.confirm) {
						petCollect(id).then(res => {
							uni.showToast({
								icon: 'success',
								title: '取消收藏成功',
							})
							// 重新获取收藏列表
							this.getMyCollect()
						}).catch(err => {
							uni.showToast({
								icon: 'none',
								title: '操作失败，请重试',
							})
						})
					}
				}
			})
		}
	}
}
</script>

<style lang="scss">
.collect {

	.u-icon__icon {
		margin: 0 10rpx 20rpx 0;
		color: #6f8fca !important;
	}

	.apply-btn {
		display: flex;
		justify-content: space-between;

		.u-button--plain {
			width: 240rpx;
			margin-left: 20rpx;
			border: 2rpx solid #6f8fca;
		}

		.u-text {

			margin: 20rpx 0 !important;

			.u-text__value {
				width: 630rpx;

			}


		}

	}




	.pet-item-container {
		margin: 30rpx 0;
		background-color: #fff;
		box-sizing: border-box;
		padding: 20rpx;
		border-radius: 20rpx;
		box-shadow: 2rpx 2rpx 10rpx 4rpx rgba(128, 151, 202, 0.2);

		.u-button__text {
			color: #5a7eca;
			font-weight: 600;
		}

		.pet-item {

			margin-bottom: 20rpx;

			display: flex;
			overflow: hidden;

			.pet-item-content {
				margin: 10rpx 20rpx;
				display: flex;
				flex-direction: column;

				.pet-type {
					font-weight: 600;
				}

				.discribe {
					margin: 10rpx 0;
					font-size: 25rpx;
					color: #7b7b7b;
				}

				.u-icon__icon {
					margin: 0;
					font-weight: 600 !important;
					color: #5a7eca !important;
				}



				.pet-label {
					padding: 10rpx 0;
					box-sizing: border-box;
					border-bottom: 1px solid #c3c3c3;


					.u-tag--mini {
						height: 24rpx !important;
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
						font-weight: 600;
						font-size: 18rpx !important;
					}

				}


			}

			.u-button {
				margin: 0 10rpx;
				width: 200rpx;
			}

			image {
				border-radius: 20rpx 0 0 20rpx;
				width: 200rpx;
				height: 200rpx;

			}
		}


	}
}
</style>