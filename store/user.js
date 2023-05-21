export default {
	namespaced: true,
	state: () => ({
		address: JSON.parse(uni.getStorageSync('address') || '{}'),
		token: uni.getStorageSync('token') || '',
		// token:'123',
		// 用户信息
		userInfo: JSON.parse(uni.getStorageSync('userInfo') || '{}'),
		// 重定向的 object 对象 { openType, from } 来的方式 从哪来
		redirectInfo: null
	}),
	mutations: {
		// 更新收货地址
		updatAddress(state, address) {
			state.address = address
			this.commit('m_user/saveAddressToStorage')
		},
		// 本地存储
		saveAddressToStorage(state) {
			uni.setStorageSync('address', JSON.stringify(state.address))
		},
		// 用户信息
		updatUserInfo(state, userInfo) {
			state.userInfo = userInfo
			this.commit('m_user/saveUserInfoStorage')
		},
		// 本地存储用户信息
		saveUserInfoStorage(state) {
			uni.setStorageSync('userInfo', JSON.stringify(state.userInfo))
		},
		// token信息
		updatToken(state, token) {
			state.token = token
			this.commit('m_user/saveTokenStorage')
		},
		// 本地存储token信息
		saveTokenStorage(state) {
			uni.setStorageSync('token', state.token)
		},
		  // 更新重定向的信息对象
		  updateRedirectInfo(state, info) {
		    state.redirectInfo = info
		  }
	},
	getters: {
		// 收货详细地址的计算属性
		addstr(state) {
			if (!state.address.provinceName) return ''
			// 拼接 省，市，区，详细地址 的字符串并返回给用户
			return state.address.provinceName + state.address.cityName + state.address.countyName + state.address
				.detailInfo
		}
	}
}