// 1.导入vue vuex
import Vue from 'vue'
import Vuex from 'vuex'
//  导入购物车的 vuex 模块
import moduleCart from './cart.js'
// 导入收货地址的vuex模块
import moduleUser from './user.js'
// 2.将vuex安装为vue的插件
Vue.use(Vuex)
// 3.创建store的实例对象
const store =new Vuex.Store({
	// 挂载store模块
	modules:{
		m_cart:moduleCart,
		m_user:moduleUser
	}
})
// 向外共享store的实例对象
export default store