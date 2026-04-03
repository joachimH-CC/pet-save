<template>
	<view class="login">
		<view class="title">
			<view style="margin: 10rpx 0;">欢迎登录!</view>
			<view class="tip">首次登录即自动注册</view>
		</view>
		<u--form :model="loginForm" ref="formRef" :rules="rules">
			<u-form-item borderBottom prop="username">
				<u-input prefixIcon="phone-fill" border="none" v-model="loginForm.username"
					placeholder="请输入电话号码"></u-input>
			</u-form-item>
			<u-row justify="space-between">
				<u-form-item borderBottom>
					<u-input prefixIcon="lock-fill" border="none" v-model="loginForm.code"
						placeholder="请输入验证码"></u-input>
				</u-form-item>
				<u-form-item>
					<u-button type="info" text="获取验证码" @click="getCode"></u-button>
				</u-form-item>
			</u-row>

			<u-form-item>
				<view class="role">
					<u-row justify="space-between">
						<u-button icon="account-fill" :color="selectedRole === 2 ? '#ccd1d9' : '#fff'" text=" 普通用户"
							@click="handleRole(2)">
						</u-button>
						<u-button :color="selectedRole === 101 ? '#ccd1d9' : '#fff'" icon="plus-circle-fill" text="救助者"
							@click="handleRole(101)"></u-button>
					</u-row>
				</view>
			</u-form-item>
			<u-form-item>
				<u-button color="#6685ca" type="primary" text="登录" shape='circle' @click="handleLogin"></u-button>
			</u-form-item>
		</u--form>
	</view>
</template>

<script>
	import {
		setToken
	} from '@/utils/auth';
	import {
		login
	} from '@/api/commonApi/common.js';
	export default {
		data() {
			return {
				selectedRole: 2,
				loginForm: {
					username: undefined,
					code: 'abcd',
					roleIds: [2],
				},
				rules: {
					username: [{
						required: true,
						trigger: "blur",
						message: "请输入您的电话号码"
					}, ],

					code: [{
						required: true,
						trigger: ['blur'],
						message: "请输入验证码"
					}, ],
					roleIds: [{
						required: true,
						trigger: ['change'],
						message: "请选择角色"
					}],
				},
			};
		},
		onReady() {
			this.$refs.formRef.setRules(this.rules)
		},
		methods: {
			handleLogin() {
				console.log(this.loginForm);
				this.$refs.formRef.validate().then(res => {
					login(this.loginForm).then(res => {
						setToken(res.token)
						uni.showToast({
							title: res.msg,
							duration: 2000
						})
						this.$store.commit('setRole', this.loginForm.roleIds[0]);
						uni.switchTab({
							url: "/pages/index/index"
						})
					}).catch(err => {
						uni.showToast({
							title: err.msg,
							icon: "none",
							duration: 2000
						})
					})
				}).catch(errors => {
					console.log(errors);
					uni.$u.toast('校验失败')
				})



			},
			handleRole(roleType) {
				this.selectedRole = roleType;
				this.loginForm.roleIds = [roleType]
				this.$refs.formRef.validateField('roleIds')
				// 若需要额外逻辑（如提交选中结果），可在此补充
			},
			getCode() {

			}
		}
	}
</script>

<style lang="scss">
	.login {
		padding: 50rpx 56rpx;
		box-sizing: border-box;

		.u-form-item {
			margin: 10rpx 0;

			.role {
				.u-button {
					margin: 0 10rpx;
					border: 2rpx solid #dfdfdf !important;
				}

				.u-button__text {
					color: #000;
				}

			}





		}

		.u-icon__icon {
			color: #6685ca !important;
		}

		.u-button {
			margin: 0 10rpx;
		}

		.u-button.code-btn {
			width: 200rpx;
		}

		.u-button--normal.btn {
			background-color: #6685ca !important;
		}

		.u-form-item__body__right__message {
			margin: 0 !important;
		}

		.title {
			text-align: center;
			margin-bottom: 30rpx;
			font-size: 40rpx;
			font-weight: 600;
			color: #3b4e76;

			.tip {
				font-weight: 500;
				font-size: 28rpx;
				color: #a0a0a0;
			}
		}

	}
</style>