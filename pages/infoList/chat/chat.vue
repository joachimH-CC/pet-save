<template>
	<view class="chat">
		<u-navbar :leftText="title" @leftClick="backInfo" :title="nickName" :autoBack="true">
			<template #left>
				<view class="flex top-nav">
					<u-icon name="arrow-leftward" color="#85a2e4"></u-icon>
					<u--text :margin="'6rpx'" bold text="返回" size="12" color="#6e90d7"></u--text>
				</view>
			</template>
			<template #center>
				<view class="flex">
					<u--text :margin="'6rpx'" bold :text="nickName" size="13" color="#6e90d7"></u--text>
				</view>
			</template>
		</u-navbar>
		<view class="chat-container">
			<!-- 聊天消息区域 -->
			<scroll-view class="chat-scroll" :scroll-y="true" :scroll-top="scrollTop" ref="chatScroll"
				:scroll-with-animation="true">
				<view id="scroll-view-content">
					<view v-for="(message, index) in messages" :key="index">
						<view class="flex" v-if="!message.isSelf" style="margin-bottom: 10rpx;">
							<view class="icon" v-if="chatPartnerId == 0">
								<u-icon name="bell-fill" size="50rpx" color="#597dca"></u-icon>
							</view>
							<view class="icon-green" v-if="chatPartnerId == -1">
								<u-icon name="home-fill" size="50rpx" color="#36b248"></u-icon>
							</view>
							<u-avatar v-if="chatPartnerId > 0" size="35" mode="aspectFill" :src="otherAvatar"
								customStyle="margin: 3px 5px 3px 0"></u-avatar>
							<view>
								<u--text :margin="'0 20rpx 6rpx 0'" :text="message.sendTime" size="10"
									color="#a6a6a6"></u--text>
								<view class="text" style="margin-right: 20rpx;">
									<!-- 标题 -->
									<u--text v-if="message.title" :margin="'6rpx'" bold :text="message.title" size="12"
										color="#6e90d7"></u--text>
									<u--text v-if="message.content" :text="message.content" size="12"></u--text>
								</view>
								<view v-if="message.isPic" class="sys-imag">
									<u--image radius="10rpx" :src="message.pictureUrl" width="590rpx" height="380rpx"
										showLoading="true"></u--image>
								</view>
							</view>


						</view>
						<view class="flex-end" v-else style="margin-bottom: 10rpx;">
							<view>
								<u--text :margin="'0 6rpx 6rpx 20rpx'" :text="message.sendTime" size="10"
									color="#a6a6a6"></u--text>
								<view class="text my" style="margin-left: 20rpx;">
									{{ message.content }}
								</view>
							</view>

							<u-avatar size="35" mode="aspectFill" :src="myAvatar"
								customStyle="margin: 3px 5px"></u-avatar>
						</view>
					</view>
				</view>

			</scroll-view>
			<view class="input-part flex" v-if="chatPartnerId > 0">
				<u--textarea border="none" v-model="chatContent" autoHeight
					:disabled="chatPartnerId <= 0"></u--textarea>
				<u-button @click="sendMsg" text="发送" color="#6c95e0" size="small"
					:disabled="chatPartnerId <= 0"></u-button>
			</view>
			<view class="input-part flex" v-else>
				<u--text prefixIcon="info-circle" :margin="'0 200rpx 20rpx 230rpx'"
					:iconStyle="{ 'margin-right': '6rpx', 'color': '#a6a6a6' }" text="系统信息,不可回复" size="15"
					color="#a6a6a6"></u--text>
			</view>
		</view>
	</view>
</template>

