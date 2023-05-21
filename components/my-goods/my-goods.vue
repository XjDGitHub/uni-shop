<template>
	<view class="goods-item">
		<!-- 商品左侧图片区域 -->
		<view class="goods-item-left">
			<radio color="#C00000" :checked="goods.goods_state" v-if="showRadio" @click="radioClickHandler " />
			<image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
		</view>
		<!-- 商品右侧信息区域 -->
		<view class="goods-item-right">
			<!-- 商品标题 -->
			<view class="goods-name">
				{{goods.goods_name}}
			</view>
			<view class="goods-info-box">
				  <!-- 商品价格 -->
				<view class="good-price">
					￥{{goods.goods_price | tofixed}}
				</view>
				  <!-- 商品数量 -->
				  <uni-number-box :min="1" :value='goods.goods_count' v-if="showNum" @change="numChangeHandler"></uni-number-box>
			</view>
		</view>
	</view>
</template>

<script>
	import badgeMix from '../../mixins/tabbar-badge.js'
	export default {
		name: "my-goods",
		mixins:[badgeMix],
		data() {
			return {
				defaultPic: '../../static/dx.jpg',
			};
		},
		props: {
			goods: {
				type: Object,
				default: {}
			},
			showRadio: {
				type: Boolean,
				default: false
			},
			showNum:{
				type: Boolean,
				default: false
			}
		},
		filters: {
			tofixed(num) {
				return Number(num).toFixed((2))
			}
		},
		methods: {
			radioClickHandler() {
				this.$emit('radio-change',this.goods.goods_id)
			},
			numChangeHandler(val){
				this.$emit('num-change',{goods_id:this.goods.goods_id,goods_count:+val})
				this.setBadge()
			}
		}
	}
</script>

<style lang="scss">
	.goods-item {
		  // 让 goods-item 项占满整个屏幕的宽度
		  width: 750rpx;
		  // 设置盒模型为 border-box
		  box-sizing: border-box;

		display: flex;
		padding: 10px 5px;
		border-bottom: 1px solid #f0f0f0;

		.goods-item-left {
			margin-right: 5px;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.goods-pic {
				width: 100px;
				height: 100px;
				display: block;
			}
		}

		.goods-item-right {
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.goods-name {
				font-size: 13px;
			}
			  .goods-info-box {
			    display: flex;
			    align-items: center;
			    justify-content: space-between;
			  }

			.goods-price {
				font-size: 16px;
				color: #c00000;
			}
		}
	}
</style>