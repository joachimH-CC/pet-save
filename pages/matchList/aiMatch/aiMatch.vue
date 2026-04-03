<template>
	<view class="content match">
		<view class="tip flex-jus-center">
			<u-icon name="clock-fill"></u-icon><span>预计耗时: 5分00秒</span>
		</view>
		<view class="match-container">
			<view class="test-item" v-for="item in testList" :key="item.topicId">
				<u--text :margin="'0 0 10rpx 0'" :text=" item.stem" size="15"></u--text>
				<!-- 多选 -->
				<u-checkbox-group v-if="item.type == 1" placement="column" size="mini"
					v-model="answersMap[item.topicId]" @change="handleOptionChange(item.topicId)">
					<u-checkbox activeColor="#6685ca" labelSize="24rpx" group
						v-for="(op, index) in optionsToArray(item.options)" :key="index"
						:label="op.option + '.' + op.value" :value="op.option" :name="op.option">
					</u-checkbox>
				</u-checkbox-group>

				<!-- 单选/判断 -->
				<u-radio-group v-else v-model="answersMap[item.topicId]" @change="handleOptionChange(item.topicId)"
					size="mini" placement="column">
					<u-radio activeColor="#6685ca" labelSize="24rpx" v-for="(op, index) in optionsToArray(item.options)"
						:key="index" :label="op.option + '.' + op.value" :value="op.option" :name="op.option">
					</u-radio>
				</u-radio-group>

			</view>

			<view class="just-space-be" style="margin-top: 30rpx;">
				<u-button text="取消" @click="toIndex"></u-button>
				<u-button color="#6685ca" type="primary" text="匹配" @click="handleSubmit"></u-button>
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
				testId: undefined
			};
		},
		onLoad() {
			this.getTestDetail()

		},
		methods: {
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

				console.log('testAnswers:', this.testAnswers);
				this.submitAnswer()

			},
			//提交答案
			submitAnswer() {
				const data = {
					knowledgeId: 22,
					testAnswers: this.testAnswers,
					testId: this.testId
				}
				testAnswer(data).then(res => {
					console.log(res.data);
					this.toMatch()
				})
			},
			optionsToArray(val) {
				try {
					return JSON.parse(val)
				} catch (e) {
					return [];
				}
			},
			getTestDetail() {
				const id = 22
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
				})
			},
			handleOptionChange(topicId) {
				// 当选项发生改变时，answersMap 已经被 v-model 更新
				console.log('changed', topicId, this.answersMap[topicId]);
			},
			toIndex() {
				// uni.navigateTo({
				// 	url: "/pages/matchList/matchPetList/matchPetList"
				// })
				uni.navigateTo({
					url: "/pages/index/index"
				})
			},
			toMatch() {
				uni.navigateTo({
					url: "/pages/matchList/matchPetList/matchPetList"
				})
			}
		}
	}
</script>

<style lang="scss">
	.match {
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

		.u-radio {
			height: 70rpx;
		}


		.match-container {
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