<script>
	import env from '../../../utils/env';
	import {
		personCenter,
		personUserId
	} from '../../../api/commonApi/person';
	import {
		chatHistory
	} from '@/api/commonApi/chat'
	import WebSocketClient from '@/utils/websocket.js'

	export default {
		data() {
			return {
				nickName: '未设置昵称',
				chatContent: '',
				messages: [],
				myAvatar: '', // 自己的头像
				otherAvatar: '', // 对方的头像
				wsClient: null,
				chatPartnerId: '', // 聊天对象的用户ID
				historyList: [],
				scrollTop: 0,
				userId: '',
				page: 1,
				currentScrollTop: 0,
				lastMessageId: '',
				scrollViewHeight: 800,
			}
		},
		onLoad(options) {

			this.getUserAvatar()
			if (options.data) {
				const data = JSON.parse(decodeURIComponent(options.data));
				console.log(data);
				this.nickName = data.nickName
				this.chatPartnerId = data.chatPartnerId
				// 聊天对象不是系统用户时（即不是0或-1），获取用户ID并初始化WebSocket
				if (this.chatPartnerId > 0) {
					this.getUserId()
				}

				if (data.page == 0) {
					this.page = 0
				}
				// 清空消息列表后再加载历史记录
				this.messages = [];
				this.getChatHistory(data.chatPartnerId)
				// 从参数中获取聊天对象的信息
				if (data.avater) {
					this.otherAvatar = data.avater
				}

			}


		},
		//再次进入页面时,重新加载聊天记录
		async onShow() {
			// 确保chatPartnerId已设置且有值时才重新加载
			if (this.chatPartnerId) {
				// 清空消息列表避免重复加载
				this.messages = [];
				this.getChatHistory(this.chatPartnerId);
			}
		},
		onUnload() {
			// 页面卸载时关闭WebSocket连接
			if (this.wsClient) {
				this.wsClient.close()
			}
		},
		watch: {

		},
		methods: {
			//获取用户ID
			getUserId() {
				personUserId().then(res => {
					this.userId = res.data
					console.log('获取到用户ID:', this.userId)
					// 只有当chatPartnerId大于0时才初始化WebSocket连接
					if (this.chatPartnerId > 0 && this.userId) {
						this.initWebSocket()
					}
				}).catch(err => {
					console.error('获取用户ID失败:', err)
				})
			},
			//获取用户头像
			getUserAvatar() {
				personCenter().then(res => {
					this.myAvatar = res.data.avatar
				})
			},
			// 增加格式化时间的方法
			formatTime(date) {
				const hours = date.getHours().toString().padStart(2, '0');
				const minutes = date.getMinutes().toString().padStart(2, '0');
				return `${hours}:${minutes}`;
			},
			backInfo() {
				console.log(this.page);
				if (this.page == 0) {
					uni.navigateBack()
				} else {
					uni.switchTab({
						url: "/pages/info/info"
					})
				}

			},
			getChatHistory(id) {
				return new Promise((resolve, reject) => {
					chatHistory({
						chatPartnerId: id
					}).then(res => {
						// 清空消息列表，避免重复添加
						this.messages = [];
						if (res.data && Array.isArray(res.data)) {
							res.data.map(item => {
								if (item.senderId == id) {
									// 将发送的消息添加到消息列表
									this.messages.push({
										title: this.splitString(item.content, "::")[0],
										content: this.splitString(item.content, "::")[1],
										isSelf: false,
										sendTime: item.sendTime,
										pictureUrl: item.pictureUrl ? env.BASE_URL + item
											.pictureUrl : '',
										isPic: !!item.pictureUrl
									})
								} else {
									this.messages.push({
										content: item.content,
										isSelf: true,
										sendTime: item.sendTime,
									})
								}
							})
						}
						// 滚动到底部
						this.historyScrollToBottom();
						resolve();
					}).catch(err => {
						console.error('获取聊天历史失败:', err);
						reject(err);
					})
				});
			},
			// 初始化WebSocket
			initWebSocket() {
				// 确保userId存在
				if (!this.userId) {
					console.error('初始化WebSocket失败: 缺少userId')
					return
				}

				// 如果已经存在WebSocket实例，先关闭旧连接
				if (this.wsClient) {
					try {
						this.wsClient.close()
					} catch (error) {
						console.error('关闭旧WebSocket连接失败:', error)
					}
				}

				// 创建WebSocket实例，增加重连配置
				this.wsClient = new WebSocketClient('', {
					onOpen: this.handleWsOpen,
					onMessage: this.handleWsMessage,
					onError: this.handleWsError,
					onClose: this.handleWsClose,
					onReconnectAttempt: this.handleReconnectAttempt,
					maxReconnectAttempts: 8,
					reconnectInterval: 2000
				}, this.userId)

				// 连接WebSocket服务器
				this.wsClient.connect()
			},

			// 处理WebSocket连接打开事件
			handleWsOpen() {
				//console.log('WebSocket连接成功')
				// 可以在这里发送上线通知等
			},

			// 处理接收到的WebSocket消息
			handleWsMessage(data) {
				console.log('收到消息:', data)
				if (data.fromUser !== this.chatPartnerId) return
				if (data.fromUser == 0) return
				// 将收到的消息添加到消息列表
				this.messages.push({
					content: data.content || data,
					isSelf: false,
					timestamp: new Date().getTime()
				})
				this.$nextTick(() => {
					// 滚动到最新消息的逻辑
					this.scrollToBottom()
				});

			},

			// 处理WebSocket错误事件
			handleWsError(error) {
				console.error('WebSocket错误:', error)
			},

			// 处理WebSocket重连尝试事件
			handleReconnectAttempt(message) {
				console.log('WebSocket重连状态:', message)
			},

			// 处理WebSocket连接关闭事件
			handleWsClose() {
				console.log('WebSocket连接已关闭')
			},

			// 发送消息
			sendMsg() {
				// 当chatPartnerId为0或-1时，禁止发送消息
				if (this.chatPartnerId === 0 || this.chatPartnerId === -1) {
					uni.showToast({
						icon: 'none',
						title: '无法向系统用户发送消息'
					})
					return
				}

				if (!this.chatContent.trim()) {
					return
				}

				// 确保userId存在
				if (!this.userId) {
					console.error('发送消息失败: 缺少userId')
					this.getUserId() // 尝试重新获取userId
					return
				}

				// 构建消息对象
				const message = {
					content: this.chatContent.trim(),
					contentType: "TEXT",
					fromUser: this.userId,
					toUser: this.chatPartnerId,
					type: "MESSAGE"
				}

				// 发送消息到WebSocket服务器
				if (this.wsClient) {
					this.wsClient.send(message)
				} else {
					console.error('WebSocket未初始化')
					// 尝试重新初始化WebSocket
					this.initWebSocket()
					// 延迟后重试发送
					setTimeout(() => {
						if (this.wsClient) {
							this.wsClient.send(message)
						}
					}, 1000)
				}

				// 将发送的消息添加到消息列表
				this.messages.push({
					content: this.chatContent.trim(),
					isSelf: true,
					sendTime: this.formatTime(new Date())
				})

				// 清空输入框
				this.chatContent = ''

				// 滚动到底部
				this.$nextTick(() => {
					this.scrollToBottom()
				})

			},

			historyScrollToBottom() {
				if (!this.messages || this.messages.length === 0) {
					return;
				}
				this.$nextTick(() => {
					try {
						// 增加定时器延迟，确保DOM完全渲染
						setTimeout(() => {
							// 方法1：直接设置一个很大的值
							// this.scrollTop = 999999;

							// 方法2：使用选择器查询确保滚动
							// if (this.$refs.chatScroll) {
							// 	this.$refs.chatScroll.scrollTop = 999999;
							// }

							// 方法3：获取实际高度后设置
							uni.createSelectorQuery().in(this)
								.select('#scroll-view-content')
								.boundingClientRect((res) => {
									if (res && res.height) {
										this.scrollTop = res.height;
									}
								}).exec();
						}, 100);
					} catch (error) {
						console.error('滚动到底部失败:', error);
					}
				});
			},
			splitString(str, separator = '::') {
				if (!str || typeof str !== 'string') {
					return [];
				}
				return str.split(separator, 2);
			},

			scrollToBottom() {
				console.log("尝试滚动到底部");

				// 确保messages数组不为空
				if (!this.messages || this.messages.length === 0) {
					console.log("消息列表为空，无需滚动");
					return;
				}
				try {
					// 1：使用组件引用直接设置scrollTop
					if (this.$refs.chatScroll) {
						this.$refs.chatScroll.scrollTop = 999999;
					}
					// 2：使用createSelectorQuery获取内容高度后设置
					const query = uni.createSelectorQuery().in(this);
					query.select('#scroll-view-content').boundingClientRect();
					query.select('.chat-scroll').scrollOffset();
					query.exec((res) => {
						if (res && res[0] && res[1]) {
							const contentHeight = res[0].height;
							const scrollHeight = res[1].scrollHeight;
							// 强制重新设置scrollTop属性
							this.scrollTop = scrollHeight; // 使用实际滚动高度
						}
					});
				} catch (error) {
					console.error('滚动到底部失败:', error);
				}
			},
		}
	}
