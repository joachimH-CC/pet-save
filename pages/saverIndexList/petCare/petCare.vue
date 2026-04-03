<template>
	<view class="pet-care content">
		<view class="pet-care-container">
			<view class="flex-end">
				<u-button radius="20rpx" @click="addRecord" size="small" icon="plus" :plain="true"
					text="添加记录"></u-button>
			</view>

			<common-scroll-list :items="nurseList" :pageSize="8" height="calc(100vh - 160rpx)" keyField="nurseId">
				<template v-slot="{ item, index }">
					<!-- 护理类型:喂食,换药,注射疫苗 -->
					<view class="care-item">
						<view class="just-space-be">
							<u--text :margin="'10rpx'" :text="item.nurseTypeName" size="13" bold
								color="#6887cb"></u--text>
							<u--text :margin="' 10rpx 0 10rpx 150rpx'" :text="item.createTime" size="12"
								color="#494949"></u--text>
						</view>
						<u--text :margin="'10rpx 10rpx 20rpx 10rpx'" :text="item.content" size="13"
							color="#494949"></u--text>
						<view class="just-space-be">
							<u--text prefixIcon="account" :text="'记录人: ' + item.nickName" size="11"
								color="#494949"></u--text>
							<u-icon name="trash-fill" @click="delRecord(item.nurseId)"></u-icon>
						</view>
					</view>
				</template>
			</common-scroll-list>
			<view v-if="nurseList.length == 0">
				<u-empty mode="data" text="还没有护理记录^_^"></u-empty>
			</view>
		</view>
		<!-- 修改健康状况:暂且不用 -->
		<u-popup :show="healthEditPop.show" mode="top" @close="closeHealthEditPop" :round="10" closeable>
			<view class="edit-health">
				<u-form-item label="疫苗次数:" labelWidth="80">
					<!-- <u-number-box bgColor="#6887cb" color="#fff" iconStyle="color: #fff" v-model="healthInfo.vaccineNum"
						@change="vaccineCountChange" :min="0" :max="99"></u-number-box> -->
					<u-number-box v-model="healthInfo.vaccineNum" @change="vaccineCountChange" :min="0" :max="99">
						<view slot="minus" class="minus">
							<u-icon name="minus" size="12"></u-icon>
						</view>
						<text slot="input" style="width: 50px;text-align: center;"
							class="input">{{ healthInfo.vaccineNum }}</text>
						<view slot="plus" class="plus">
							<u-icon name="plus" color="#FFFFFF" size="12"></u-icon>
						</view>
					</u-number-box>
				</u-form-item>
				<u-form-item label="驱虫次数:" labelWidth="80">
					<!-- <u-number-box bgColor="#6887cb" color="#fff" iconStyle="color: #fff" v-model="healthInfo.dewormNum"
						@change="driveCountChange" :min="0" :max="99"></u-number-box> -->
					<u-number-box v-model="healthInfo.dewormNum" @change="driveCountChange" :min="0" :max="99">
						<view slot="minus" class="minus">
							<u-icon name="minus" size="12"></u-icon>
						</view>
						<text slot="input" style="width: 50px;text-align: center;"
							class="input">{{ healthInfo.dewormNum }}</text>
						<view slot="plus" class="plus">
							<u-icon name="plus" color="#FFFFFF" size="12"></u-icon>
						</view>
					</u-number-box>
				</u-form-item>
				<u-form-item label="是否绝育:" labelWidth="80" class="switch-item">
					<u-switch v-model="healthInfo.sterilizationStatus" @change="sterilizationChange"
						activeColor="#6887cb" size="20"></u-switch>
				</u-form-item>
			</view>
		</u-popup>
		<!-- 添加护理jlu -->
		<u-popup :show="recordPop.show" mode="bottom" @close="closePop" :round="10" closeable>
			<view class="add-record">
				<u--form labelPosition="top" :rules="recordPop.rules" ref="formRef" :model="recordPop.form"
					:labelStyle="{ fontSize: '28rpx', marginBottom: '10rpx' }" labelWidth="110">
					<u-form-item prop="nurseType" label="护理类型:" borderBottom>
						<u-radio-group v-model="recordPop.form.nurseType" placement="row" size='mini'>
							<u-radio labelSize="26rpx" v-for="item in nurseTypeList" :customStyle="{ marginRight: '8px' }"
								:key="item.key" :label="item.value" :name="item.key">
							</u-radio>
						</u-radio-group>
					</u-form-item>
					<u-form-item prop="content" label="护理内容:" borderBottom>
						<u--textarea border="none" v-model="recordPop.form.content" maxlength="-1"
							placeholder="请输入护理内容"></u--textarea>
					</u-form-item>
					<u-form-item>
						<u-button color="#6685ca" type="primary" text="确定" @click="handleSubmit"></u-button>
					</u-form-item>
				</u--form>
			</view>

		</u-popup>
	</view>
</template>

