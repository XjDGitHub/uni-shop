<template>
	<view>
		<view class="goods-list">
			<view v-for="(goods,i) in goodList" :key="i" @click="gotoDetail(goods)">
			<my-goods :goods="goods"></my-goods>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 请求参数对象
				queryObj: {
					// 查询关键词
					query: '',
					// 商品分类id
					cid: '',
					// 页码值
					pagenum: 1,
					// 每页显示多少条数据
					pagesize: 10
				},
				// 商品列表的数据
				goodList:[],
				  // 总数量，用来实现分页
				total:0,
				defaultPic:'../../static/dx.jpg',
				// 节流阀
				isLoading:false
			};
		},
		methods:{
			async getGoodList(cb){
				this.isLoading=true
				const {data:res}=await uni.$http.get('/api/public/v1/goods/search',this.queryObj)
				this.isLoading=false
				cb&&cb()
				if(res.meta.status !==200) return uni.$showMsg()
				this.goodList=[...this.goodList,...res.message.goods]
				this.total=res.message.total
			},
			gotoDetail(goods){
				uni.navigateTo({
					url:'/subpkg/goods_detail/goods_detail?goods_id=' + goods.goods_id
				})
			}
		},
		onLoad(options) {
			this.queryObj.query = options.query || '',
			this.queryObj.cid = options.cid || '',
			this.getGoodList()
		},
		onReachBottom(){
			//判断是否正在请求其它数据，如果是，则不发起额外的请求
			if(this.isLoading) return
			if(this.queryObj.pagenum*this.queryObj.pagesize >=this.total) return uni.$showMsg('数据加载完毕！')
			this.queryObj.pagenum+=1,
			this.getGoodList()
		},
		// 下拉刷新的事件
		onPullDownRefresh(){
			this.queryObj.pagenum=1
			this.total=0,
			this.isLoading=false,
			this.goodList=[],
			// 重新发起请求
			this.getGoodList(()=>{
				uni.stopPullDownRefresh()
			})
		}
	}
</script>

<style lang="scss">

</style>