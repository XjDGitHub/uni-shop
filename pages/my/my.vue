<template>
	<view class="my-container">
		<my-login ></my-login>
		<my-userinfo ></my-userinfo>
	</view>
</template>

<script>
	import badgeMix from '../../mixins/tabbar-badge.js'
	import {mapState} from 'vuex'
	export default {
		mixins:[badgeMix],
		data() {
			return {
				
			};
		},
		computed: {
			...mapState('m_user',['token'])
		},
	}
</script>

<style lang="scss">

.my-container {
  height: 100%;
}
</style>
