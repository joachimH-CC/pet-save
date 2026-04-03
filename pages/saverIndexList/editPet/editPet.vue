<template>
	<view class="edit-pet">
		<u--form labelPosition="top" ref="formRef" :model="form"
			:labelStyle="{ fontSize: '28rpx', marginBottom: '10rpx' }" labelWidth="140">
			<!-- 宠物基础信息 -->
			<view class="msg-container">
				<u--text :margin="'6rpx 0 6rpx 0'" bold text="基础信息" size="15" color="#5c7bc5"></u--text>
				<u-form-item label="宠物品种:" borderBottom @click="petNamePick.show = true">
					<u-input border="none" placeholder="请选择宠物类别" v-model="form.varietyId"></u-input><u-icon slot="right"
						name="arrow-right"></u-icon>
					<u-picker @cancel="petNamePick.show = false" @confirm="confirmPetName" :show="petNamePick.show"
						:columns="petNamePick.petList"></u-picker>
				</u-form-item>
				<u-form-item label="宠物类别:" borderBottom @click="petTypePick.show = true">
					<u-input border="none" placeholder="请选择宠物类别" v-model="form.petTypeId"></u-input><u-icon slot="right"
						name="arrow-right"></u-icon>
					<u-picker @cancel="petTypePick.show = false" @confirm="confirmPetType" :show="petTypePick.show"
						:columns="petTypePick.petTypeList"></u-picker>
				</u-form-item>
				<u-form-item prop="age" label="宠物年龄:" borderBottom>
					<u-input border="none" placeholder="请输入宠物年龄" v-model="form.age"></u-input>
				</u-form-item>
				<u-form-item prop="sex" label="宠物性别:" borderBottom>
					<u-radio-group size="24rpx" v-model="form.sex" placement="row">
						<u-radio labelSize="26rpx" :customStyle="{ marginRight: '8px' }" key="0" label="公" name="0">
						</u-radio>
						<u-radio labelSize="26rpx" :customStyle="{ marginRight: '8px' }" key="1" label="母" name="1">
						</u-radio>
						<u-radio labelSize="26rpx" :customStyle="{ marginRight: '8px' }" key="2" label="未知" name="2">
						</u-radio>
					</u-radio-group>
				</u-form-item>
				<u-form-item prop="address" label="宠物地址:" borderBottom>
					<u-input border="none" placeholder="请输入宠物救助地址" v-model="form.address"></u-input>
				</u-form-item>
				<u-form-item label="宠物标签:" borderBottom @click="petLabelPick.show = true">
					<u-input border="none" placeholder="请选择宠物标签"></u-input><u-icon slot="right"
						name="arrow-right"></u-icon>
					<u-picker @cancel="petLabelPick.show = false" @confirm="confirmLabel" :show="petLabelPick.show"
						:columns="petLabelPick.list"></u-picker>
				</u-form-item>
				<u-form-item v-if="tags.length">
					<view class="tag flex">
						<u-tag v-for="(item, index) in tags" :key="index" plain :text="item" size="mini" closable
							@close="delTag(index)"></u-tag>
					</view>
				</u-form-item>
			</view>
			<!-- 宠物健康详情 -->
			<view class="msg-container">
				<u--text :margin="'6rpx 0 6rpx 0'" bold text="健康详情" size="15" color="#5c7bc5"></u--text>
				<u-form-item prop="sterilizationStatus" label="是否绝育:" borderBottom>
					<u-radio-group size="24rpx" v-model="form.sterilizationStatus" placement="row">
						<u-radio labelSize="26rpx" :customStyle="{ marginRight: '8px' }" key="1" label="是" name="1">
						</u-radio>
						<u-radio labelSize="26rpx" :customStyle="{ marginRight: '8px' }" key="0" label="否" name="0">
						</u-radio>
					</u-radio-group>
				</u-form-item>
				<u-form-item prop="dewormNum" label="驱虫次数:" borderBottom>
					<u-input border="none" placeholder="请输入宠物驱虫次数" v-model="form.dewormNum"></u-input>
				</u-form-item>
				<u-form-item prop="vaccineNum" label="疫苗次数:" borderBottom>
					<u-input border="none" placeholder="请输入宠物疫苗次数" v-model="form.vaccineNum"></u-input>
				</u-form-item>
				<u-form-item prop="weight" label="宠物体重(kg):" borderBottom>
					<u-input border="none" placeholder="请输入宠物体重" v-model="form.weight"></u-input>
				</u-form-item>
				<u-form-item prop="coatColor" label="皮毛颜色:" borderBottom>
					<u-input border="none" placeholder="请输入宠物皮毛颜色" v-model="form.coatColor"></u-input>
				</u-form-item>

			</view>
			<!--  图片与视频-->
			<view class="msg-container">
				<u--text :margin="'6rpx 0 6rpx 0'" bold text="图片与视频" size="15" color="#5c7bc5"></u--text>
				<u-form-item>
					<u--text :margin="'10rpx 0'" text="请上传宠物图片" size="12" color="#c0c7d9"></u--text>
					<u-button @click="chooseImg" color="#eaeaeb" icon="plus"></u-button>
					<view class="img" v-if="fileListImg && fileListImg.length > 0">
						<u-grid :border="false" col="3">
							<u-grid-item v-for="(path, index) in fileListImg" :key="index" class="img-item-container">
								<u--image :showLoading="true" radius="10rpx" :src="path.path" width="100px"
									height="100px"></u--image>
								<view class="delete-btn" @click="deleteImage(index)">
									<u-icon name="close-circle" size="30rpx" color="#5c7bc5"></u-icon>
								</view>
							</u-grid-item>
						</u-grid>
					</view>
				</u-form-item>
				<u-form-item>
					<u--text :margin="'10rpx 0'" text="请上传宠物视频" size="12" color="#c0c7d9"></u--text>
					<u-button @click="chooseVideo" color="#eaeaeb" icon="plus"></u-button>
					<view class="img" v-if="fileListV && fileListV[0] && fileListV[0].path">
						<view class="video-container">
							<video class="video-item" :src="fileListV[0].path"></video>
							<view class="delete-btn" @click="deleteVideo">
								<u-icon name="close-circle" size="30rpx" color="#5c7bc5"></u-icon>
							</view>
						</view>
					</view>
				</u-form-item>
			</view>
			<!-- 其他信息 -->
			<view class="msg-container">
				<u--text :margin="'6rpx 0 6rpx 0'" bold text="其他信息" size="15" color="#5c7bc5"></u--text>
				<u-form-item prop="description" label="宠物性格:" borderBottom>
					<u--textarea border="none" v-model="form.description" placeholder="请输入描述宠物性格"></u--textarea>
				</u-form-item>
				<u-form-item prop="adoptionNotice" label="领养须知:" borderBottom>
					<u--textarea border="none" v-model="form.adoptionNotice" placeholder="请输入改宠物的领养须知"></u--textarea>
				</u-form-item>
				<u-form-item prop="rescueStory" label="救助故事:" borderBottom>
					<u--textarea border="none" v-model="form.rescueStory" placeholder="请输入改宠物救助故事"></u--textarea>
				</u-form-item>
			</view>
			<u-form-item>
				<view class="just-space-be">
					<u-button text="取消" @click="toIndex"></u-button>
					<u-button style="width: 400rpx;" color="#6685ca" type="primary" text="提交"
						@click="handleSubmit"></u-button>
				</view>
			</u-form-item>
		</u--form>
	</view>
