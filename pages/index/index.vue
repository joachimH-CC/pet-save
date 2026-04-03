<template>
	<view class="index">
		<view class="index-content">
			<u-swiper radius="20rpx" :list="bannerList" keyName="image" indicator indicatorMode="line"
				circular></u-swiper>
			<!-- <view>
				<u-notice-bar :text="text1"></u-notice-bar>
			</view> -->
			<!-- 用户端 -->
			<view v-if="role==2" class="choose">
				<u-row justify="space-between">
					<view class="ai-match btn" @click="toAIMatch">
						<u-icon size="60rpx" color="#fff" name="scan"></u-icon>
						<span>AI智能匹配</span>
						<span style="font-size: 20rpx;">根据您的生活方式推荐最适合的宠物伙伴</span>
					</view>
					<view class="knowledge btn" @click="toKnowledge">
						<u-icon size="60rpx" color="#fff" name="edit-pen-fill"></u-icon>
						<span>AI知识学习</span>
						<span style="font-size: 20rpx;">了解宠物养护方式,提高自己的领养优先级!</span>
					</view>
				</u-row>
			</view>
			<view class="pet-container">
				<view v-if="role==2" class="just-space-be pet-title">
					<view style="width: 1300rpx;">
						<span style="font-weight: 600;padding: 0 5rpx;">宠物领养</span>
					</view>
					<u-button color="#85a2e4" size="small" text="筛选宠物" @click="openPop"></u-button>
				</view>
				<u-subsection v-if="role==101" bgColor="#d8e1f2" activeColor="#5c7bc5" inactiveColor="#343644"
					:list="list" :current="curNow" @change="sectionChange"></u-subsection>
				<u-list @scrolltolower="scrollUserPetList" v-if="Array.isArray(displayList) && displayList.length"
					:height="height">
					<u-list-item :key="item.petId" v-for="(item,index) in displayList">
						<view :class="{ 'saver-border': role === 2, 'saver-pet-item': true }">
							<view :class="{ 'pet-border': role === 101, 'pet-item': true } "
								@click="toPetDetail(item.petId)">
								<u--image :src="item.petPicture" width="200rpx" height="200rpx" radius="20rpx" />
								<view class="pet-item-content">
									<view v-if="role==101" class="adopt-status"><u-tag
											:text="getAdoptStatus(item.status)" plain
											:type="getAdoptStatusType(item.status)" size="mini"></u-tag>
									</view>
									<view :class="{ 'woman': item.sex == 1}">
										<u--text v-if="item.sex == 1" :margin="'0 6rpx 6rpx 0'"
											:text="item.varietyLabel || item.variety" bold size="16"
											suffixIcon="woman"></u--text>
										<u--text v-if="item.sex == 0 " :margin="'0 6rpx 6rpx 0'"
											:text="item.varietyLabel || item.variety" bold size="16"
											suffixIcon="man"></u--text>
										<u--text v-if="item.sex == 2 " :margin="'0 6rpx 6rpx 0'"
											:text="item.varietyLabel || item.variety" bold size="16"></u--text>
									</view>
									<span v-if="role==2"
										class="discribe">{{item.age+"岁 | "+item.petTypeName+" | "+getPetSize(item.size)}}</span>
									<span v-if="role==101"
										class="discribe">{{item.age+"岁 | "+item.petTypeName+" | "+item.shape}}</span>
									<view class="pet-label flex"
										v-if="Array.isArray(item.personalityLabels) && item.personalityLabels.length>0 && role==2">
										<view class="tag" v-for="(lab,i) in item.personalityLabels" :key="i"><u-tag
												:text="lab" plain size="mini" :type="getTagType(i)"> </u-tag></view>
									</view>
									<view class="pet-label flex"
										v-if="Array.isArray(item.petLabels)  && item.petLabels.length>0 && role==101">
										<view class="tag" v-for="(lab,i) in item.petLabels" :key="i"><u-tag
												:text="lab.labelName" plain size="mini" :type="getTagType(i)"> </u-tag>
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
											<u-tag :icon="item.dewormNum > 0  ? 'checkmark' : 'close'"
												borderColor="#e9f1fb" bgColor="#e9f1fb" color="#5a7eca"
												:text="item.dewormNum > 0 ? '已驱虫' : '未驱虫'" size="mini"></u-tag>
										</view>
										<view class="tag">
											<u-tag :icon="item.vaccineNum >0 ? 'checkmark' : 'close'"
												borderColor="#e9f1fb" bgColor="#e9f1fb" color="#5a7eca"
												:text="item.vaccineNum >0 ? '已疫苗' : '未疫苗'" size="mini"></u-tag>
										</view>
									</view>
								</view>
							</view>
							<view class="just-space-be" v-if="role==101">
								<u-button text="护理记录" type="warning" plain size="mini"
									@click="toPetCare(item.petId)"></u-button>
								<view class="flex fuc">
									<u-button icon="edit-pen-fill" text="编辑" color="#e6f4ff" size="mini"
										@click="editPet(item.rescueId)"></u-button>
									<u-button icon="trash-fill" text="删除" size="mini" type="error"
										@click="delPet(item.rescueId)"></u-button>
								</view>
							</view>
						</view>
					</u-list-item>
					<u-loadmore v-if="displayList.length==userPetList.length && !loading " status="nomore" />

				</u-list>
				<!-- 加载中提示 -->
				<u-loadmore v-if="loading" :status="status" />

			</view>
			<view v-if="displayList.length==0 && role==101 && !loading">
				<u-empty mode="list" text="快去添加宠物吧! ^_^"></u-empty>
			</view>
			<view v-if="displayList.length==0 && role==2 && !loading">
				<u-empty mode="list" text="暂无数据"></u-empty>
			</view>
			<!-- 筛选表单 -->
			<u-popup :round="10" :show="showPop" @close="closePop" mode="top">
				<view class="search">
					<u--form ref="formRef" :model="searchForm" :labelStyle="{fontSize:'30rpx'}" labelWidth="70">
						<u-form-item label="年龄:" borderBottom>
							<u-radio-group v-model="searchForm.ageRange" placement="row">
								<u-radio :customStyle="{marginRight: '20rpx'}" v-for="(item, index) in petAge"
									:key="index" :label="item.name" :name="index"></u-radio>
							</u-radio-group>
						</u-form-item>
						<u-form-item label="性别:" borderBottom>
							<u-radio-group v-model="searchForm.sex" placement="row">
								<u-radio :customStyle="{marginRight: '20rpx'}" v-for="(item, index) in petSex"
									:key="index" :label="item.name" :name="index"></u-radio>
							</u-radio-group>
						</u-form-item>
						<u-form-item label="体型:" borderBottom>
							<u-radio-group size="mini" v-model="searchForm.size" placement="row">
								<u-radio :customStyle="{marginRight: '20rpx'}" v-for="(item, index) in petSize"
									:key="item.key" :label="item.value" :name="item.key">
								</u-radio>
							</u-radio-group>
						</u-form-item>

						<u-form-item label="品种:" borderBottom>
							<view class="type-scroll">
								<u-radio-group size="mini" v-model="searchForm.petTypeId" placement="row">
									<u-radio :customStyle="{marginRight: '20rpx', marginBottom: '10rpx'}"
										v-for="(item, index) in petType" :key="item.key" :label="item.name"
										:name="item.key">
									</u-radio>
								</u-radio-group>
							</view>
						</u-form-item>

						</u-form-item>
						<u-form-item label="健康状态:" borderBottom>
							<u-checkbox-group size="mini" v-model="searchForm.healthyStatus" placement="row">
								<u-checkbox :customStyle="{marginRight: '20rpx'}" v-for="(item, index) in petStatus"
									:key="index" :label="item.name" :name="index">
								</u-checkbox>
							</u-checkbox-group>
						</u-form-item>
						<u-form-item>
							<u-button style="width: 400rpx;" color="#6685ca" type="primary" text="筛选" shape='circle'
								@click="handleSearch"></u-button>
						</u-form-item>
					</u--form>
				</view>
			</u-popup>
		</view>
		<view class="bac"> </view>
		<view v-if="role==101" class="add-btn">
			<u-icon @click="addPet" size="100rpx" name="plus-circle-fill" color=" rgb(78, 112, 187,0.7)"></u-icon>
		</view>
		<u-back-top :scroll-top="scrollTop"></u-back-top>
		<custom-tab-bar></custom-tab-bar>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import {
		userHomePetList,
		homeBanner,
		login,
	} from '@/api/userApi/user.js';
	import {
		petType
	} from '../../api/commonApi/common.js';
	import CustomTabBar from '@/components/CustomTabBar.vue';
	import {
		deletePet,
		rescuePetList
	} from '../../api/rescuerApi';
	import {
		beginTest
	} from '../../api/userApi/knowlegde.js';
	import {
		isQuestionnaire
	} from '../../api/userApi/aiMatch.js';
	import {
		personCenter
	} from '../../api/commonApi/person.js';
	import {
		hasToken
	} from '../../utils/auth.js';
	import env from '../../utils/env.js';
	export default {
		components: {
			CustomTabBar,
		},
		data() {
			return {
				scrollTop: 0,
				role: undefined,
				curNow: 0,
				displayList: [], // 存储当前要显示的数据
				pageSize: 7, // 每次加载数量
				currentLength: 0, // 当前已显示数量
				totalCount: 0, // 总数据条数
				loading: false, // 是否加载
				status: "loading", //加载状态
				showPop: false,
				bannerList: [], //轮播图列表
				//筛选列表
				searchForm: {
					ageRange: 3, //年龄范围
					dewormStatus: "", //是否驱虫
					healthyStatus: "",
					sterilizationStatus: "", //是否绝育
					vaccineStatus: "", //是否疫苗
					petTypeId: "", //宠物品种
					sex: 2,
					size: "",
				},
				//宠物年龄
				petAge: [{
						name: "0-1岁",
						disabled: false,
					},
					{
						name: "1-2岁",
						disabled: false
					},
					{
						name: "2-3岁",
						disabled: false
					},
					{
						name: "不限",
						disabled: false
					}
				],
				//宠物性别
				petSex: [{
						name: "公",
						disabled: false,
					},
					{
						name: "母",
						disabled: false
					},
					{
						name: "不限",
						disabled: false
					}
				],
				//健康情况
				petStatus: [{
						name: "已疫苗",
						disabled: false
					},
					{
						name: "已驱虫",
						disabled: false
					},
					{
						name: "已绝育",
						disabled: false
					}
				],
				//宠物领养状况
				adoptStatus: [{
						value: "待领养",
						key: 0,
						type: "info"
					},
					{
						value: "申请中",
						key: 2,
						type: "warning"
					},
					{
						value: "已领养",
						key: 1,
						type: "success"
					}
				],
				petSize: [],
				//宠物品种
				petType: [],
				userPetList: [],
				height: undefined,
				//救助者
				list: ['全部', '待领养', '已领养', '申请中'],
				idCardExist: undefined,
			}
		},
		onLoad() {
			if (this.role) {
				this.getPetList()
			}
			this.getUserHomeBanner()

		},
		onShow() {
			if (this.role) {
				this.getPetList()
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		computed: {
			getRole() {
				this.role = this.$store.state.roleId
			},
			getSize() {
				this.petSize = this.$store.state.petSize
			},
			// 2. 映射 Vuex 的 getPetSize 到组件计算属性
			...mapGetters(['getPetSize', 'getTagType'])

		},
		methods: {
			getPetList() {
				if (this.role == 2) {
					this.height = "calc(100vh - 730rpx)"
					this.getUserPetList()

				} else if (this.role == 101 && hasToken() !== '') {
					console.log(hasToken());
					this.height = "calc(100vh - 530rpx)"
					this.getRescuePetList()
					this.getPersonInfo()
				}

			},
			// 用户端
			//获取宠物列表
			getUserPetList(val = {}) {
				this.loading = true;
				userHomePetList(val).then(res => {
					console.log(res);
					this.userPetList = res.data
					if (Array.isArray(this.userPetList)) this.totalCount = this.userPetList.length;
					// 初始化显示前5条数据
					this.loadMoreData();
					this.loading = false;
				}).catch(err => {

					this.loading = false;
				});
			},
			getRescuePetList() {
				this.loading = true;
				const len = this.curNow == 0 ? '' : this.curNow - 1

				rescuePetList({
					status: len
				}).then(res => {
					console.log(res);
					this.userPetList = Array.isArray(res.data) ? res.data : [];
					console.log(this.userPetList);
					if (this.userPetList.length) this.totalCount = this.userPetList.length;
					// 初始化显示前5条数据
					this.loadMoreData();
					this.loading = false;
				}).catch(err => {

					this.loading = false;
				});
			},
			// 加载更多列表数据
			loadMoreData() {
				if (!Array.isArray(this.userPetList)) this.userPetList = [];
				if (!Array.isArray(this.displayList)) this.displayList = [];
				const end = this.currentLength + this.pageSize;
				const newData = Array.isArray(this.userPetList) ?
					this.userPetList.slice(this.currentLength, end) : [];
				this.displayList = [...this.displayList, ...newData];
				this.currentLength = this.displayList.length;
				this.hasMore = this.currentLength < this.totalCount;
			},
			// 滚动到底部加载更多
			scrollUserPetList() {
				// 防止重复加载和没有更多数据时继续加载
				if (this.loading || !this.hasMore) return;

				this.loading = true;
				this.loadMoreData();
				this.loading = false;
			},
			//获取轮播图
			getUserHomeBanner() {
				homeBanner().then(res => {
					this.bannerList = res.data.map(item => {
						return env.BASE_URL + item
					})
				})
			},
			//去智能匹配页
			toAIMatch() {
				let val = undefined
				isQuestionnaire().then(res => {
					val = res.data
					console.log("aimatch" + val);
					//未生成问卷记录
					if (val == 1) {
						beginTest({
							knowledgeId: 22
						}).then(res => {
							console.log(res);
							uni.navigateTo({
								url: "/pages/matchList/aiMatch/aiMatch"
							})
						})
						//已完成答卷,进入ai列表
					} else if (val == 2) {
						uni.navigateTo({
							url: "/pages/matchList/matchPetList/matchPetList"
						})
						//未完成答题但有记录,直接进入ai问卷
					} else {
						uni.navigateTo({
							url: "/pages/matchList/aiMatch/aiMatch"
						})
					}
				})
			},
			//去知识学习页
			toKnowledge() {
				uni.navigateTo({
					url: "/pages/knowledgeList/knowledge/knowledge"
				})
			},
			//获取宠物种类
			getPetType() {
				petType().then(res => {
					let type = []
					res.data.map(item => {
						type.push({
							key: item.petTypeId,
							name: item.petTypeName,
						})
					})
					this.petType = type
				})
			},
			//打开筛选弹窗
			openPop() {
				this.getPetType()
				//重置数据
				this.searchForm = {
						ageRange: 3, //年龄范围
						dewormStatus: "", //是否驱虫
						healthyStatus: "",
						sterilizationStatus: "", //是否绝育
						vaccineStatus: "", //是否疫苗
						petTypeId: "", //宠物品种
						sex: 2,
						size: "",
					},
					this.showPop = true
			},
			closePop() {
				this.showPop = false
			},
			//筛选
			handleSearch() {
				console.log(this.searchForm.healthyStatus);
				if (this.searchForm.healthyStatus) {
					if (this.searchForm.healthyStatus.includes(0)) {
						this.searchForm.vaccineStatus = 1
					} else if (this.searchForm.healthyStatus.includes(1)) {
						this.searchForm.dewormStatus = 1
					} else if (this.searchForm.healthyStatus.includes(2)) {
						this.searchForm.sterilizationStatus = 1
					}
				}
				const {
					healthyStatus,
					...rest
				} = this.searchForm
				console.log(rest);
				this.currentLength = 0
				this.displayList = []
				this.getUserPetList({
					...rest
				})

				this.showPop = false
				uni.showToast({
					title: "筛选成功!",
					duration: 2000
				})
			},
			resetForm(val) {
				this.$refs[val].resetFields()
				this.$refs[val].clearValidate()
			},
			toPetDetail(id) {
				uni.navigateTo({
					url: `/pages/petDetailList/petDetail/petDetail?petId=${id}`
				})
			},
			sectionChange(val) {
				this.curNow = val
				this.currentLength = 0
				this.displayList = []
				this.getRescuePetList()
			},
			//救助者端
			getAdoptStatus(val) {
				const status = this.adoptStatus.find(item => item.key == val)
				return status.value
			},
			getAdoptStatusType(val) {
				const status = this.adoptStatus.find(item => item.key == val)
				return status.type
			},
			//去编辑宠物页,添加宠物
			addPet() {
				if (this.idCardExist != 1) {
					uni.showModal({
						title: '提示',
						content: "是否前往实名认证",
						success: ({
							confirm
						}) => {
							if (confirm) {
								uni.navigateTo({
									url: "/pages/userList/identify/identify"
								})
							}
						}
					})
					return
				}
				uni.navigateTo({
					url: "/pages/saverIndexList/editPet/editPet"
				})
			},
			//编辑宠物
			editPet(id) {
				uni.navigateTo({
					url: `/pages/saverIndexList/editPet/editPet?rescueId=${id}`
				})
			},
			//去护理记录页
			toPetCare(id) {
				uni.navigateTo({
					url: `/pages/saverIndexList/petCare/petCare?petId=${id}`
				})
			},
			delPet(id) {
				uni.showModal({
					title: '提示',
					content: "是否确定删除宠物",
					success: ({
						confirm
					}) => {
						if (confirm) {
							deletePet(id).then(res => {
								console.log(res);
								uni.showToast({
									title: "删除成功!",
									icon: "none"
								})
								this.getRescuePetList()
							})
						}
					}
				})
			},
			//救助者是否实名认证,如果没有,不能添加宠物

			getPersonInfo() {
				personCenter().then(res => {
					console.log(res);
					this.idCardExist = res.data.idCardExist
				})
			},
		}
	}
</script>

<style lang="scss">
	.index {
		height: 92vh;

		.type .u-radio-group .u-row {
			display: grid !important;
			grid-template-columns: repeat(3, 1fr);
		}

		.add-btn {
			position: fixed;
			bottom: 130rpx;
			right: 10rpx;
		}

		.bac {
			width: 100%;
			z-index: -1;
			position: absolute;
			top: 0px;
			height: 400rpx;
			background: linear-gradient(to bottom, #597dc9, #fff);
		}

		.index-content {
			padding: 30rpx;
			height: 86vh;



			.choose {
				margin: 20rpx 0;

				.btn {

					padding: 20rpx;
					text-align: center;
					box-sizing: border-box;
					border-radius: 20rpx;
					height: 200rpx;
					width: 330rpx;
					background: linear-gradient(to right, #6688d3, #b3cafe);
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					color: #fff;
					font-size: 25rpx;
					font-weight: 600;
				}

				.ai-match {}

				.knowledge {
					background: linear-gradient(to right, #d08b92, #e7d4f9);
				}
			}

			.pet-container {


				.pet-title {
					margin: 30rpx 0 20rpx 0;
					line-height: 60rpx;
				}


			}

			.pet-item {
				padding: 20rpx;
				box-sizing: border-box;
				margin-bottom: 20rpx;
				// border-radius: 20rpx;
				border-bottom: 2rpx solid #aac3e2;
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
						right: -70rpx;
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


			}


			.u-subsection {
				margin-top: 50rpx;
			}

			.saver-pet-item {
				margin-bottom: 20rpx;
				background-color: #fff;
				padding: 10rpx 0;
				box-sizing: border-box;
				border-bottom: 2rpx solid #aac3e2;

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



				}

				.pet-border {
					border-bottom: none;
				}
			}

			.saver-border {
				margin-bottom: 0rpx;
				border-bottom: none;
			}

			.search {
				padding: 10rpx 50rpx 0;

				.u-form-item {
					margin-top: 20rpx;
				}

				.u-button {
					width: 500rpx !important;
				}

				text {
					font-size: 26rpx !important;
				}
			}
		}


		.type-scroll {
			max-height: 200rpx; // 设置最大高度
			overflow-y: auto; // 允许垂直滚动
			padding-right: 10rpx; // 为滚动条留出空间

			.u-radio-group .u-row {
				display: grid !important;
				grid-template-columns: repeat(3, 1fr);
				gap: 10rpx;
			}

			// 优化滚动条样式（可选）
			&::-webkit-scrollbar {
				width: 6rpx;
			}

			&::-webkit-scrollbar-track {
				background: #f1f1f1;
				border-radius: 3rpx;
			}

			&::-webkit-scrollbar-thumb {
				background: #c1c1c1;
				border-radius: 3rpx;
			}

			&::-webkit-scrollbar-thumb:hover {
				background: #a1a1a1;
			}

		}

	}
</style>