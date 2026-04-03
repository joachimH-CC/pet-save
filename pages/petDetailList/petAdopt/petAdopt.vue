<template>
	<view class="pet-adopt content">
		<u--form labelPosition="top" ref="formRef" :rules="rules" :model="form"
			:labelStyle="{fontSize:'28rpx',marginBottom:'10rpx'}" labelWidth="110">
			<u-form-item prop="sex" label="您的性别:" borderBottom>
				<u-radio-group size="24rpx" v-model="form.sex" placement="row">
					<u-radio labelSize="26rpx" :customStyle="{marginRight: '8px'}" key="0" label="男" name="0">
					</u-radio>
					<u-radio labelSize="26rpx" :customStyle="{marginRight: '8px'}" key="1" label="女" name="1">
					</u-radio>
				</u-radio-group>
			</u-form-item>
			<u-form-item prop="phoneNumber" label="联系电话:" borderBottom>
				<u-input border="none" placeholder="请输入您的联系电话" v-model="form.phoneNumber"></u-input>
			</u-form-item>
			<u-form-item prop="address" label="居住地址:" borderBottom>
				<u-input border="none" placeholder="请输入您的居住地址" v-model="form.address"></u-input>
			</u-form-item>
			<u-form-item prop="marriageStatus" label="婚姻状态:" borderBottom @click="marryPick.show = true">
				<u-input border="none" placeholder="请选择您的工作状态" v-model="form.marriageStatus"></u-input><u-icon
					slot="right" name="arrow-right"></u-icon>
				<u-picker @cancel="marryPick.show = false" @confirm="confirmMarry" :show="marryPick.show"
					:columns="marryPick.marryList"></u-picker>
			</u-form-item>
			<u-form-item prop="workStatus" label="工作状态:" borderBottom @click="workPick.showWork = true">
				<u-input border="none" placeholder="请选择您的工作状态" v-model="form.workStatus"></u-input><u-icon slot="right"
					name="arrow-right"></u-icon>
				<u-picker @cancel="workPick.showWork = false" @confirm="confirmWork" :show="workPick.showWork"
					:columns="workPick.workList"></u-picker>
			</u-form-item>
			<u-form-item prop="houseType" label="住房类型:" borderBottom @click="housePick.showHouse = true">
				<u-input border="none" placeholder="请选择您的住房类型" v-model="form.houseType"></u-input><u-icon slot="right"
					name="arrow-right"></u-icon>
				<u-picker @cancel="housePick.showHouse = false" @confirm="confirmHouse" :show="housePick.showHouse"
					:columns="housePick.houseList"></u-picker>
			</u-form-item>
			<u-form-item prop="petNum" label="已有宠物数量:" borderBottom>
				<u-input border="none" placeholder="如果已有宠物,请输入宠物数量" v-model="form.petNum"></u-input>
			</u-form-item>
			<u-form-item prop="hasExp" label="是否有养宠经验:" borderBottom>
				<u-radio-group size="24rpx" v-model="form.hasExp" placement="row">
					<u-radio labelSize="26rpx" :customStyle="{marginRight: '8px'}" key="1" label="是" name="1">
					</u-radio>
					<u-radio labelSize="26rpx" :customStyle="{marginRight: '8px'}" key="0" label="否" name="0">
					</u-radio>

				</u-radio-group>
			</u-form-item>
			<u-form-item prop="reason" label="申请理由:" borderBottom>
				<u--textarea border="none" v-model="form.reason" placeholder="请输入申请理由"></u--textarea>
			</u-form-item>

			<view class="flex user-promise">
				<u-checkbox-group size="mini" v-model="adoptNeedKnown" placement="row">
					<u-checkbox :customStyle="{marginBottom: '8px'}" key="0" label=" " name="0">
					</u-checkbox>
				</u-checkbox-group>
				<span class="text">我确认已阅读并同意<span style="color:#e08e30;" @click="show=true">«领养须知»</span>
					></u--text>保证提供的消息真实有效,并承诺善待宠物.</span>
			</view>

			<u-form-item>
				<view class="just-space-be">
					<u-button text="取消" @click="toPetDetail"></u-button>
					<u-button style="width: 400rpx;" color="#6685ca" type="primary" text="提交申请"
						@click="handleSubmit"></u-button>
				</view>

			</u-form-item>
		</u--form>
		<u-popup :show="show" mode="center" @close="closePop" closeable>
			<view class="need-know">
				<h3> 在决定领养前，请务必确认您已了解并接受以下事实：</h3>
				<p>1. 终身承诺： 宠物的寿命可达10-20年。领养意味着您承诺负责它的一生，包括其间的生病、衰老、行为问题等。 </p>
				<p>2. 经济支出： 养宠涉及食物、玩具、日常用品、定期疫苗、驱虫、体检，以及不可预料的医疗费用（如绝育、急诊、手术等）。请确保您有稳定的经济能力承担这些开支。 </p>
				<p>3. 时间与精力： 宠物需要每日的喂养、清洁、陪伴、运动和训练。您需要为它付出足够的时间和精力。 </p>
				<p>4. 生活改变： 养宠可能会影响您的出行、度假、租房选择等生活方式。您需要提前做好规划（如寻找可靠的宠物寄养或朋友帮忙）。 </p>
				<p>5. 家庭支持： 确保您所有的家庭成员（包括伴侣、老人、孩子）都同意并欢迎新成员的到来，且无人对宠物毛发等过敏。 </p>
				<p>6. 合法合规： 您需遵守所在地关于养宠的法律法规，如办理狗证、使用牵引绳、及时清理宠物粪便等，做一位文明的负责任的主人。
				</p>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		aiApply,
		applyAdopt
	} from '../../../api/userApi/petDetail';
	export default {
		data() {
			return {
				show: false,
				form: {
					petId: '',
					sex: '',
					phoneNumber: '',
					address: '',
					workStatus: '',
					marriageStatus: '',
					houseType: '',
					petNum: '',
					hasExp: '',
					reason: ''
				},
				rules: {
					sex: [{
							required: true,
							message: '请选择您的性别',
							trigger: ['blur']
						},

					],
					phoneNumber: [{
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
					address: [{
							required: true,
							trigger: "blur",
							message: "请输入您的家庭地址"
						},
						{
							min: 3,
							max: 50,
							message: '请输入详细的家庭地址',
							trigger: 'blur'
						}
					],
					workStatus: [{
						required: true,
						trigger: ['blur', 'change'],
						message: "请选择您的工作状态"
					}, ],
					marriageStatus: [{
						required: true,
						trigger: ['blur', 'change'],
						message: "请选择您的婚姻状态"
					}, ],
					houseType: [{
						required: true,
						trigger: ['blur', 'change'],
						message: "请选择您的住房类型"
					}, ],
					petNum: [{
						required: true,
						trigger: "blur",
						message: '请输入已有宠物数量'
					}, {
						pattern: /^[0-9]\d*$/,
						trigger: "blur",
						message: '请输入不小于0的整数'
					}],
					hasExp: [{
						required: true,
						trigger: "blur",
						message: "请确认是否已有养宠经验"
					}],
					reason: [{
						required: true,
						trigger: "blur",
						message: "请输入您的领养原因"
					}, {
						max: 200,
						message: '请输入200个字符以内',
						trigger: 'blur'
					}],
				},
				workPick: {
					showWork: false,
					workList: [
						['在职', '自由职业', '学生', '待业', '退休']
					],
				},
				marryPick: {
					show: false,
					marryList: [
						['单身', '恋爱', '已婚']
					],
				},
				housePick: {
					showHouse: false,
					houseList: [
						["整租", '合租', '自有住房', '其他']
					]
				},
				//婚姻状态
				marryType: [{
					value: "单身",
					key: 0,
				}, {
					value: "恋爱",
					key: 1,
				}, {
					value: "已婚",
					key: 2,
				}],
				//住房类型
				petHouseType: [{
					value: "整租",
					key: 0,
				}, {
					value: "合租",
					key: 1,
				}, {
					value: "自有住房",
					key: 2,
				}, {
					value: "其他",
					key: 3,
				}, ],
				//工作状态
				petWorkStatus: [{
						value: "在职",
						key: 0,
					},
					{
						value: "自由职业",
						key: 1,
					},
					{
						value: "学生",
						key: 2,
					},
					{
						value: "待业",
						key: 3,
					},
					{
						value: "退休",
						key: 4,
					},
				],
				adoptNeedKnown: undefined,
			};
		},
		onLoad(options) {
			console.log('接收的参数：', options);
			this.form.petId = options.petId || 0
		},
		onReady() {
			this.$refs.formRef.setRules(this.rules)
		},
		methods: {
			handleSubmit() {
				if (this.adoptNeedKnown != 0) return uni.showToast({
					title: "请阅读领养须知!",
					icon: 'none',
					duration: 2000
				})
				this.$refs.formRef.validate().then(res => {
					let {
						workStatus,
						houseType,
						marriageStatus,
						...rest
					} = this.form
					const work = this.petWorkStatus.find(item => workStatus == item.value)
					const house = this.petHouseType.find(item => houseType == item.value)
					const marry = this.marryType.find(item => marriageStatus == item.value)

					workStatus = work.key
					houseType = house.key
					marriageStatus = marry.key
					console.log({
						workStatus,
						houseType,
						marriageStatus,
						...rest
					});
					const data = {
						workStatus,
						houseType,
						marriageStatus,
						...rest
					}
					applyAdopt(data).then(res => {
						console.log(res);
						uni.showToast({
							title: res.msg,
							icon: 'none',
							duration: 2000
						})
						this.handleAIApply(data)

					}).then(() => {
						uni.navigateBack();
					})


				}).catch(errors => {
					console.log(errors);
					uni.$u.toast('校验失败')
				})
			},
			handleAIApply(data) {
				aiApply(data).then(res => {
					console.log(res);
				})
			},
			//将选择的婚姻状态赋值给表单
			confirmMarry(val) {
				this.form.marriageStatus = val.value[0]
				this.marryPick.show = false
				this.$refs.formRef.validateField('marriageStatus')
			},
			//将选择的工作状态赋值给表单
			confirmWork(val) {
				this.form.workStatus = val.value[0]
				this.workPick.showWork = false
				this.$refs.formRef.validateField('workStatus')
			},
			//将选择的住房类型赋值给表单
			confirmHouse(val) {
				this.form.houseType = val.value[0]
				this.housePick.showHouse = false
				this.$refs.formRef.validateField('houseType')
			},
			closePop() {
				this.show = false
			},
			//返回宠物详情页
			toPetDetail() {
				this.resetForm('formRef')
				uni.navigateTo({
					url: "/pages/petDetailList/petDetail/petDetail"
				})
			},
			//重置数据
			resetForm(val) {
				this.$refs[val].resetFields()
				this.$refs[val].clearValidate()
			}

		},
	}
</script>

<style lang="scss">
	.pet-adopt {
		margin: 10rpx;

		.user-promise {
			padding: 10rpx;
			background-color: #fff8e6;

			.text {
				font-size: 24rpx;

				a {
					display: inline;
					color: #ff9c5d;
				}
			}
		}

		.need-know {
			width: 600rpx;
			margin: 50rpx;
			font-size: 28rpx
		}

		.u-button--info {
			width: 300rpx !important;
			margin-right: 30rpx !important;
		}
	}
</style>