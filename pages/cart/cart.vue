<template>
	<view>
		<view class="cart-container" v-if="cart.length !==0">
			<!-- 收获地址区域 -->
			<my-address></my-address>
			<!-- 购物车商品列表的标题区域 -->
			<view class="cart-title">
				<!-- 左侧图标 -->
				<uni-icons type="shop" size="18"></uni-icons>
				<!-- 描述文本 -->
				<text class="cart-title-text">购物车</text>
			</view>
			<!-- 商品列表区域 -->
			<uni-swipe-action>
				<block v-for="(item,index) in cart" :key="index">
					<!-- uni-swipe-action-item 可以为其子节点提供滑动操作的效果。需要通过 options 属性来指定操作按钮的配置信息 -->
					<uni-swipe-action-item :right-options="options" @click="swipeActionClickHandler(item)">
						<my-goods :goods="item" :showRadio="true" :show-num="true" @radio-change="radioChangeHandler"
							@num-change='numberChangeHandler'></my-goods>
					</uni-swipe-action-item>
				</block>
			</uni-swipe-action>
		</view>
		<view class="empty-cart" v-else>
			<image src='../../static/dx.jpg'  class="empty-img"></image>
			<text class="tip-text">空空如也~</text>
		</view>
		
		<!-- 结算区域 -->
		<my-settle></my-settle>
	</view>
</template>

<script>
	import badgeMix from '../../mixins/tabbar-badge.js'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				options: [{
					text: '删除', // 显示的文本内容
					style: {
						backgroundColor: '#C00000' // 按钮的背景颜色
					}
				}]
			}
		},
		mixins: [badgeMix],
		computed: {
			...mapState('m_cart', ['cart'])
		},
		methods: {
			...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount', 'removeGoodsById']),
			// <!-- 在 radioChangeHandler 事件处理函数中，通过事件对象 e，得到商品的 goods_id
			// 修改购物车的radio的选中状态
			radioChangeHandler(goods_id) {
				console.log(goods_id)
				this.updateGoodsState(goods_id)
			},
			// 修改商品数量
			numberChangeHandler(e) {
				console.log(e)
				this.updateGoodsCount(e)
			},
			swipeActionClickHandler(goods) {
				console.log(goods)
				this.removeGoodsById(goods.goods_id)
				this.setBadge()
			}
		}

	}
</script>

<style lang="scss">
	.cart-container {
	  padding-bottom: 50px;
	}
	.cart-title {
		height: 40px;
		display: flex;
		align-items: center;
		font-size: 14px;
		padding-left: 5px;
		border-bottom: 1px solid #efefef;

		.cart-title-text {
			margin-left: 10px;
		}
	}
	.empty-cart {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  padding-top: 50px;
	
	  .empty-img {
	    width: 300px;
	    height: 300px;
	  }
	
	  .tip-text {
	    font-size: 36px;
	    color: gray;
	    margin-top: 15px;
	  }
	}
</style>