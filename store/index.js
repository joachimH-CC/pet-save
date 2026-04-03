import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		roleId: 2,
		//宠物体型
		petSize: [{
				value: "小型",
				key: 0
			},
			{
				value: "中型",
				key: 1
			},
			{
				value: "大型",
				key: 2
			},
		],
		//护理类型0-喂食，2-注射疫苗，3-驱虫，4-绝育，5-其他
		nurseType: [{
				value: "喂食",
				key: 0
			},
			{
				value: "换药",
				key: 1
			},
			{
				value: "注射疫苗",
				key: 2
			},
			{
				value: "驱虫",
				key: 3
			},
			{
				value: "绝育",
				key: 4
			},
			{
				value: "其他",
				key: 5
			},
		],
		isAiMatch: 0,
	},
	getters: {
		getPetSize: (state) => (val) => {
			// 逻辑与原方法一致：根据 val 匹配对应的 size 文本
			const sizeItem = state.petSize.find(item => item.key == val);
			return sizeItem ? sizeItem.value : '未知尺寸';
		},
		getTagType: (state) => (index) => {
			const types = ['info', 'warning', 'success'];
			return types[index];
		},
	},
	mutations: {
		setRole(state, roleId) {
			state.roleId = roleId // 从用户信息中提取角色
			uni.setStorageSync('roleId', roleId);
		},
		setMatch(state, isAiMatch) {
			state.isAiMatch = isAiMatch // 从用户信息中提取角色
			uni.setStorageSync('isAiMatch', isAiMatch);
		}

	},
	actions: {
		initRole({
			commit
		}) {
			const storedRoleId = uni.getStorageSync('roleId');
			// 如果本地有存储，就用本地的值覆盖默认值
			if (storedRoleId !== '') {
				commit('setRole', storedRoleId);
			}
		},
		initMatch({
			commit
		}) {
			const storedMatch = uni.getStorageSync('isAiMatch');
			// 如果本地有存储，就用本地的值覆盖默认值
			if (storedMatch !== '') {
				commit('setMatch', storedMatch);
			}
		}
	},
	module: {}
})

export default store