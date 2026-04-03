<template>
	<view class="match-list content">
		<u-loadmore v-if="loading" status="loading" loading-text="正在匹配..." />
		<common-scroll-list v-if="matchlist.length>0" :items="matchlist" :pageSize="4" height="calc(100vh - 140rpx)"
			keyField="petId">
			<template v-slot="{ item, index }">
				<view class="match-item">
					<view class="pet-item" v-if="item" @click="toPetDetail(item.petId)">
						<u--image :src="item.petPicture" width="200rpx" height="200rpx" radius="20rpx" />
						<view class="pet-item-content">
							<view :class="{ 'woman': item.sex == 1}">
								<u--text v-if="item.sex == 1" :margin="'0 6rpx 6rpx 0'" :text="item.varietyLabel" bold
									size="16" suffixIcon="woman"></u--text>
								<u--text v-if="item.sex == 0" :margin="'0 6rpx 6rpx 0'" :text="item.varietyLabel" bold
									size="16" suffixIcon="man"></u--text>
								<u--text v-if="item.sex == 2" :margin="'0 6rpx 6rpx 0'" :text="item.varietyLabel" bold
									size="16"></u--text>
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

					<view class="match-reason just-space-be">
						<view>
							<span class="reason-title">匹配原因:</span>
							<p>{{item.reason}}</p>
						</view>
						<u-tag bgColor="#5a7eca" size="mini" shape="circle" :text="'匹配度: '+item.matchScore+'%'"></u-tag>
					</view>
				</view>
			</template>
		</common-scroll-list>
	</view>
</template>

<script>
	import {
		aiPetList
	} from '../../../api/userApi/aiMatch';
	import CommonScrollList from '@/components/CommonScrollList.vue';
	export default {
		components: {
			CommonScrollList
		},
		data() {
			return {
				matchlist: [],
				loading: false,
				petId: ''
			};
		},
		onLoad(options) {
			if (options.petId) {
				this.petId = options.petId
			} else {
				this.getPetList()
			}

		},
		methods: {
			getPetList() {
				this.loading = true
				aiPetList().then(res => {
					this.matchlist = res.data.map(item => {
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
					this.loading = false
					console.log(res);
				})
			},
			toPetDetail(id) {
				uni.navigateTo({
					url: `/pages/petDetailList/petDetail/petDetail?petId=${id}`
				})
			},
		}
	}
</script>

<style lang="scss">
	.match-list {


		.match-item {
			margin-bottom: 30rpx;

			overflow: hidden;

			border-bottom: 2rpx solid #5a7eca;

			.match-reason {
				box-sizing: border-box;
				padding: 20rpx 30rpx;
				margin: 20rpx 0;
				background-color: #f8f9fa;
				border-radius: 20rpx;
				font-size: 24rpx;
				border-left: #95b4e2 solid 6rpx;

				.u-tag__text {
					font-size: 20rpx !important;
				}

				.reason-title {
					font-weight: 600;
				}
			}

			.pet-item {
				background-color: #fff;
				box-sizing: border-box;
				margin-bottom: 20rpx;
				height: 202rpx;
				display: flex;

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
				}

				image {
					border-radius: 0 0 20rpx 0;
					width: 200rpx;
					height: 200rpx;

				}
			}

			.match-reason {}
		}

	}
</style>