<template>
	<view class="visit-record">
		<view class="visit-record-container">
			<u--form labelPosition="top" :rules="rules" ref="formRef" :model="form"
				:labelStyle="{ fontSize: '28rpx', marginBottom: '10rpx' }" labelWidth="110">
				<u-form-item prop="returnTime" label="回访时间:" borderBottom @click="openVisitPicker">
					<u--input v-model="form.returnTime" disabled disabledColor="#ffffff" placeholder="请选择回访时间"
						border="none"></u--input>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>
				<u-form-item prop="method" label="回访方式:" borderBottom>
					<u-radio-group v-model="form.method" placement="row">
						<u-radio labelSize="26rpx" :customStyle="{ marginRight: '8px' }" key="0" label="线下" name="0">
						</u-radio>
						<u-radio labelSize="26rpx" :customStyle="{ marginRight: '8px' }" key="1" label="线上" name="1">
						</u-radio>
					</u-radio-group>
				</u-form-item>
				<u-form-item prop="petCondition" label="宠物状况:" borderBottom>
					<u--textarea border="none" v-model="form.petCondition" maxlength="-1"
						placeholder="请输入宠物的适应情况"></u--textarea>
				</u-form-item>
				<u-form-item prop="feedback" label="领养人反馈:" borderBottom>
					<u--textarea border="none" v-model="form.feedback" maxlength="-1"
						placeholder="请输入领养人反馈"></u--textarea>
				</u-form-item>
				<u-form-item prop="returnRemark" label="回访建议:" borderBottom>
					<u--textarea border="none" v-model="form.returnRemark" maxlength="-1"
						placeholder="请输入您的回访建议"></u--textarea>
				</u-form-item>
				<!--  图片与视频-->
				<view class="msg-container">
					<u--text :margin="'6rpx 0 6rpx 0'" text="图片与视频" size="13" color="#000"></u--text>
					<u-form-item>
						<u--text :margin="'10rpx 0'" text="请上传宠物图片" size="12" color="#c0c7d9"></u--text>
						<u-button @click="chooseImg" color="#eaeaeb" icon="plus"></u-button>
						<view class="img" v-if="fileListImg && fileListImg.length > 0">
							<u-grid :border="false" col="3">
								<u-grid-item v-for="(path, index) in fileListImg" :key="index"
									class="img-item-container">
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
				<u-form-item>
					<u-button style="width: 400rpx;" color="#6685ca" type="primary" text="提交"
						@click="handleSubmit"></u-button>
				</u-form-item>
			</u--form>
		</view>
		<u-datetime-picker :minDate="minDate" :show="showVisit" :value="form.visitTime" mode="date" closeOnClickOverlay
			@confirm="confirmVisitTime" @cancel="showVisit = false;"></u-datetime-picker>
	</view>
</template>

<script>
	import {
		addPetVisit,
		editPetVisit
	} from '../../../api/rescuerApi/returnRecord';
	import {
		getToken
	} from '../../../utils/auth';
	import env from '@/utils/env.js';
	export default {
		data() {
			return {
				mode: 'add',
				showVisit: false,
				form: {
					applyId: '',
					returnVisitId: '',
					returnTime: '',
					method: '',
					petCondition: '',
					feedback: '',
					returnRemark: '',
					visitFiles: []
				},
				rules: {
					returnTime: [{
						required: true,
						trigger: "change",
						message: "请选择回访时间"
					}, ],
					method: [{
						required: true,
						trigger: ['blur'],
						message: "请输入回访方式"
					}, ],

					petCondition: [{
						required: true,
						trigger: ['blur'],
						message: "请输入宠物宠物状况"
					}, ],
					feedback: [{
						required: true,
						trigger: "blur",
						message: "请输入领养人反馈"
					}, ],
					returnRemark: [{
						required: true,
						trigger: "blur",
						message: "请输入您的回访建议"
					}, ],

				},
				fileListImg: [],
				fileListV: [],
				minDate: new Date().getTime(), //获取最小时间
			};
		},
		onLoad(options) {
			console.log(options);
			// 获取数据

			if (options.data) {
				const data = JSON.parse(decodeURIComponent(options.data));
				console.log(data);
				this.mode = "edit"
				this.form = {
					...data
				}
				data.returnVisitFiles?.forEach(item => {
					if (item.type == 0) this.fileListImg.push({
						display: 2,
						...item
					})
					if (item.type == 1) this.fileListV.push({
						display: 2,
						...item
					})
				})
				this.form.visitFiles = []
			}
			this.form.applyId = options.applyId
		},
		onReady() {
			this.$refs.formRef.setRules(this.rules)
		},

		methods: {
			openVisitPicker() {
				this.showVisit = true
			},
			confirmVisitTime(val) {
				const visitDate = new Date(val.value)
				this.form.returnTime = this.formatterTime(visitDate)
				this.showVisit = false
			},
			// 格式化时间"yyyy-MM-dd HH:mm:ss"
			formatterTime(time) {
				let year = time.getFullYear()
				let month = time.getMonth() + 1
				let day = time.getDate()
				month = month < 10 ? '0' + month : month
				day = day < 10 ? '0' + day : day
				let hour = time.getHours()
				let minute = time.getMinutes()
				let second = time.getSeconds()
				hour = hour < 10 ? '0' + hour : hour
				minute = minute < 10 ? '0' + minute : minute
				second = second < 10 ? '0' + second : second
				return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
			},
			//重置数据
			resetForm(val) {
				this.$refs[val].resetFields()
				this.$refs[val].clearValidate()
			},
			// 删除图片
			deleteImage(index) {
				this.fileListImg.splice(index, 1);
			},
			// 删除视频
			deleteVideo() {
				this.fileListV = [];
			},
			handleSubmit() {

				this.$refs.formRef.validate().then(res => {
					let {
						returnVisitId,
						visitFiles,
						...rest
					} = this.form
					visitFiles = [...this.fileListImg,
						...this.fileListV
					]
					console.log({
						visitFiles,
						...rest
					});
					switch (this.mode) {
						case "add":
							addPetVisit({
								visitFiles,
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
							editPetVisit({
								returnVisitId,
								visitFiles,
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
					uni.navigateBack()
				}).catch(errors => {
					uni.$u.toast('请输入宠物信息!')
				})

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
							display: 2,
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
								display: 2,
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
		}
	}
</script>

<style lang="scss">
	.visit-record {
		padding: 30rpx;

		.video-item {
			width: 300rpx;
			height: 200rpx;
			margin: 20rpx;

			video {
				border-radius: 10rpx;
			}
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
	}
</style>