<template>
	<view class="box">
		<view class="search">
			<u-search :clearabled="true" bg-color="#FFFFFF" shape="square" height="72" placeholder="请输入你搜索的商品"
				:action-style="{backgroundColor:'#FF495E',color:'#fff',padding:'8px 2px',borderRadius:'4px'}"
				@custom="goSearch"></u-search>
		</view>

	<view class="content" v-if="hisSearch" >
		<view class="title-box">
			<text>搜索历史</text>
			<u-icon name="trash"  size="28" @click="clearHis"></u-icon>
		</view>
		<view class="sale-button-box">
			<view class="seconds-kill-li" v-for="item,index in hisArr" :key="index" @click="goSearch(item)" >
				<view class="recent-button" v-text="item">
					
				</view>
			</view>
		</view>
	</view>
	</view>
	
</template>

<script>
	export default {
		data() {
			return {
				hisSearch: false,
				hisArr:[],
			}
		},
		onLoad() {

	
		
		},
		onShow(){
			const value = uni.getStorageSync('searchHistory');
			 if (value) {
					this.hisArr=value;
					this.hisSearch = true;
			 	}
		},
		methods: {
			goSearch(v) {
				const isCf = this.hisArr.some(item=>item==v);
				console.log(isCf);
				if (this.hisSearch) {
					if(!isCf){
						uni.setStorage({
							key: 'searchHistory',
							data: [...this.hisArr,v],
						});
					}
				} else {
					uni.setStorage({
						key: 'searchHistory',
						data: [v],
					});
				};
				uni.navigateTo({
					url: `/subpackages/shopList/shopList?str=${v}`,
				});

			},
			clearHis(){
				// 删除本地的
				uni.removeStorage({
					key: 'searchHistory',
				});
						this.hisSearch=false
			
			}
		}
	}
</script>

<style lang="scss" scoped>
	.box {}

	.search {
		margin: 20upx 10upx;
	}
	.content{
		width: 95%;
		margin: 0 auto;
	}
	.title-box {
		display: flex;
		justify-content: space-between;
	    font-size: 10pt;
	    padding: 30upx 0 0 0;
	    color: #777;
	}
	.sale-button-box {
	    padding: 10px 0;
		.seconds-kill-li {
		    width: 33.3%;
		    float: left;
		    padding: 10rpx;
		    box-sizing: border-box;
			.recent-button {
			    background: #fff;
			    padding: 10rpx;
			    border-radius: 50px;
			    justify-content: center;
			    text-align: center;
			    font-size: 26rpx;
			    border: 1px solid #ccc;
			    overflow: hidden;
			    white-space: nowrap;
			    text-overflow: ellipsis;
			    height: 50rpx;
			    line-height: 30rpx;
			}
		}
	}
</style>