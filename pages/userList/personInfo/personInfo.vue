<template>
	<view class="person-info content">
		<view class="person-info-container">
			<view class="flex avatar-container">
				<u--image :src="form.avatar" shape="circle" width="100rpx" height="100rpx"></u--image>
				<u-button color="#e9f1fb" text="点击更换头像" size="mini" @click="changeAvatar"></u-button>
			</view>
			<u--form labelPosition="top" ref="formRef" :model="form"
				:labelStyle="{ fontSize: '28rpx', marginBottom: '10rpx' }" labelWidth="110">
				<u-form-item prop="name" label="昵称:">
					<u-input v-model="form.nickName"></u-input>
				</u-form-item>
				<u-form-item prop="age" label="年龄:">
					<u-input v-model="form.age"></u-input>
				</u-form-item>
				<u-form-item prop="sex" label="性别:">
					<u-radio-group size="24rpx" v-model="form.sex" placement="row">
						<u-radio labelSize="26rpx" :customStyle="{ marginRight: '8px' }" key="0" label="男" name="0">
						</u-radio>
						<u-radio labelSize="26rpx" :customStyle="{ marginRight: '8px' }" key="1" label="女" name="1">
						</u-radio>
						<u-radio labelSize="26rpx" :customStyle="{ marginRight: '8px' }" key="2" label="未知" name="2">
						</u-radio>
					</u-radio-group>
				</u-form-item>
				<u-form-item prop="phoneNumber" label="联系电话:">
					<u-input v-model="form.phonenumber"></u-input>
				</u-form-item>
				<u-form-item prop="address" label="居住地址:">
					<u-input v-model="form.address"></u-input>
				</u-form-item>

				<u-form-item prop="introduction" label="个人简介:">
					<u--textarea v-model="form.introduction"></u--textarea>
				</u-form-item>
				<u-form-item>
					<view class="just-space-be">
						<u-button style="width: 400rpx;" color="#6685ca" type="primary" text="保存修改"
							@click="handleSubmit"></u-button>
					</view>

				</u-form-item>
			</u--form>
		</view>
	</view>
</template>

<script>
	import {
		editPersonInfo,
		personInfo
	} from '../../../api/commonApi/person';

	export default {
		data() {
			return {
				form: {
					avatar: "",
					nickName: '',
					phonenumber: '',
					address: '',
					sex: '',
					age: '',
					introduction: ''
				},
				rules: {
					nickName: [{
							required: true,
							message: '请输入您的姓名',
							trigger: ['blur']
						},
						{
							min: 2,
							max: 5,
							message: '请输入2-5位中文姓名',
							trigger: ['blur']
						},
						{
							pattern: /^[\u4e00-\u9fa5]{2,4}$/,
							message: "请输入正确的姓名",
							trigger: "blur"
						}
					],
					phonenumber: [{
							required: true,
							trigger: "blur",
							message: "请输入您的电话号码"
						},
						{
							pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
							message: "请输入正确的电话号码",
							trigger: "blur"
						}
					],
					sex: [{
						required: true,
						trigger: "blur",
						message: "请选择您的性别"
					}],
					age: [{
						required: true,
						trigger: "blur",
						message: "请输入您的年龄"
					}],
					address: [{
						required: true,
						trigger: "blur",
						message: "请输入您的居住地址"
					}],
					introduction: [{
						required: true,
						trigger: "blur",
						message: "请输入您的个人简介"
					}, {
						max: 50,
						message: '请输入50个字符以内',
						trigger: 'blur'
					}],
				},
			};
		},
		onReady() {
			this.$refs.formRef.setRules(this.rules)
			this.getPersonInfo()

		},
		methods: {
			handleSubmit() {
				console.log(this.form);
				this.$refs.formRef.validate().then(res => {
					editPersonInfo(this.form).then(res => {
						console.log(res);
						uni.showToast({
							title: "修改成功!",
							icon: "none"
						})
					})
				}).catch(errors => {
					uni.$u.toast('请输入所有信息!')
				})
			},
			//获取个人资料
			getPersonInfo() {
				personInfo().then(res => {
					console.log(res);
					this.form = {
						...res.data
					}
					if (res.data.age)
						this.form.age = `${res.data.age}`
				})
			},
			//重置数据
			resetForm(val) {
				this.$refs[val].resetFields()
				this.$refs[val].clearValidate()
			},
			//选择文件
			changeAvatar() {
				uni.chooseImage({
					count: 1,
					success: (res) => {
						this.form.avatar = res.tempFilePaths[0]
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

		},
	}
</script>

<style lang="scss">
	.person-info {
		height: 95.5vh;
		background-color: #f4f4f5;

		.person-info-container {
			padding: 30rpx;
			box-sizing: border-box;
			border-radius: 20rpx;
			background-color: #fff;

			.avatar-container {
				.u-button {
					margin: 50rpx 0 0 20rpx;
					width: 180rpx;

				}

				.u-icon__icon {
					color: #6685ca !important;
				}

				.u-button--mini {
					font-weight: 600;
					color: #6685ca !important;
				}

			}

			.u-input__content {
				height: 30rpx;

				input {
					font-size: 26rpx !important;
				}
			}
		}

		.u-button--info {
			width: 300rpx !important;
			margin-right: 30rpx !important;
		}
	}
</style>