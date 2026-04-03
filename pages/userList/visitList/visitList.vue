<template>
	<view class="visit content">
		<view class="visit-container">
			<u-subsection bgColor="#e9f1fb" activeColor="#5c7bc5" inactiveColor="#343644" :list="list" :current="curNow"
				@change="sectionChange"></u-subsection>
			<common-scroll-list :items="returnList" :pageSize="4" height="calc(100vh - 160rpx)" keyField="applyId">
				<template v-slot="{ item, index }">
					<view class="saver-pet-item" v-if="item">
						<view class="pet-item">
							<u--image :src="item.petPicture" width="200rpx" height="200rpx" radius="20rpx" />
							<view class="pet-item-content">
								<view class="adopt-status"><u-tag :text="'已完成' + item.returnNum + '次回访'" plain
										:type="item.returnNum > 0 ? 'success' : 'warning'" size="mini"></u-tag>
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

								<u--text :margin="'10rpx 0 10rpx 0'" bold :text="'领养人: ' + item.nickName" size="13"
									color="#787878"></u--text>
								<u--text :margin="'6rpx 0'" :text="'领养时间: ' + item.applyTime" size="11"
									color="#787878"></u--text>
							</view>
						</view>
						<view class="flex-end fuc">
							<u-button icon="file-text-fill" text="回访记录" color="#e6f4ff" size="mini"
								@click="toVisitDetail(item.applyId)"></u-button>
						</view>
					</view>
				</template>
			</common-scroll-list>
			<view v-if="returnList.length == 0">
				<u-empty mode="data" text="还没有回访记录^_^"></u-empty>
			</view>
		</view>
	</view>
</template>

<script>
import {
	mapGetters
} from 'vuex';
import CommonScrollList from '@/components/CommonScrollList.vue';
import {
	returnPetList
} from '../../../api/rescuerApi/returnRecord';

export default {
	components: {
		CommonScrollList
	},
	data() {
		return {
			curNow: 0,
			list: ['全部', '待回访', '已完成'],
			returnList: []
		};
	},
	onLoad() {
		this.getReturnList()
	},
	onShow() {
		this.getReturnList()
	},
	computed: {
		...mapGetters(['getPetSize'])
	},
	methods: {
		getReturnList() {
			let isReturnVisit = ''
			if (this.curNow != 0) {
				isReturnVisit = this.curNow - 1
			}
			console.log(isReturnVisit);
			returnPetList({
				isReturnVisit
			}).then(res => {
				console.log(res);
				this.returnList = res.data
			})
		},
		sectionChange(val) {
			this.curNow = val
			this.returnList = []
			this.getReturnList()
		},
		getReturnNumType(val) {
			switch (val) {
				case 3:
					return "success"
					break;
				default:
					return "warning"
					break;
			}
		},
		toVisitDetail(id) {
			uni.navigateTo({
				url: `/pages/userList/visitDetail/visitDetail?applyId=${id}`
			})
		}
	}
}
</script>

<style lang="scss">
.visit {


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

			.woman {
				.u-icon__icon {
					color: #d08b92 !important;
				}
			}

			.adopt-status {
				position: absolute;
				right: 0rpx;
				top: 20rpx;

				.u-tag--mini {
					width: 160rpx;
					height: 28rpx !important;
				}

				.u-tag__text--mini {
					font-size: 24rpx !important;
				}
			}

		}


	}

	.visit-container {




		.saver-pet-item {
			margin-bottom: 20rpx;
			background-color: #fff;
			padding: 20rpx;
			box-sizing: border-box;
			border-bottom: 2rpx solid #aac3e2;



			.fuc {
				.u-button--mini {
					color: #6786c9 !important;
					margin: 2rpx 10rpx;
					width: 200rpx;

					.u-icon__icon {
						color: #6786c9 !important;
					}
				}

				.u-button--success {
					background-color: #f1fcf2;
					color: #7fc97e !important;
					border-color: #f1fcf2;
					width: 200rpx;
					margin: 2rpx;

					.u-icon__icon {
						color: #7fc97e !important;
					}
				}



			}

			.pet-item {

				border-bottom: none;
			}
		}
	}

}
</style>