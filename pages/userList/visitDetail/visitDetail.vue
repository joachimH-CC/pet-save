<template>
	<view class="visit-detail ">
		<u-empty v-if="!recordList.length" mode="list" text="快来添加你的回访记录吧!">
		</u-empty>
		<view v-if="recordList.length" class="visit-detail-container">
			<view v-for="(item,index) in recordList" :key="item.returnVisitId">
				<view class="visit-item">
					<view class="just-space-be">
						<u--text :margin="'10rpx 0 10rpx 0'" bold :text="'第'+(recordList.length-index)+'次回访'" size="14"
							color="#5c5c5c"></u--text>
						<u--text :margin="'10rpx 0 0 350rpx'" :text="item.returnTime" size="11"
							color="#787878"></u--text>
					</view>
					<view class="pet-pic" v-if="item.returnVisitFiles && item.returnVisitFiles.length>0">
						<u-grid :border="false">
							<u-grid-item v-for="(url,i) in item.returnVisitFiles" :key="i">
								<u--image v-if="url.type==0" radius="20rpx" :showLoading="true" :src="url.path"
									width="100px" height="100px"></u--image>
								<video v-else class="video-item" :src="url.path" width="100px" height="100px"
									@fullscreenchange="onFullscreenChange" :enable-play-gesture="true"></video>
							</u-grid-item>
						</u-grid>
					</view>
					<view style="margin-top: 20rpx;">
						<u--text :margin="'10rpx 0'" text="回访方式" bold size="13" color="#8a8a8a"></u--text>
						<u--text :text="item.method==0?'线下':'线上'" size="14"></u--text>
					</view>
					<view style="margin-top: 20rpx;">
						<u--text :margin="'10rpx 0'" text="宠物状况描述" bold size="13" color="#8a8a8a"></u--text>
						<u--text :text="item.petCondition" size="14"></u--text>
					</view>
					<view style="margin-top: 20rpx;">
						<u--text :margin="'10rpx 0'" text="领养人反馈" bold size="13" color="#8a8a8a"></u--text>
						<u--text :text="item.feedback" size="14"></u--text>
					</view>
					<view style="margin-top: 20rpx;">
						<u--text :margin="'10rpx 0'" text="回访建议" bold size="13" color="#8a8a8a"></u--text>
						<u--text :text="item.returnRemark" size="14"></u--text>
					</view>
					<view class="flex-end">
						<u-icon name="edit-pen-fill" @click="editVisit(item)"></u-icon>
						<u-icon name="trash-fill" @click="delVisit(item.returnVisitId)"></u-icon>
					</view>
				</view>

				<u-gap height="40rpx" bgColor="#f4f4f5"></u-gap>
			</view>

		</view>
		<view class="add-btn">
			<u-icon @click="addVisitRecord" size="100rpx" name="plus-circle-fill"
				color=" rgb(78, 112, 187,0.7)"></u-icon>
		</view>

	</view>
</template>

<script>
	import {
		deleteVisit,
		visitList
	} from '../../../api/rescuerApi/returnRecord';

	export default {
		data() {
			return {
				recordList: [],
				applyId: undefined,
				isFullscreen: false

			};
		},
		onLoad(options) {
			console.log('接收的参数：', options);
			this.applyId = options.applyId || 0
			// 获取数据
			this.getVisitList(this.applyId);
		},
		onShow() {
			this.getVisitList(this.applyId);
		},
		methods: {
			onFullscreenChange(e) {
				this.isFullscreen = e.detail.fullScreen
				console.log('全屏状态:', this.isFullscreen)
			},
			closePop() {
				this.recordPop.show = false
				this.resetForm('formRef')
			},
			getVisitList(id) {
				visitList(id).then(res => {
					console.log(res);
					this.recordList = res.data.msReturnVisitList
				})
			},
			editVisit(item) {
				uni.navigateTo({
					url: `/pages/userList/editVisit/editVisit?data=${encodeURIComponent(JSON.stringify(item))}&applyId=${this.applyId}`
				})
			},
			delVisit(id) {
				uni.showModal({
					title: '提示',
					content: "是否确定删除回访记录?",
					success: ({
						confirm
					}) => {
						if (confirm) {
							deleteVisit(id).then(res => {
								console.log(res);
								uni.showToast({
									title: "删除成功!",
									icon: "none"
								})
								this.getVisitList(this.applyId)
							})
						}
					}
				})
			},
			addVisitRecord() {
				uni.navigateTo({
					url: `/pages/userList/editVisit/editVisit?applyId=${this.applyId}`
				})
			},

		}
	}
</script>

<style lang="scss">
	.visit-detail {
		padding: 30rpx;

		.video-item {
			width: 200rpx;
			height: 200rpx;
			margin: 20rpx;
			border-radius: 20rpx;
		}

		.visit-item {
			margin-bottom: 30rpx;
			background-color: #fff;
			padding: 10rpx 20rpx 10rpx 20rpx;
			box-sizing: border-box;
			border-bottom: 2rpx solid #5a7eca;

			.pet-pic {
				margin-top: 10rpx;
			}

			.u-icon__icon {
				margin: 10rpx 0 0 30rpx;
				color: #5a7eca !important;
			}
		}

		.add-record {
			padding: 0 30rpx;
		}

		.add-btn {
			position: fixed;
			bottom: 200rpx;
			right: 10rpx;
		}
	}
</style>