<script>
import {
	addNurse,
	delNurse,
	petNurseList
} from '../../../api/rescuerApi/petNurse';
import CommonScrollList from '@/components/CommonScrollList.vue';
export default {
	components: {
		CommonScrollList
	},
	data() {
		return {
			recordPop: {
				show: false,
				form: {
					nurseType: '',
					content: '',
				},
				rules: {
					nurseType: [{
						required: true,
						trigger: "blur",
						message: "请选择护理类型"
					},],
					content: [{
						required: true,
						trigger: ['blur'],
						message: "请输入护理内容"
					},],
				},

			},
			petId: undefined,
			nurseList: [],
			nurseTypeList: undefined,
			// 健康修改弹出框相关数据
			healthEditPop: {
				show: false
			},
			healthInfo: {
				vaccineNum: 0, // 疫苗次数
				dewormNum: 0, // 驱虫次数
				sterilizationStatus: false // 是否绝育
			}
		};
	},

	onLoad(options) {
		// 获取数据

		//this.mode = "edit"
		this.petId = options.petId
		this.getNurseList(options.petId);


	},
	computed: {
		getNurseType() {
			this.nurseTypeList = this.$store.state.nurseType
		},
	},
	methods: {
		addRecord() {
			this.recordPop.show = true
		},
		delRecord(id) {
			uni.showModal({
				title: '提示',
				content: "是否确定删除记录",
				success: ({
					confirm
				}) => {
					if (confirm) {
						delNurse(id).then(res => {
							console.log(res);
							uni.showToast({
								title: "删除成功!",
								icon: "none"
							})
							this.getNurseList(this.petId)
						})
					}
				}
			})
		},
		handleSubmit() {
			const {
				nurseType,
				content
			} = this.recordPop.form
			addNurse({
				petId: this.petId,
				nurseType,
				content
			}).then(res => {
				console.log(res);
				uni.showToast({
					icon: "none",
					title: "添加成功!"
				})
				this.recordPop.show = false

			})
			this.getNurseList(this.petId)
		},
		getNurseList(id) {
			petNurseList(id).then(res => {
				this.nurseList = res.data.map(item => {
					return {
						...item,
						nurseTypeName: this.getPetNurseType(item.nurseType)
					}
				})
				console.log(this.nurseList);
			})
		},
		getPetNurseType(val) {
			const type = this.nurseTypeList.find(item => item.key == val)
			return type.value
		},
		closePop() {
			this.recordPop.show = false
			this.resetForm('formRef')
		},
		//重置数据
		resetForm(val) {
			this.$refs[val].resetFields()
			this.$refs[val].clearValidate()
		},
		modifyHealth() {
			// 这里可以根据实际情况从后端获取当前宠物的健康信息
			// 现在先使用默认值
			this.healthEditPop.show = true
		},
		// 添加新的方法来处理健康情况修改弹出框
		closeHealthEditPop() {
			this.healthEditPop.show = false
		},
		vaccineCountChange(value) {
			this.healthInfo.vaccineNum = value
		},
		driveCountChange(value) {
			this.healthInfo.dewormNum = value
		},
		sterilizationChange(value) {
			this.healthInfo.sterilizationStatus = value
		},
		saveHealthInfo() {
			// 这里应该调用 API 保存健康信息到后端
			console.log('保存健康信息:', this.healthInfo)

			// 模拟保存成功
			uni.showToast({
				icon: "none",
				title: "保存成功!"
			})

			// 关闭弹出框
			this.healthEditPop.show = false
		},
	}
}
</script>

<style lang="scss">
.pet-care {
	height: 95.5vh;
	background-color: #f4f4f5;

	.pet-care-container {
		.u-button {
			margin: 10rpx 0;
			width: 300rpx;

			.u-icon__icon {
				color: #6887cb;
				font-weight: 600;
			}

			.u-button__text {
				color: #6887cb;
				font-weight: 600;

			}
		}



		.care-item {
			margin-bottom: 30rpx;
			padding: 20rpx;
			border-radius: 20rpx;
			background-color: #fff;

			.u-icon__icon {
				color: #6887cb !important;
				font-weight: 600;
			}
		}
	}

	.add-record {
		padding: 30rpx;
	}

	.edit-health {
		padding: 10rpx 60rpx;
		background-color: #fff;

		.minus {
			width: 22px;
			height: 22px;
			border-width: 1px;
			border-color: #E6E6E6;
			border-style: solid;
			border-top-left-radius: 100px;
			border-top-right-radius: 100px;
			border-bottom-left-radius: 100px;
			border-bottom-right-radius: 100px;
			@include flex;
			justify-content: center;
			align-items: center;
		}

		.input {
			padding: 0 10px;
		}

		.plus {
			width: 22px;
			height: 22px;
			background-color: #6887cb;
			border-radius: 50%;
			/* #ifndef APP-NVUE */
			display: flex;
			/* #endif */
			justify-content: center;
			align-items: center;
		}

		.u-form-item {
			margin-bottom: 30rpx;
			border-bottom: 1rpx solid #f0f0f0;
			padding-bottom: 20rpx;
		}

		.switch-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.pop-btn-group {
			display: flex;
			justify-content: center;
			margin-top: 40rpx;
			padding-top: 20rpx;
			border-top: 1rpx solid #f0f0f0;
		}

		.u-number-box {
			width: 200rpx;
		}
	}


}
</style>