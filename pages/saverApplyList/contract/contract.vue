<template>
	<view class="contract">
		<view class="contract-content">
			<u--image :showLoading="true" :src="src" width="600rpx" height="1200rpx"></u--image>
		</view>
		<view class="popup-content">
			<u--text :margin="'10rpx 0 10rpx 20rpx'" bold text="电子签名" size="14" color="#666"></u--text>
			<u--text :margin="'0 0 10rpx 20rpx'" text="请在下方签署您的姓名,确认同意以上协议内容" size="11" color="#ccc"></u--text>
			<view class="con-top">
				<canvas class="myCanvas" canvas-id="myCanvas" id="myCanvas" @touchstart="touchstart"
					@touchmove="touchmove" @touchend="touchend"></canvas>
			</view>
			<view class="clear">
				<u-button icon="trash-fill" @click="clearSignature" text="重置签名" :plain="true" size="mini"></u-button>
			</view>
			<view class="popup-buttons">
				<u-button @click="finish" text="确认签署" color="#6786c9"></u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		comfirmContract
	} from '../../../api/rescuerApi/rescueApply';

	export default {
		data() {
			return {
				ctx: '',
				mainCtx: '',
				points: [],
				dataForm: {
					signature: '',
				},
				src: "../../../../static/contract.png",
				applyId: ''
			};
		},
		onLoad(options) {
			console.log('接收的参数：', options);
			this.applyId = options.applyId || 0
		},
		mounted() {
			this.createCanvas();
		},
		methods: {
			//创建画布
			createCanvas() {
				this.ctx = uni.createCanvasContext('myCanvas'); //创建绘图对象
			},
			touchstart(e) {
				let startX = e.changedTouches[0].x;
				let startY = e.changedTouches[0].y;
				let startPoint = {
					X: startX,
					Y: startY
				};
				this.points.push(startPoint);
				//每次触摸开始，开启新的路径
				this.ctx.beginPath();
			},

			touchmove(e) {
				let moveX = e.changedTouches[0].x;
				let moveY = e.changedTouches[0].y;
				let movePoint = {
					X: moveX,
					Y: moveY
				};
				this.points.push(movePoint); //存点
				let len = this.points.length;
				if (len >= 2) {
					this.draw(); //绘制路径
				}
			},

			touchend() {
				this.points = [];
			},

			draw() {
				let point1 = this.points[0];
				let point2 = this.points[1];
				this.points.shift();
				this.ctx.moveTo(point1.X, point1.Y);
				this.ctx.lineTo(point2.X, point2.Y);
				this.ctx.stroke();
				this.ctx.draw(true);
			},

			//保存
			finish() {
				uni.canvasToTempFilePath({
					canvasId: 'myCanvas',
					// fileType: "jpg",
					success: (res) => {
						console.log("成功保存图片", res.tempFilePath);
						this.dataForm.signature = res.tempFilePath
						//this.$refs.qmpopup.close(); 关闭弹窗
						const data = {
							signature: this.dataForm.signature,
							applyId: this.applyId,
							status: 1
						}
						comfirmContract(data).then(res => {
							console.log(res);
							uni.showToast({
								icon: 'none',
								title: '签署成功!'
							})

						}).then(() => {
							uni.navigateBack()
						})
					}
				});
			},

			// 清除签名
			clearSignature() {
				this.ctx.clearRect(0, 0, 300, 150);
				this.ctx.draw(true);
				this.points = [];
			},
		}
	};
</script>

<style lang="scss">
	.contract {
		padding: 30rpx;
		display: flex;
		flex-direction: column;
		align-items: center;

		.contract-content {}

		.mainCanvas {
			width: 600rpx;
			height: 1000rpx;
		}


		// 弹窗
		.popup-content {
			width: 600rpx;

			.con-top {
				width: 600rpx;
				height: 300rpx;
				padding: 20rpx;
				box-sizing: border-box;

				.myCanvas {
					width: 100%;
					height: 100%;
					aspect-ratio: auto 618 / 508;
					border: 6rpx dotted #ccc;
				}
			}

			.popup-buttons {
				width: 100%;
				padding: 20rpx;
				box-sizing: border-box;
				display: flex;
				justify-content: space-around;
				align-items: center;




			}

			.clear {
				padding: 20rpx;


				.u-button--mini {
					// color: #6786c9;
					margin: 0 2rpx;
					width: 200rpx !important;
				}
			}
		}
	}
</style>