</script>

<style lang="scss">
	.chat {
		background-color: #f4f4f5;

		.top-nav {
			padding: 10rpx;
			background-color: #ebf3ff;
			border-radius: 50rpx;
		}

		.chat-container {

			margin-top: 200rpx;
			height: calc(100vh - 330rpx);

			.chat-scroll {

				height: 100%;

				#scroll-view-content {
					box-sizing: border-box;
					padding: 0 0 30rpx 0;
				}
			}


			.sys-imag {
				width: 590rpx;
				padding: 20rpx;
				border-radius: 10rpx;
				margin: 20rpx 0;
				background-color: #fff;
			}

			.icon {
				margin: 0 10rpx;

				.u-icon.data-v-172979f2 {
					padding: 16rpx !important;
					box-sizing: border-box;
					border-radius: 50%;
					background-color: #fcfeff;

				}
			}

			.icon-green {
				margin: 0 10rpx;

				.u-icon.data-v-172979f2 {
					padding: 26rpx !important;
					box-sizing: border-box;
					border-radius: 50%;
					background-color: #f0fbf1;

				}
			}

			.text {
				padding: 10rpx 20rpx;
				line-height: 50rpx;
				background-color: #fff;
				border-radius: 10rpx;
				font-size: 24rpx;
				color: #4e4e4f;
			}

			.my {
				background-color: #6c95e0;
				color: #fff;
			}


			.input-part {
				width: 100%;
				padding: 30rpx 10rpx;
				box-sizing: border-box;
				background-color: #fff;
				position: fixed;
				bottom: 0rpx;

				.u-textarea {
					padding: 6rpx 20rpx;
					box-sizing: border-box;
					border-radius: 50rpx;
					background-color: #f4f4f5;
				}

				.u-button {
					margin-left: 20rpx;
					width: 160rpx;
				}
			}
		}
	}
</style>