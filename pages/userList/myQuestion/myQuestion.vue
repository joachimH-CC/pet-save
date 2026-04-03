<template>
	<view class="question content">
		<!-- <view class="flex-end history">
			<u-button text="历史反馈" color="#f4f4f5" size="mini"></u-button>
		</view> -->
		<view class="question-container">
			<u--form :model="form" :labelStyle="{fontSize:'30rpx'}" labelWidth="70">
				<u-form-item>
					<u--text :margin="'6rpx 0 16rpx 0'" text="问题描述:" size="15" bold color="#7e7f86"></u--text>
					<u--textarea border="none" v-model="form.questionContent" maxlength="-1"
						placeholder="请输入描述您遇到的问题或建议,我们会尽快给您处理!"></u--textarea>
				</u-form-item>
				<u-form-item>
					<u-button text="提交" color="#6887cb" @click="confirmQuestion"></u-button>
				</u-form-item>
			</u--form>
		</view>

		<view class="common-question">
			<u--text :margin="'6rpx 0 16rpx 0'" text="常见问题" size="15" bold color="#7e7f86"></u--text>
			<u-collapse :border="false">
				<u-collapse-item title="如何申请领养宠物?" name="1">
					<text class="u-collapse-content">
						1.筛选动物： 根据你的需要条件（体型、性格、年龄）筛选心仪的宠物。

						2.提交申请： 填写详细的申请表，包括居住情况、养宠经验等。

						3.审核与面谈： 工作人员会审核你的申请，可能进行电话或当面访谈。

						4.见面互动： 安排你和心仪宠物见面，看彼此是否合适。

						5.家访： 部分机构可能会要求家访，以确保环境安全。

						6.签署协议并缴费： 完成领养协议，支付领养费（这是对机构救助成本的捐助）。

						7.接宠物回家： 准备妥当后，就可以迎接新成员了！
					</text>
				</u-collapse-item>
				<u-collapse-item title="为什么我的领养申请被拒绝了?" name="2">
					<text class="u-collapse-content">
						领养申请被拒绝可能包括多个方面的原因,您可以先问问自己几个问题

						1.时间： 你每天有足够的时间陪伴、散步和清理吗？

						2.经济： 你能负担食物、疫苗、绝育、日常用品以及突发疾病的医疗费用吗？

						3.空间： 你的居住环境允许养宠物吗？房东或家人同意吗？

						4.责任： 宠物是长达10-20年的承诺，你能负责它的一生吗？未来生活变化（如搬家、结婚、生子）你会如何安置它？
					</text>
				</u-collapse-item>
				<u-collapse-item title="领养需要宠物哪些条件?" name="3">
					<text class="u-collapse-content">
						当您准备去申请时，请确保您已经满足或准备好了以下核心几点：

						✅ 年满22周岁，有完全民事行为能力。

						✅ 有稳定的经济收入和住房（如果是租房，必须有房东许可证明）。

						✅ 所有家庭成员一致同意领养。

						✅ 承诺办理狗证（如需要）、科学喂养、不离不弃。

						✅ 承诺为宠物提供 终身 的照顾和关爱，包括生病年老时。

						✅ 同意接受绝育、免疫和驱虫的原则，并签署领养协议。

						✅ 愿意接受机构的审核、家访和回访。
					</text>
				</u-collapse-item>
				<u-collapse-item title="领养和购买宠物有什么区别？" name="4">
					<text class="u-collapse-content">
						领养是给收容所或救助中心里无家可归的动物一个第二次生命的机会，是一种慈善行为。通常费用较低（已含绝育、疫苗、驱虫等），并能缓解收容所的压力。购买则是从繁殖者或宠物店获得动物，需要选择信誉良好的商家以避免支持不良繁殖场</text>
				</u-collapse-item>
				<u-collapse-item title=" 领养费用包括什么？" name="5">
					<text class="u-collapse-content">
						领养费远低于实际成本，通常包括：

						兽医健康检查

						核心疫苗接种

						体内外驱虫

						绝育/绝育手术

						微型芯片植入（部分地区）

						有时还包括初步的培训或行为评估。
					</text>
				</u-collapse-item>
				<u-collapse-item title=" 如何帮助新宠物适应家庭？" name="6">
					<text class="u-collapse-content">
						1.保持耐心： 给它几天到几周的时间来适应新环境。

						2.准备安全空间： 为它准备一个安静、舒适的专属区域（如笼子、猫窝）。

						3.逐步介绍： 慢慢地将它介绍给家人和其他宠物。

						4.建立规律： 固定的喂食、散步和玩耍时间会让它更有安全感。

						5.正面引导： 使用奖励和鼓励的方式进行训练，避免惩罚。
					</text>
				</u-collapse-item>
			</u-collapse>
		</view>
		<view class="history-question">
			<u--text :margin="'6rpx 0 16rpx 0'" text="历史反馈" size="15" bold color="#7e7f86"></u--text>
			<u-collapse>
				<u-collapse-item :title="item.questionContent" :key="index" :name="index"
					v-for="(item,index) in historyInfo">
					<view v-if="item.answers.length>0" :key="i" v-for="(answer,i) in item.answers">
						<u--text :margin="'6rpx 0 16rpx 0'" text="官方回复:" size="12" bold color="#7e7f86"></u--text>
						<text class="u-collapse-content">{{answer.answerContent}}</text>
						<u--text :margin="'10rpx 0 6rpx 0'" :text="answer.createTime" size="11"
							color="#7e7f86"></u--text>
					</view>
					<view v-if="item.answers.length==0">
						<u--text :margin="'6rpx 0 16rpx 0'" text="请耐心等待,很快就能得到回复^_^" size="12" bold
							color="#7e7f86"></u--text>
					</view>
				</u-collapse-item>
			</u-collapse>
			<view v-if="historyInfo.length==0">
				<u-empty mode="list" text="还没有反馈..."></u-empty>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		historyFeedback,
		sendFeedback
	} from '@/api/commonApi/person';

	export default {
		data() {
			return {
				form: {
					questionContent: "",
				},

				historyInfo: []
			};
		},
		onLoad() {
			this.getHistoryFeedback()
		},
		methods: {
			getHistoryFeedback() {
				historyFeedback().then(res => {
					this.historyInfo = res.data
					console.log(res);
				})
			},
			confirmQuestion() {
				if (!this.form.questionContent) {
					return uni.showToast({
						title: "请输入问题",
						icon: "none",
					})
				}
				sendFeedback(this.form).then(res => {
					console.log(res);
					uni.showToast({
						icon: "none",
						title: "问题已提交,请耐心等待回复!"
					})
					this.form.questionContent = ""
					this.getHistoryFeedback()
				})
			}
		}
	}
</script>

<style lang="scss">
	.question {
		background-color: #f4f4f5;

		.history {

			.u-button--mini {
				border: 2rpx solid #6887cb !important;
				color: #6887cb !important;
			}

			.u-button {
				margin: 10rpx;
				width: 200rpx !important;

			}
		}

		.question-container {
			padding: 20rpx;
			box-sizing: border-box;
			border-radius: 20rpx;
			background-color: #fff;



			.u-button {
				margin: 20rpx 0;
			}

			.u-textarea {
				textarea {
					font-size: 24rpx !important;
				}

				border: 3rpx solid #c2c2c3;
			}
		}

		.common-question {
			margin-top: 30rpx;
			padding: 20rpx;
			box-sizing: border-box;
			border-radius: 20rpx;
			background-color: #fff;

			.u-cell__title-text {
				font-size: 28rpx
			}
		}

		.history-question {
			margin-top: 30rpx;
			padding: 20rpx;
			box-sizing: border-box;
			border-radius: 20rpx;
			background-color: #fff;

			.item-value {
				font-size: 20rpx;
			}

			.u-tag {
				width: 100rpx;
			}

			.u-cell__title-text {
				font-size: 26rpx;
				color: #72727f;
			}
		}
	}
</style>