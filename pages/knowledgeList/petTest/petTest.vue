<template>
	<view class="pet-test">
		<view class="tip flex-jus-center">
			<u-icon name="clock-fill"></u-icon><span>预计耗时: 5分钟</span>
		</view>
		<view class="pet-test-container">
			<view class="test-item" v-for="(item,i) in testList" :key="item.topicId">
				<u--text :margin="'0 0 10rpx 0'" :text="(i+1)+ '. ' + item.stem" size="15"></u--text>

				<!-- 多选 -->
				<u-checkbox-group v-if="item.type == 1" placement="column" size="mini"
					v-model="answersMap[item.topicId]" @change="handleOptionChange(item.topicId)">
					<u-checkbox activeColor="#6685ca" labelSize="24rpx" group :customStyle="optionStyle(item, op)"
						v-for="(op, index) in optionsToArray(item.options)" :key="index"
						:label="op.option + '.' + op.value" :value="op.option" :name="op.option">
					</u-checkbox>
				</u-checkbox-group>

				<!-- 单选/判断 -->
				<u-radio-group v-else v-model="answersMap[item.topicId]" @change="handleOptionChange(item.topicId)"
					size="mini" placement="column">
					<u-radio activeColor="#6685ca" labelSize="24rpx" :customStyle="optionStyle(item, op)"
						v-for="(op, index) in optionsToArray(item.options)" :key="index"
						:label="op.option + '.' + op.value" :value="op.option" :name="op.option">
					</u-radio>
				</u-radio-group>

				<!-- 提交后显示解析/答案/用户答案 -->
				<view v-if="showAnswers && (item.answer || item.analysis)">
					<u--text :margin="'0 0 10rpx 0'" :text="'正确答案: ' + (item.answer || '')" size="13"></u--text>
					<u--text :margin="'0 0 10rpx 0'" :text="'你的答案: ' + (item.userAnswer || '')" size="13"></u--text>
					<u--text :margin="'0 0 10rpx 0'" :text="'解析: ' + (item.analysis || '')" size="13"></u--text>
				</view>
			</view>

			<view class="just-space-be" style="margin-top: 30rpx;">
				<u-button text="返回" @click="toKnowledge"></u-button>
				<u-button v-if="!isSubmit" color="#6685ca" type="primary" text="提交" @click="handleSubmit"></u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		beginTest,
		testAnswer,
		testDetail
	} from '../../../api/userApi/knowlegde';

	export default {
		data() {
			return {
				testList: [],
				answersMap: {}, // 存每题的用户答案：单选字符串 / 多选数组
				testAnswers: [], // 提交时生成的数组
				showAnswers: false, // 是否显示答案与样式
				knowledgeId: undefined,
				testId: undefined,
				isSubmit: false,
			};
		},
		onLoad(options) {
			this.knowledgeId = options.knowledgeId || 0;
			this.beginTest(this.knowledgeId)
		},
		methods: {
			toKnowledge() {
				if (!this.isSubmit) {
					uni.showModal({
						title: '提示',
						content: "请先提交测试!",
						showCancel: false,
						success: (confirm) => {}
					})
					return
				} else {
					uni.navigateBack()
				}
			},
			getIcon(val) {
				if (val == 1) {
					return 'checkmark-circle-fill'
				} else {
					return "close-circle-fill"
				}
			},
			// 构造提交数据并判断结果，设置样式显示
			handleSubmit() {
				const answers = [];
				this.testList.forEach(item => {
					const raw = this.answersMap[item.topicId];
					let userAnswer = '';

					if (item.type == 1) {
						// 多选 stored as array -> join with comma
						userAnswer = Array.isArray(raw) ? raw.join(',') : (raw ? String(raw) : '');
					} else {
						// 单选/判断 stored as string
						userAnswer = raw || '';
					}

					// 计算结果： 2 未答，1 正确，0 错误
					let result = 2;
					const correct = (item.answer || '').toString();
					if (!userAnswer) {
						result = 2;
					} else {
						if (item.type == 1) {
							// 比较集合（无序）
							const userSet = new Set(userAnswer.split(',').map(s => s.trim()).filter(Boolean));
							const corrSet = new Set(correct.split(',').map(s => s.trim()).filter(Boolean));
							if (userSet.size === corrSet.size && [...userSet].every(v => corrSet.has(v))) {
								result = 1;
							} else {
								result = 0;
							}
						} else {
							result = userAnswer === correct ? 1 : 0;
						}
					}

					// 在 testList 上保存，便于显示
					this.$set(item, 'userAnswer', userAnswer);
					this.$set(item, 'result', result);

					answers.push({
						topicId: item.topicId,
						userAnswer: userAnswer
					});
				});

				this.testAnswers = answers;
				this.showAnswers = true;
				this.isSubmit = true
				console.log('testAnswers:', this.testAnswers);
				this.submitAnswer()

			},
			//提交答案
			submitAnswer() {
				const data = {
					knowledgeId: this.knowledgeId,
					testAnswers: this.testAnswers,
					testId: this.testId
				}
				testAnswer(data).then(res => {
					console.log(res.data);
					this.getTestDetail(this.knowledgeId)
				})
			},
			optionsToArray(val) {
				try {
					return JSON.parse(val)
				} catch (e) {
					return [];
				}
			},
			getTestDetail(id) {
				testDetail(id).then(res => {
					console.log(res);
					this.testList = res.data || [];
					this.testId = this.testList[0].testId
					// 初始化 answersMap 每题为空值或空数组
					this.testList.forEach(item => {
						if (item.type == 1) {
							// 多选
							this.$set(this.answersMap, item.topicId, []);
						} else {
							this.$set(this.answersMap, item.topicId, '');
						}
					});
					console.log(this.testList);
				})
			},
			beginTest(id) {
				beginTest({
					knowledgeId: id
				}).then(res => {
					console.log(res);
					this.getTestDetail(this.knowledgeId);
				})
			},
			handleOptionChange(topicId) {
				// 当选项发生改变时，answersMap 已经被 v-model 更新
				console.log('changed', topicId, this.answersMap[topicId]);
			},
			// 根据是否提交以及答案情况返回每个选项的样式对象
			optionStyle(item, op) {
				// 基础样式
				const base = {
					padding: '10rpx',
					boxSizing: 'border-box',
					border: '2rpx solid #e4e4e4',
					borderRadius: '10rpx',
					margin: '6rpx',
					transition: 'all 0.3s ease'
				};

				// 未提交答案时显示基础样式
				if (!this.showAnswers) return base;

				try {
					// 解析正确答案（处理多选情况）
					const correctAnswers = (item.answer || '').toString().split(',').map(s => s.trim());
					const correctSet = new Set(correctAnswers);

					// 获取用户的答案
					let userAnswer = (item.userAnswer || '').toString()
						.split(',')
						.map(s => s.trim())
						.filter(Boolean);

					// 判断该选项是否是用户选择的
					const isUserSelected = Array.isArray(userAnswer) ?
						userAnswer.includes(op.option) :
						(userAnswer === op.option);

					// 判断该选项是否是正确答案
					const isCorrectOption = correctSet.has(op.option);

					// 1. 正确选项 - 显示绿色
					if (isCorrectOption) {
						return Object.assign({}, base, {
							backgroundColor: '#e6f7ea',
							border: '2rpx solid #2ecc71',
							color: '#2ecc71',
							fontWeight: 'bold'
						});
					}

					// 2. 用户选择的错误选项 - 显示红色
					if (isUserSelected && !isCorrectOption) {
						return Object.assign({}, base, {
							backgroundColor: '#fdecea',
							border: '2rpx solid #e74c3c',
							color: '#e74c3c',
							fontWeight: 'bold'
						});
					}

					// 3. 未被用户选择的错误选项 - 显示默认样式但可以稍微变灰
					return Object.assign({}, base, {
						opacity: 0.7
					});

				} catch (error) {
					console.error('处理选项样式时出错:', error);
					return base;
				}
			},
		},
		onUnload() {
			// 用户退出页面时执行的逻辑
			if (!this.isSubmit) {
				this.handleSubmit()
			}

		}
	}
</script>

<style lang="scss">
	.pet-test {
		padding: 30rpx;
		height: 100%;
		background-color: #f8f9fa;

		.tip {
			margin: auto;
			font-size: 25rpx;
			color: #6685ca;

			.u-icon {
				margin: 0 8rpx;
			}

			.u-icon__icon {
				color: #6685ca !important;
			}
		}

		.pet-test-container {
			border-radius: 20rpx;
			box-shadow: 2rpx 2rpx 10rpx 6rpx #e4e4e4;
			padding: 20px;
			box-sizing: border-box;
			background-color: white;
			margin: 20rpx;

			.test-item {
				margin-bottom: 20rpx;
			}

			.u-button {
				width: 270rpx;
			}
		}
	}
</style>