<template>
	<view class="content identify">
		<view class="identify-container">
			<u--form labelPosition="left" ref="formRef" :rules="rules" :model="form"
				:labelStyle="{fontSize:'28rpx',marginBottom:'10rpx'}" labelWidth="74">
				<u-form-item borderBottom prop="realName">
					<u-input border="none" v-model="form.realName" placeholder=" 请输入与证件一致的姓名"></u-input>
				</u-form-item>
				<u-form-item borderBottom prop="idNumber">
					<u-input border="none" v-model="form.idNumber" placeholder=" 请输入身份证号"></u-input>
				</u-form-item>
				<u-form-item>
					<u-row justify="space-between">
						<view @click="upCardFront" class="card-item">
							<image v-if="form.idCardFront" :src="form.idCardFront" mode="widthFix"></image>
							<image v-else src="../../../static/001.png" mode="widthFix"></image>
							<u--text :margin="'16rpx 0 0 0'" text="点击上传身份证正面照片" bold size="11"
								color="#838383"></u--text>
						</view>
						<view @click="upCardBack" class="card-item">
							<image v-if="form.idCardBack" :src="form.idCardBack" mode="widthFix"></image>
							<image v-else src="../../../static/002.png" mode="widthFix"></image>
							<u--text :margin="'16rpx 0 0 0'" text="点击上传身份证反面照片" bold size="11"
								color="#838383"></u--text>
						</view>
					</u-row>
				</u-form-item>
				<u-form-item>
					<view class="just-space-be">
						<u-button style="width: 400rpx;" color="#6685ca" type="primary" text="认证"
							@click="handleSubmit"></u-button>
					</view>

				</u-form-item>
			</u--form>
		</view>

	</view>
</template>

<script>
	import {
		getToken
	} from '../../../utils/auth';
	import env from '../../../utils/env';
	import {
		idCard
	} from '@/api/commonApi/person';
	export default {
		data() {
			return {
				form: {
					idCardFront: '',
					idCardBack: '',
					realName: '',
					idNumber: ''
				},
				rules: {
					realName: [{
						required: true,
						message: '请输入您的姓名',
						trigger: ['blur']
					}, ],
					idNumber: [{
						required: true,
						trigger: "blur",
						message: "请输入您的身份证号码"
					}, ],
					idCardFront: [{
						required: true,
						trigger: ['change'],
						message: "请上传身份证正面"
					}],
					idCardBack: [{
						required: true,
						trigger: ['change'],
						message: "请上传身份证背面"

					}],
				},
			};
		},

		onReady() {
			this.$refs.formRef.setRules(this.rules)

		},
		methods: {
			handleSubmit() {
				console.log(this.form);
				if (!this.form.idCardBack || !this.form.idCardFront) return uni.showToast({
					icon: "none",
					title: "请上传身份证照片"
				})
				this.$refs.formRef.validate().then(res => {
					console.log(res);
					idCard(this.form).then(res => {
						console.log(res);
						uni.showToast({
							icon: "none",
							title: res.msg
						})
						uni.switchTab({
							url: "/pages/user/user"
						})
					})

				}).then(() => {

				}).catch(errors => {
					uni.showToast({
						icon: "none",
						title: errors.msg
					})
				})
			},

			upCardFront() {
				uni.chooseImage({
					count: 1,
					success: (res) => {
						this.form.idCardFront = res.tempFilePaths[0]
						this.$refs.formRef.validateField('idCardFront')
						this.uploadFile(res.tempFilePaths)
						console.log(this.form.idCardFront);
					}
				})

			},
			upCardBack() {
				uni.chooseImage({
					count: 1,
					success: (res) => {
						console.log(res);
						this.form.idCardBack = res.tempFilePaths[0]
						this.$refs.formRef.validateField('idCardBack')
						this.uploadFile(res.tempFilePaths)
					}
				})
			},
			//获取多张文件路径,实现上传,promise.all
			uploadFile(fileList) {
				console.log(fileList);
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

			}

		}
	}
</script>

<style lang="scss">
	.identify {
		height: 100vh;
		background-color: #f4f4f5;

		.identify-container {
			background-color: #fff;
			padding: 20rpx 40rpx;
			border-radius: 20rpx;
			box-sizing: border-box;

			.card-item {
				width: 250rpx;
				height: 150rpx;
				margin: 20rpx 0;
			}

			.u-upload {
				border-radius: 20rpx;
			}

			.u-form-item__body__left__content__label {
				background-color: #6685ca;
				color: #fff;
				padding: 10rpx;
				border-radius: 10rpx;
			}

			.u-form-item__body__right__message {
				margin: 20rpx !important;
			}

			image {
				width: 250rpx;
				height: 150rpx !important;
			}
		}
	}
</style>