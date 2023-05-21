export default {
	namespaced: true,
	state: () => ({
		// 购物车的数组，用来存储购物车中每个商品的信息对象
		// 每个商品的信息对象，都包含如下 6 个属性：
		// { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
		cart: JSON.parse(uni.getStorageSync('cart')||'[]') 
		// cart:[]
	}),
	mutations: {
		// 向购物车里添加物品，用组件展示
		addToCart(state, goods) {
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
			if (!findResult) {
				state.cart.push(goods)
			} else {
				findResult.goods_count++
			}
			this.commit('m_cart/saveToStorage')
		},
		// 向本地存储购物车的内容
		saveToStorage(state){
			uni.setStorageSync('cart',JSON.stringify(state.cart))
		},
		// 修改购物车的radio的选中状态
		updateGoodsState(state,id){
			const findResult =state.cart.find(x=>x.goods_id===id)
			if(findResult){
				findResult.goods_state=!findResult.goods_state
			}
			this.commit('m_cart/saveToStorage')
		},
		// 修改商品数量
		updateGoodsCount(state,goods){
			const findResult =state.cart.find(x=>x.goods_id===goods.goods_id)
			if(findResult){
				findResult.goods_count=goods.goods_count
			}
			this.commit('m_cart/saveToStorage')
		},
		// 根据 Id 从购物车中删除对应的商品信息
		removeGoodsById(state,goods_id){
			state.cart=state.cart.filter(x=>x.goods_id !==goods_id)
			this.commit('m_cart/saveToStorage')
		},
		// 更新所有商品的勾选状态
		updateAllGoodsState(state){
			state.cart.forEach(x=>x.goods_state=!x.goods_state)
			this.commit('m_cart/saveToStorage')
		}
	},
	// 类似于计算属性
	getters: {
		total(state){
			let c=0
			state.cart.forEach(goods=>c=c+goods.goods_count)
			return c
		},
		// 勾选商品的总数量
		checkedCount(state){
			return state.cart.filter(x=>x.goods_state).reduce((total,item) => total+=item.goods_count,0)
		},
		// 已勾选商品的总价
		checkedGoodsAmount(state){
			return state.cart.filter(x=>x.goods_state).reduce((total,item)=>total+=item.goods_count*item.goods_price,0).toFixed(2)
		}
	}
}