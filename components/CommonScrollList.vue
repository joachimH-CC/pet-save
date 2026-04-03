<!-- 通用滚动列表组件 -->
<template>
	<scroll-view v-if="displayList.length" :style="{ height }" scroll-y="true" @scrolltolower="onScrollToLower"
		lower-threshold="50" class="cs-scroll">
		<view v-for="(item, index) in displayList" :key="getKey(item, index)" class="cs-item-wrap">
			<slot :item="item" :index="index">
				<view class="cs-item" @click="$emit('item-click', item, index)">
					<view>{{ item }}</view>
				</view>
			</slot>
		</view>
		<!--  <view v-if="loading" class="cs-loadmore">加载中...</view> -->
		<u-loadmore v-if="loading" status="loading" />
		<u-loadmore v-else-if="displayList.length === totalCount && totalCount > pageSize" status="nomore" />
	</scroll-view>

	<!-- 无数据插槽 -->
	<!-- <view v-else-if="$slots.empty">
		<slot name="empty" />
	</view> -->

</template>

<script>
	export default {
		name: 'CommonScrollList',
		props: {
			// 必传数据,总列表数据
			items: {
				type: Array,
				default: () => [],
			},
			// 每次添加的数据量
			pageSize: {
				type: Number,
				default: 5,
			},
			// scroll-view高度 (eg. '100%' or '400px')
			height: {
				type: String,
				default: '100%',
			},
			// id 字段 如: petId
			keyField: {
				type: String,
				default: '',
			},
			// 初始化
			autoInit: {
				type: Boolean,
				default: true,
			},
		},
		data() {
			return {
				displayList: [],
				loading: false,
				currentLength: 0,
			};
		},
		computed: {
			totalCount() {
				return this.items ? this.items.length : 0;
			},
			hasMore() {
				return this.currentLength < this.totalCount;
			},
		},
		watch: {
			items: {
				handler() {
					if (this.autoInit) {
						this.reset();
					} else {
						// 若不自动初始化，仅更新总数但保留显示列表
					}
				},
				deep: true,
				immediate: true,
			},
		},
		mounted() {
			if (this.autoInit) {
				this.initLoad();
			}
		},
		methods: {
			getKey(item, index) {
				if (this.keyField && item && Object.prototype.hasOwnProperty.call(item, this.keyField)) {
					return item[this.keyField];
				}
				return `${index}-${this._uid}`;
			},

			initLoad() {
				this.displayList = [];
				this.currentLength = 0;
				this.loadMoreData();
			},

			// 加载下一页
			loadMoreData() {
				if (this.loading) return;
				if (!this.hasMore && this.currentLength > 0) return;

				this.loading = true;

				const start = this.currentLength;
				let end = start + (this.pageSize > 0 ? this.pageSize : this.totalCount);
				if (end > this.totalCount) end = this.totalCount;

				const newData = this.items.slice(start, end);
				this.displayList = this.displayList.concat(newData);
				this.currentLength = this.displayList.length;

				this.$emit('load', {
					added: newData,
					displayList: this.displayList,
					currentLength: this.currentLength,
					hasMore: this.hasMore,
				});

				this.loading = false;
			},

			// 向下滑动时触发
			onScrollToLower() {
				if (this.loading || !this.hasMore) return;
				this.$emit('scrolltolower');
				this.loadMoreData();
			},

			// 刷新
			reset(reinit = true) {
				this.displayList = [];
				this.currentLength = 0;
				this.loading = false;
				if (reinit) this.initLoad();
			},

			// 外部可调用的刷新
			refresh() {
				this.reset(true);
			},

			setItems(newItems = []) {
				this.$emit('update:items', newItems);
			},
		},
	};
</script>

<style scoped lang="scss">
	.cs-scroll {
		/* ensure scroll-view uses provided height */
	}

	.cs-item-wrap {
		/* wrapper around each slot item if additional spacing is needed */
	}

	.cs-item {
		padding: 12px;
		background: #fff;
	}

	.cs-loadmore {
		padding: 12px;
		text-align: center;
		color: #999;
	}

	.cs-empty {
		padding: 20px;
		text-align: center;
		color: #999;
	}
</style>