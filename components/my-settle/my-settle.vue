<template>
	<view>
		<view class="my-settle-container">
			<!-- 全选区域 -->
			<label class="radio">
				<radio color="#c00000" :checked="isFullChecked" @click="changeAllState" /><text>全选</text>
			</label>
			<!-- 合计区域 -->
			<view class="amount-box">
				合计：<text class="amount">￥{{checkedGoodsAmount}}</text>
			</view>
			<!-- 结算按钮 -->
			<view class="btn-settle" @click="settlement">
				结算({{checkedCount}})
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations,
		mapState
	} from 'vuex'
	export default {
		name: "my-settle",
		data() {
			return {
				// 倒计时秒数
				seconds: 3,
				// 定时器id 方便后续删除
				timer: null
			};
		},
		methods: {
			...mapMutations('m_cart', ['updateAllGoodsState']),
			...mapMutations('m_user', [ 'updateRedirectInfo']),
			changeAllState() {
				this.updateAllGoodsState()
			},
			settlement() {
				if (!this.checkedCount) return uni.$showMsg('请选择商品')
				if (!this.addstr) return uni.$showMsg('请选择收获地址')

				// if(!this.token) return uni.$showMsg('请先登录')
				if (!this.token) return this.delayNavigate()

				// 实现微信支付功能
				this.payOrder()
			},
			async payOrder() {
				// 1. 创建订单
				// 1.1 组织订单的信息对象
				const orderInfo = {
					order_price: 0.01,
					consignee_addr: this.addstr,
					goods: this.cart.filter(x => x.goods_state).map(x => ({
						goods_id: x.goods_id,
						goods_number: x.goods_count,
						goods_price: x.goods_price
					}))
				}
				// 1.2 发起请求创建订单
				const {
					data: res
				} = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo)
				if (res.meta.status !== 200) return uni.$showMsg('创建订单失败！')
				// 1.3 得到服务器响应的“订单编号”
				const orderNumber = res.message.order_number
				// 2. 订单预支付
				// 2.1 发起请求获取订单的支付信息
				const {data:res2} =await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder',{order_number:orderNumber})
				  // 2.2 预付订单生成失败
				if (res2.meta.status !== 200) return uni.$showMsg('预付订单生成失败！')
				// 2.3 得到订单支付相关的必要参数
				const payInfo = res2.message.pay

				// 3. 发起微信支付
				// 3.1 调用 uni.requestPayment() 发起微信支付
				const [err,succ] =await uni.requestPayment(payInfo)
				if(err) return uni.$showMsg('订单未支付！')
				 // 3.3 完成了支付，进一步查询支付的结果
				const {data:res3} =await uni.$http.post('/api/public/v1/my/orders/chkOrder', { order_number: orderNumber })
				if(res3.meta.status!==200) return uni.$showMsg('订单未支付！')
				// 3.5 检测到订单支付完成
				uni.showToast({
				     title: '支付完成！',
				     icon: 'success'
				   })

			},

			showTips(n) {
				uni.showToast({
					// 不展示任何图标
					icon: 'none',
					// 提示的消息
					title: '请登录后再结算！' + n + ' 秒后自动跳转到登录页',
					// 为页面添加透明遮罩，防止点击穿透
					mask: true,
					// 1.5 秒后自动消失
					duration: 1500
				})
			},
			delayNavigate() {
				this.seconds = 3
				this.showTips(this.seconds)
				this.timer = setInterval(() => {
					this.seconds--
					if (this.seconds <= 0) {
						clearInterval(this.timer)
						uni.switchTab({
							url: '/pages/my/my',
							success: () => {
								this.updateRedirectInfo({
									// 跳转的方式
									openType: 'switchTab',
									// 从哪个页面跳转过去的
									from: '/pages/cart/cart'
								})
							}
						})
						//终止后续代码的运行（当秒数为 0 时，不再展示 toast 提示消息）
						return
					}

					this.showTips(this.seconds)
				}, 1000)
			}
		},
		computed: {
			...mapGetters('m_cart', ['checkedCount', 'total', 'checkedGoodsAmount']),
			...mapGetters('m_user', ['addstr']),
			...mapState('m_user', ['token']),
			...mapState('m_cart', ['cart']),

			// 是否全选
			isFullChecked() {
				return this.total === this.checkedCount
			}
		}
	}
</script>

<style lang="scss">
	.my-settle-container {
		/* 底部固定定位 */
		position: fixed;
		bottom: 0;
		left: 0;
		/* 设置宽高和背景色 */
		width: 100%;
		height: 50px;
		// 将背景色从 cyan 改为 white
		background-color: white;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 5px;
		font-size: 14px;

		.radio {
			display: flex;
			align-items: center;
		}

		.amount {
			color: #c00000;
		}

		.btn-settle {
			height: 50px;
			min-width: 100px;
			background-color: #c00000;
			color: white;
			line-height: 50px;
			text-align: center;
			padding: 0 10px;
		}
	}
</style>