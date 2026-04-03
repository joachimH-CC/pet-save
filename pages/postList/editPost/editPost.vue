<template>
	<view class="pet-edit content">
		<u--form labelPosition="top" ref="formRef" :rules="rules" :model="form"
			:labelStyle="{fontSize:'28rpx',marginBottom:'10rpx'}" labelWidth="110">
			<u-form-item prop="title" label="标题:" borderBottom>
				<u-input border="none" placeholder="请输入标题" v-model="form.title"></u-input>
			</u-form-item>
			<u-form-item prop="content" label="内容:" borderBottom>
				<u--textarea border="none" v-model="form.content" maxlength="-1" height="400rpx"
					placeholder="请输入内容"></u--textarea>
			</u-form-item>
			<u-form-item label="发布类型:" borderBottom @click="postPick.show = true">
				<u-input border="none" placeholder="请选择发布的帖子类型" v-model="form.type"></u-input><u-icon slot="right"
					name="arrow-right"></u-icon>
				<u-picker @cancel="postPick.show = false" @confirm="confirmPostType" :show="postPick.show"
					:columns="postPick.postTypeList"></u-picker>
			</u-form-item>
			<!-- 添加标签 -->
			<!-- <u-form-item prop="postLabel" label="添加标签:" borderBottom>
				<u-input border="none" v-model="form.postLabel" @confirm="addLabel" placeholder="例如:#猫咪 #领养等等">
					<u--text text="#" slot="prefix" margin="0 3px 0 0" type="tips"></u--text></u-input>
			</u-form-item>
			<u-form-item>
				<view class="tag flex" v-if="tags.length">
					<u-tag v-for="(item,index) in tags" :key="index" plain :text="item" size="mini" closable
						@close="delTag(index)"></u-tag>
				</view>
			</u-form-item> -->
			<u-form-item label="添加图片:">
				<u-button @click="chooseImg" color="#eaeaeb" icon="plus"></u-button>
			</u-form-item>
			<view class="img" v-if="imgpath">
				<u-grid :border="false" col="3">
					<u-grid-item v-for="(path,index) in imgpath" :key="index">
						<u--image :showLoading="true" :src="path" width="100px" height="100px"></u--image>
					</u-grid-item>
				</u-grid>
			</view>
			<u-form-item>

				<view class="btn just-space-be">
					<u-button text="取消" @click="toCommunity"></u-button>
					<u-button style="width: 400rpx;" color="#6685ca" type="primary" text="发布"
						@click="handleSubmit"></u-button>
				</view>

			</u-form-item>
		</u--form>
	</view>
</template>

<script>
	import env from '@/utils/env.js';
	import {
		getToken
	} from '@/utils/auth.js';
	import {
		addPost,
		editPost,
		msPostDetail
	} from '../../../api/userApi/community';

	export default {
		data() {
			return {
				mode: "add",
				role: 2,
				form: {
					title: "",
					content: "",
					type: "",
					// postLabel: "",
					postFiles: []

				},
				rules: {
					title: [{
							required: true,
							message: '请输入标题',
							trigger: ['blur']
						},
						{
							max: 30,
							message: '请输入30位以内字符',
							trigger: ['blur']
						},

					],

					content: [{
						required: true,
						trigger: "blur",
						message: "请输入内容"
					}, ],
					type: [{
						required: true,
						trigger: ['change'],
						message: "请选择您发布的帖子类型"
					}],

				},
				//帖子类型
				postPick: {
					show: false,
					postTypeList: [
						//如果是救助者端才可以发布宠物救助
						['生活记录', '领养动态', '饲养经验']
					],

				},
				postTypeList: [{
						value: "生活记录",
						key: 0
					},
					{
						value: "领养动态",
						key: 1
					},
					{
						value: "饲养经验",
						key: 2
					},
					{
						value: "宠物救助",
						key: 3
					},
				],
				imgpath: [],
				tags: [],
				postId: undefined,
			};
		},
		onLoad(options) {
			// 获取数据
			if (options.postId) {
				this.mode = "edit"
				this.postId = options.postId
				this.getPostDetail(options.postId);
			}


		},
		onReady() {

			this.$refs.formRef.setRules(this.rules)
		},
		computed: {

			getRole() {
				this.role = this.$store.state.roleId
			},
			getPostType() {
				if (this.role == 101) this.postPick.postTypeList = [
					['生活记录', '领养动态', '饲养经验', '宠物救助']
				]
			}
		},
		methods: {
			getPostDetail(id) {
				msPostDetail(id).then(res => {
					console.log(res);
					if (res.data.postFiles.length > 0)
						res.data.postFiles.map(item => {
							this.imgpath.push(item.path)
						})
					const {
						title,
						content,
						type,
						postFiles
					} = res.data
					this.form.title = title
					this.form.content = content
					this.form.type = this.postTypeList.find(item => item.key == type).value
					if (postFiles.length > 0) this.form.postFiles = postFiles.map(item => {
						return {
							type: 0,
							display: 1,
							path: item.path,
						}
					})
				})

			},
			//提交
			handleSubmit() {
				this.$refs.formRef.validate().then(res => {
					let {
						type,
						...rest
					} = this.form
					const postType = this.postTypeList.find(item => item.value == type)
					type = postType.key
					console.log({
						type,
						...rest
					});
					switch (this.mode) {
						case "add":
							addPost({
								type,
								...rest
							}).then(res => {
								console.log(res);
								uni.showToast({
									icon: "none",
									title: "发布成功!",
								})
							})
							break;
						case "edit":
							editPost({
								postId: this.postId,
								type,
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
					if (this.postId) {
						uni.navigateBack()
					} else {
						uni.switchTab({
							url: "/pages/community/community"
						})
					}


				}).catch(errors => {
					console.log(errors);
					uni.$u.toast('校验失败')
				})
			},
			//将选择的帖子类型赋值给表单
			confirmPostType(val) {
				this.form.type = val.value[0]
				this.postPick.show = false
				this.$refs.formRef.validateField('type')
			},

			//返回宠物详情页
			toCommunity() {
				this.resetForm('formRef')
				uni.navigateBack()
			},
			//添加标签
			// addLabel(val) {
			// 	val = "#" + val
			// 	this.tags.push(val)
			// 	this.form.postLabel = undefined
			// },
			// delTag(index) {
			// 	this.tags.splice(index, 1)
			// 	console.log(this.tags);
			// },
			//重置数据
			resetForm(val) {
				this.$refs[val].resetFields()
				this.$refs[val].clearValidate()
			},
			//选择文件
			chooseImg() {
				uni.chooseImage({
					success: (res) => {
						console.log(res.tempFilePaths); //临时文件路径
						this.imgpath = res.tempFilePaths
						this.uploadFile(res.tempFilePaths)
					}
				})
			},
			//获取多张文件路径,实现上传,promise.all
			uploadFile(fileList) {
				console.log(fileList);
				this.form.postFiles = fileList.map(item => {
					return {
						type: 0,
						display: 1,
						path: item,
					}
				})
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
	.pet-edit {
		margin: 10rpx;

		.u-button--normal {}

		.u-tag--mini {}

		.btn {

			.u-button--info {
				width: 500rpx !important;
				margin-right: 30rpx !important;
			}
		}

	}
</style>