</template>

<script>
import {
	petLabel,
	petType
} from '../../../api/commonApi/common';
import {
	addPet,
	editPet,
	rescuePetDetail
} from '../../../api/rescuerApi';
import {
	getToken
} from '../../../utils/auth';
import env from '@/utils/env.js';
export default {
	data() {
		return {
			imgpath: [],
			form: {
				petId: '',
				rescueId: '',
				varietyId: '', //宠物品种id
				petTypeId: '', //宠物类型id
				age: '',
				sex: '',
				address: '',
				petLabelIds: [], //宠物性格列表
				sterilizationStatus: '', //是否绝育
				vaccineNum: '', //疫苗次数
				dewormNum: '', //驱虫次数
				weight: '',
				coatColor: '', //毛发颜色
				// activity: '',//
				description: '', //宠物描述
				adoptionNotice: '', //领养须知
				rescueStory: '', //救助故事
				petFiles: [] //图片视频列表
			},
			rules: {
				varietyId: [{
					required: true,
					message: '请输入宠物品种',
					trigger: ['change']
				}],
				petTypeId: [{
					required: true,
					trigger: "change",
					message: "请选择宠物类别"
				},

				],
				sex: [{
					required: true,
					trigger: "blur",
					message: "请选择宠物性别"
				},

				],
				age: [{
					required: true,
					trigger: ['blur', 'change'],
					message: "请输入宠物年龄"
				},
				{
					pattern: /^\d+$/,
					message: '请输入数字',
					trigger: 'blur'
				}

				],

				// petImg: [{
				// 	required: true,
				// 	trigger: "change",
				// 	message: "请上传宠物图片"
				// }, ],
				tags: [{
					required: true,
					trigger: "change",
					message: "请选择宠物标签"
				},],
				address: [{
					required: true,
					trigger: ['blur'],
					message: "请选择宠物所在地址"
				}],
				sterilizationStatus: [{
					required: true,
					trigger: ['blur', 'change'],
					message: "请确认宠物是否绝育"
				},],

				vaccineNum: [{
					required: true,
					trigger: ['blur', 'change'],
					// message: "请确认宠物是否疫苗"
					message: "请输入宠物疫苗次数"
				},
				{
					pattern: /^\d+$/,
					message: '请输入数字',
					trigger: 'blur'
				}
				],
				dewormNum: [{
					required: true,
					trigger: ['blur', 'change'],
					//message: "请确认宠物是否驱虫",
					message: "请输入宠物驱虫次数"
				},
				{
					pattern: /^\d+$/,
					message: '请输入数字',
					trigger: 'blur'
				}
				],
				weight: [{
					required: true,
					trigger: ['blur', 'change'],
					message: "请输入宠物体重"
				}, {
					pattern: /^\d+$/,
					message: '请输入数字',
					trigger: 'blur'
				}],
				coatColor: [{
					required: true,
					trigger: "blur",
					message: "请输入宠物皮毛颜色"
				}],
				description: [{
					required: true,
					trigger: "blur",
					message: "请输入描述宠物性格"
				}],
				adoptionNotice: [{
					required: true,
					trigger: "blur",
					message: "请输入改宠物的领养须知"
				}],
				rescueStory: [{
					required: true,
					trigger: "blur",
					message: "请输入改宠物救助故事"
				}],
			},
			// 宠物类别
			petTypePick: {
				show: false,
				petTypeList: [
					[]
				],
			},
			petNamePick: {
				show: false,
				petList: [
					[]
				],
			},
			petLabelPick: {
				show: false,
				list: [
					[]
				]
			},
			petType: [], //宠物种类
			petVarity: [], //宠物品种
			petLabel: [], //宠物标签
			mode: "add",
			tags: [],
			fileListImg: [],
			fileListV: [],
			rescueId: undefined,

		};
	},
	onLoad(options) {
		// 获取数据
		if (options.rescueId) {
			this.mode = "edit"
			this.rescueId = options.rescueId
			this.getPetDetail(options.rescueId);
		}
		this.getPetVarity()
		this.getPetType()

	},
	onReady() {
		this.$refs.formRef.setRules(this.rules)
	},
	methods: {
		handleSubmit() {
			if (this.tags.length == 0) return uni.showToast({
				icon: "none",
				title: "请选择宠物标签"
			})
			if (this.fileListImg.length == 0) return uni.showToast({
				icon: "none",
				title: "请选择宠物图片"
			})
			if (this.fileListV.length == 0) return uni.showToast({
				icon: "none",
				title: "请选择宠物视频"
			})
			this.$refs.formRef.validate().then(res => {
				let {
					petId,
					petLabelIds,
					varietyId,
					petTypeId,
					petFiles,
					...rest
				} = this.form
				const variety = this.petVarity.find(item => item.name == varietyId)
				varietyId = variety.key
				const type = this.petType.find(item => item.name == petTypeId)
				petTypeId = type.key

				petLabelIds = []
				this.petLabel.map(item => {
					if (this.tags.includes(item.name)) petLabelIds.push(item.key)
				})
				petFiles = [...this.fileListImg,
				...this.fileListV
				]
				console.log({
					petLabelIds,
					varietyId,
					petTypeId,
					petFiles,
					...rest
				});

				switch (this.mode) {
					case "add":
						addPet({
							petLabelIds,
							varietyId,
							petTypeId,
							petFiles,
							...rest
						}).then(res => {
							console.log(res);
							uni.showToast({
								icon: "none",
								title: "添加成功!",
							})
						})
						break;
					case "edit":
						editPet({
							petId,
							rescueId: this.rescueId,
							petLabelIds,
							varietyId,
							petTypeId,
							petFiles,
							...rest
						}).then(res => {
							console.log(res);
							uni.showToast({
								icon: "none",
								title: "修改成功!",
							})
						})
						break;

				}
				this.resetForm('formRef')
				uni.switchTab({
					url: "/pages/index/index"
				})
			}).catch(errors => {
				console.log(errors);
				uni.$u.toast('校验失败')
			})
		},
		getPetDetail(id) {
			rescuePetDetail(id).then(res => {
				console.log(res);
				//回显数据
				let {
					age,
					weight,
					vaccineNum,
					dewormNum,
					petTypeName,
					rescueTime,
					petFiles,
					status,
					variety,
					petLabels,
					...rest
				} = res.data

				this.form = {
					...rest
				}
				this.form.varietyId = variety
				this.form.petTypeId = petTypeName
				this.form.age = `${age}`
				this.form.weight = `${weight}`
				this.form.vaccineNum = `${vaccineNum}`
				this.form.dewormNum = `${dewormNum}`
				console.log(this.form.varietyId);
				petLabels?.map(item => [
					this.tags.push(item.labelName)
				])
				petFiles?.forEach(item => {
					if (item.type == 0) this.fileListImg.push({
						...item,
						display: 0
					})
					if (item.type == 1) this.fileListV.push({
						...item,
						display: 0
					})
				})

			})
		},
		//将选择的工作状态赋值给表单
		confirmPetType(val) {
			this.form.petTypeId = val.value[0]
			this.$refs.formRef.validateField('petTypeId')
			this.petTypePick.show = false
		},
		//将选择的工作状态赋值给表单
		confirmPetName(val) {
			this.form.varietyId = val.value[0]
			this.petNamePick.show = false
			this.$refs.formRef.validateField('varietyId')
		},
		//添加标签方法
		confirmLabel(val) {
			//如果改标签已选择,则直接关闭选择框
			if (this.tags.length) {
				const isTag = this.tags.some(item => val.value[0] === item)
				if (isTag) return this.petLabelPick.show = false
			}

			//标签不能超过3个
			if (this.tags.length > 3) {
				uni.showToast({
					icon: 'error',
					title: "标签不能超过3个"
				})
				return this.petLabelPick.show = false
			}
			this.tags.push(val.value[0])
			this.petLabelPick.show = false
			console.log(this.tags);
			//this.$refs.formRef.validateField('houseType')
		},
		delTag(index) {
			this.tags.splice(index, 1)
			console.log(this.tags);
		},
		// 删除图片
		deleteImage(index) {
			this.fileListImg.splice(index, 1);
		},
		// 删除视频
		deleteVideo() {
			this.fileListV = [];
			console.log('删除视频成功');

		},
		//返回宠物详情页
		toIndex() {
			this.resetForm('formRef')
			uni.switchTab({
				url: "/pages/index/index"
			})
		},
		//重置数据
		resetForm(val) {
			this.$refs[val].resetFields()
			this.$refs[val].clearValidate()
		},
		// 选择视频
		chooseVideo() {
			uni.chooseVideo({
				sourceType: ['album', 'camera'], // 从相册选择或拍摄
				maxDuration: 60, // 最大时长(秒)
				camera: 'back', // 默认使用后置摄像头
				success: (res) => {
					this.fileListV = [{
						type: 1,
						display: 0,
						path: res.tempFilePath,
					}]
					this.uploadFile([res.tempFilePath])
				},
				fail: (err) => {
					console.error('选择视频失败', err)
					uni.showToast({
						title: '选择视频失败',
						icon: 'none'
					})
				}
			})
		},
		//选择文件
		chooseImg() {
			uni.chooseImage({
				success: (res) => {
					//临时文件路径
					this.fileListImg = res.tempFilePaths.map(item => {
						return {
							type: 0,
							display: 0,
							path: item,
						}
					})
					console.log(this.fileListImg);
					this.uploadFile(res.tempFilePaths)
				}
			})
		},
		//获取多张文件路径,实现上传,promise.all
		uploadFile(fileList) {
			//console.log(fileList);
			const pathList = fileList.map(path => {
				return this.uploadPromise(path)
			})
			Promise.all(pathList).then(res => {
				console.log(res);
			})
		},

		//文件上传
		uploadPromise(filePath) {
			return new Promise((resolve, reject) => {
				uni.uploadFile({
					url: env.BASE_URL,
					//上传的临时文件路径
					filePath,
					name: "file", //服务器接收文件的字段名
					header: {
						Authorization: getToken()
					},
					success: (res) => {
						resolve(res);
					},
					fail: (err) => {
						reject(err);
					}
				})
			})

		},
		//获取宠物品种.性格标签
		getPetVarity() {
			petLabel({
				type: "品种",
				labelName: ''
			}).then(res => {
				console.log(res);
				let type = []
				let label = []
				res.data.map(item => {
					type.push({
						key: item.labelId,
						name: item.labelName,
					})
				})
				type.map(item => {
					this.petNamePick.petList[0].push(item.name)
				})
				this.petVarity = type
			})
			petLabel({
				type: "性格",
				labelName: ''
			}).then(res => {
				console.log(res);
				let label = []
				res.data.map(item => {
					label.push({
						key: item.labelId,
						name: item.labelName,
					})
				})
				label.map(item => {
					this.petLabelPick.list[0].push(item.name)
				})
				this.petLabel = label
			})
		},
		//获取宠物种类
		getPetType() {
			petType().then(res => {
				console.log(res);
				let type = []
				res.data.map(item => {
					type.push({
						key: item.petTypeId,
						name: item.petTypeName,
					})
				})
				type.map(item => {
					this.petTypePick.petTypeList[0].push(item.name)
				})
				this.petType = type
			})
		},
	},
}
</script>

<style lang="scss">
.edit-pet {
	padding: 30rpx;
	background-color: #f4f4f5;

	.u-button--info {
		width: 300rpx !important;
		margin-right: 30rpx !important;
	}

	.video-item {
		width: 300rpx;
		height: 200rpx;

		video {
			border-radius: 10rpx;
		}
	}

	.msg-container {
		background-color: #fff;
		padding: 20rpx;
		border-radius: 20rpx;
		box-sizing: border-box;
		margin-bottom: 30rpx;
	}

	.img {
		margin: 20rpx 0;
	}

	.img-item-container {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.video-container {
		position: relative;
		display: inline-block;
	}

	.delete-btn {
		position: absolute;
		top: -2rpx;
		right: -18rpx;
		background-color: rgba(255, 255, 255, 0.8);
		border-radius: 50%;
		z-index: 10;
	}

	.u-upload__button {
		width: 200rpx !important;
		height: 70rpx !important;
	}
}
</style>