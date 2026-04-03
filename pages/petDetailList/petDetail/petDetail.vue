<template>
	<view class="pet-detail">
		<view class="pet-detail pet-content" v-if="petData">
			<u-swiper height="380rpx" radius="20rpx" :list="carouselList" keyName="image" indicator indicatorMode="line"
				circular>
			</u-swiper>
			<view style="margin-top: 20rpx;" :class="{ 'woman': petData.sex == 1 }">
				<u--text v-if="petData.sex == 1" :margin="'0 6rpx 6rpx 0'" :text="petData.varietyLabel" bold size="16"
					suffixIcon="woman"></u--text>
				<u--text v-if="petData.sex == 0" :margin="'0 6rpx 6rpx 0'" :text="petData.varietyLabel" bold size="16"
					suffixIcon="man"></u--text>
				<u--text v-if="petData.sex == 2" :margin="'0 6rpx 6rpx 0'" :text="petData.varietyLabel" bold
					size="16"></u--text>
			</view>
			<span class="discribe">{{ petData.age + "岁|" + petData.petTypeName + "|" + getPetSize(petData.size)
				}}</span>
			<view class="pet-label flex" v-if="petData.personalityLabels.length > 0">
				<view class="tag" v-for="(lab, i) in petData.personalityLabels" :key="i"><u-tag :text="lab" plain
						size="mini" :type="getTagType(i)"> </u-tag></view>
			</view>
			<view class="pet-status flex">
				<view class="tag">
					<u-tag :icon="petData.sterilizationStatus == 1 ? 'checkmark' : 'close'" borderColor="#e9f1fb"
						bgColor="#e9f1fb" color="#5a7eca" :text="petData.sterilizationStatus == 1 ? '已绝育' : '未绝育'"
						size="mini"></u-tag></u-tag>
				</view>
				<view class="tag">
					<u-tag :icon="petData.dewormNum > 0 ? 'checkmark' : 'close'" borderColor="#e9f1fb" bgColor="#e9f1fb"
						color="#5a7eca" :text="petData.dewormNum > 0 ? '已驱虫' : '未驱虫'" size="mini"></u-tag>
				</view>
				<view class="tag">
					<u-tag :icon="petData.vaccineNum > 0 ? 'checkmark' : 'close'" borderColor="#e9f1fb"
						bgColor="#e9f1fb" color="#5a7eca" :text="petData.vaccineNum > 0 ? '已疫苗' : '未疫苗'"
						size="mini"></u-tag>
				</view>
			</view>
			<!-- <span class="serve">爱心宠物救助站</span> -->
			<view class="address flex">
				<u-icon name="map-fill"></u-icon><span>{{ petData.address }}</span>
			</view>
			<view v-if="role == 2" class="just-space-be adopt-btn">
				<u-button color="#6685ca" :disabled="isAdopt" text="申请领养" size="small" @click="toAdoptPet"></u-button>
				<u-button class="collect" :icon="collectIcon" size="small" @click="collectPet"></u-button>
			</view>
		</view>
		<view class="healthy-detail pet-content">
			<h3>健康状况</h3>
			<u-grid :border="false" col="2" v-if="petData">
				<u-grid-item>
					<u--text :margin="'10rpx 0 6rpx 0'" bold text="体重状况" size="12" color="#a4a4a4"></u--text>
					<u--text :text="petData.weight + 'kg左右'" size="12"></u--text>
				</u-grid-item>
				<u-grid-item>
					<u--text :margin="'10rpx 0 6rpx 0'" bold text="疫苗次数" size="12" color="#a4a4a4"></u--text>
					<u--text :text="petData.vaccineNum + '次'" size="12"></u--text>
				</u-grid-item>
				<u-grid-item>
					<u--text :margin="'10rpx 0 6rpx 0'" bold text="皮毛状况" size="12" color="#a4a4a4"></u--text>
					<u--text :text="petData.coatColor" size="12"></u--text>
				</u-grid-item>
				<u-grid-item>
					<u--text :margin="'10rpx 0 6rpx 0'" bold text="驱虫次数" size="12" color="#a4a4a4"></u--text>
					<u--text :text="petData.dewormNum + '次'" size="12"></u--text>
				</u-grid-item>
			</u-grid>
			<view v-else>
				<u-empty mode="data" text="还没有健康状况数据^_^"></u-empty>
			</view>
		</view>
		<view class="care-detail pet-content">
			<h3>护理记录</h3>

			<u-steps v-if="nurseList.length > 0" activeColor="#6685ca" :current="nurseList.length || 1"
				direction="column" dot="true">
				<u-steps-item :title="item.createTime" v-for="(item, index) in nurseList" :key="index">
					<template #desc>
						<p>{{ getPetNurseType(item.nurseType) }}</p>
						<p>{{ item.contnet }}</p>
					</template>
				</u-steps-item>
			</u-steps>
			<view v-else>
				<u-empty mode="data" text="还没有护理记录^_^"></u-empty>
			</view>
		</view>
		<view class="character-detail pet-content">
			<h3>性格描述</h3>
			<p>{{ rescueInfo.description || '暂无性格描述信息' }}</p>
		</view>
		<view class="adopt-detail pet-content">
			<h3>领养需知</h3>
			<p>{{ rescueInfo.adoptionNotice || '暂无领养需知信息' }}</p>
		</view>
		<view class="save-story pet-content">
			<h3>救助故事</h3>
			<p>{{ rescueInfo.rescueStory || '暂无救助故事信息' }}</p>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex';
	import {
		petDetail,
	} from '@/api/userApi/user';
	import {
		petCollect,
		petDetailFiles,
		petDetailRescueInfo,
		userApplyStatus
	} from '../../../api/userApi/petDetail';
	import {
		petNurseList
	} from '../../../api/rescuerApi/petNurse';
	export default {
		data() {
			return {
				role: undefined,
				petId: undefined,
				collectIcon: "heart",
				carouselList: [],
				petData: undefined,
				rescueInfo: undefined,
				isAdopt: false, //是否已申请领养
				nurseList: [],
				nurseType: undefined,
			};
		},
		onLoad(options) {
			console.log('接收的参数：', options);
			this.petId = options.petId || 0
			// 获取数据
			this.getPetDetail(options.petId);
			this.getPetDetailFiles(options.petId)
			this.getPetApplyStatus(options.petId)
			this.getPetRescueInfo(options.petId)
			this.getPetNurseList(options.petId)
		},
		onShow() {
			this.getPetApplyStatus(this.petId);
		},
		computed: {
			getRole() {
				this.role = this.$store.state.roleId
			},
			getNurseType() {
				this.nurseType = this.$store.state.nurseType
			},
			...mapGetters(['getPetSize', 'getTagType'])
		},
		methods: {
			getPetDetail(id) {
				petDetail(id).then(res => {
					console.log(res);
					this.petData = res.data
					this.collectIcon = this.petData.collectionStatus == 0 ? "heart" : "heart-fill"
				})
			},
			//宠物详情的图片和视频
			getPetDetailFiles(id) {
				petDetailFiles(id).then(res => {
					console.log(res);
					this.carouselList = [...res.data.videoList, ...res.data.pictureList]
				})
			},
			//获取宠物领养状态
			getPetApplyStatus(id) {
				userApplyStatus(id).then(res => {
					console.log(res);
					if (res.data != "未申请") {
						this.isAdopt = true
					}
				})
			},
			//获取宠物救助信息
			getPetRescueInfo(id) {
				petDetailRescueInfo(id).then(res => {
					this.rescueInfo = res.data
				})
			},
			//获取宠物护理记录
			getPetNurseList(id) {
				petNurseList(id).then(res => {
					console.log("护理记录" + res);
					this.nurseList = res.data
				})
			},
			getPetNurseType(index) {
				const type = this.nurseType.find(item => item.key == index)
				return type.value
			},
			//收藏取消宠物
			collectPet() {
				petCollect(this.petId).then(res => {
					console.log(res);
					uni.showToast({
						title: res.data,
						icon: 'none',
						duration: 2000
					})
				})
				this.collectIcon = this.collectIcon == "heart-fill" ? "heart" : "heart-fill"
				//this.getPetDetail(this.petId)
			},
			toAdoptPet() {
				uni.navigateTo({
					url: `/pages/petDetailList/petAdopt/petAdopt?petId=${this.petId}`
				})
				//未实名认证,提醒
				// if (this.petData.idCardExist != 1) {
				// 	uni.showModal({
				// 		title: '提示',
				// 		content: "未进行实名认证,是否前往实名认证?",
				// 		success: ({
				// 			confirm
				// 		}) => {
				// 			if (confirm) {
				// 				//重定向
				// 				uni.reLaunch({
				// 					url: "/pages/userList/identify/identify"
				// 				})
				// 			}
				// 		}
				// 	})
				// } else {
				// 	uni.navigateTo({
				// 		url: `/pages/petDetailList/petAdopt/petAdopt?petId=${this.petId}`
				// 	})
				// }

			}
		}
	}
</script>

<style lang="scss">
	.pet-detail {

		padding: 0rpx 30rpx 20rpx;


		.pet-content {
			margin-top: 20rpx;
			background-color: #fff;
			padding: 20rpx 30rpx;
			border-radius: 20rpx;
			box-sizing: border-box;
		}

		.pet-detail {
			margin-top: 0rpx;
			background-color: #fff;
			padding: 20rpx 30rpx;
			border-radius: 20rpx;
			box-sizing: border-box;
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

			.address {
				margin: 10rpx 0;
				font-size: 22rpx;
				color: #7b7b7b;
				font-weight: 600;
				border-bottom: 1px solid #c3c3c3;
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

		h3 {
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




	}
</style>