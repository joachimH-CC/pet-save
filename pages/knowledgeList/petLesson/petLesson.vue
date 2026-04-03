<template>
	<view class="pet-lesson content">
		<view class="lesson-container">
			<view class="video-container">
				<h3>{{classInfo.title}}</h3>
				<u--text align="center" prefixIcon="clock-fill" :margin="'0 0 20rpx 0'"
					:text="'预计播放时长:'+classInfo.videoTime" size="10" color="#535353"></u--text>
				<video ref="videoRef" :src="classInfo.classVideo" object-fit="fill" @timeupdate="onTimeUpdate"></video>
			</view>
			<h3 style="margin-top: 10rpx;">课程介绍</h3>
			<u--text :margin="'0 0 20rpx 0'" :text="classInfo.content" size="14" color="#535353"></u--text>
		</view>
	</view>
</template>

<script>
	import {
		classVideoDetail,
		watchVideo
	} from '../../../api/userApi/knowlegde';

	export default {
		data() {
			return {
				knowledgeId: undefined,
				classInfo: undefined,
				watchVideoTime: 0, // 当前播放时间（秒）
				watchTime: 0,
			};
		},
		onLoad(options) {
			console.log('接收的参数：', options);
			this.knowledgeId = options.knowledgeId || 0
			// 获取数据
			this.getClassDetail(options.knowledgeId);
		},
		methods: {
			getClassDetail(id) {
				classVideoDetail(id).then(res => {
					console.log(res);
					res.data.videoTime = this.secondsToMinutes(res.data.videoTime)
					this.classInfo = res.data
					console.log(this.classInfo);

				})
			},
			//获取当前视频时长
			onTimeUpdate(e) {
				// 获取当前播放时间（秒）
				this.watchVideoTime = e.detail.currentTime.toFixed(0);
				this.watchTime = e.detail.duration.toFixed(0);
				console.log(e.detail);
				// 格式化显示
				//this.playedTimeText = this.formatDuration(this.currentTime);
			},
			secondsToMinutes(seconds) {
				if (seconds < 60) {
					return `${seconds}秒`;
				} else {
					const mins = Math.floor(seconds / 60);
					const secs = seconds % 60;
					return secs === 0 ? `${mins}分` : `${mins}分${secs}秒`;
				}
			},
			getWatchTime() {
				const data = {
					watchTime: this.watchTime,
					watchVideoTime: this.watchVideoTime,
					knowledgeId: this.knowledgeId
				}
				watchVideo(data).then(res => {
					console.log(res);
				})
			}
		},
		onUnload() {
			this.getWatchTime()
		}
	}
</script>

<style lang="scss">
	.pet-lesson {
		h3 {

			padding: 10rpx 0;
			box-sizing: border-box;
			font-weight: 600;

		}

		.lesson-container {
			padding: 0 20rpx;
			box-sizing: border-box;
			background-color: #fff;

			.u-icon__icon {
				color: #6988cb !important;
			}

			.u-icon {
				margin-right: 5rpx;
			}

			p {
				padding: 10rpx;
				font-size: 24rpx
			}

			.video-container {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				video {
					height: 440rpx;
					width: 700rpx;
					border-radius: 10rpx;
				}
			}

		}
	}
</style>