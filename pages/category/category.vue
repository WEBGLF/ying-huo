<template>
	<view class="box" v-if="isShow" >
		<view class="search">
			<u-search :show-action="false" input-align="center"  height="72"
				placeholder="搜索商品" @focus="goSearch"></u-search>
		</view>
<view class="content">
	<scroll-view class="left" scroll-y="true">
		<view class="left-title" :class="indexLeft == -1 ? 'active-left' : '' "  v-text="'全部'" @tap="changeData(-1)" >
			
		</view>
			<view class="left-title" :class="indexLeft == item.category_id ? 'active-left' : '' " v-for="item,index in leftArr" :key="item.category_id" v-text="item.name" @tap="changeData(item.category_id)" >
				
			</view>
		</scroll-view>
	<scroll-view class="right" scroll-y="true">
		<view class="goods-item" v-for="item,index in rightArr" :key="item.goods_id" @click="goShopXq(item.goods_id)" >
			<view class="goods-item_left">
				<image :src="item.goods_image" ></image>
			</view>
			<view class="goods-item_right">
				<view class="goods-item_title">
					<text class="goods-text" >{{item.goods_name}}</text>
				</view>
				<view class="goods-item_desc">
					<view class="desc-goods_sales">
						<text>{{`已售${item.goods_sales}件`}}</text>
					</view>
					<view class="good_price">
						<text class="price_x" v-text="'￥'+item.goods_sku.goods_price"></text>
						<text class="price_y " v-text="'￥'+item.goods_sku.line_price"></text>
					</view>
				</view>
			</view>

	
		</view>
	<view  style="text-align: center;margin: 20upx 0;padding-bottom: 30upx;color: #999;">
		亲，没有更多了
	</view>
	</scroll-view>
</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isShow:false,
				indexLeft:-1,
				leftArr:[],
				allRightArr:[],
				rightArr:[]
			};
		},
		onLoad(){
			this.getData()
		},
		methods:{
			goSearch(){
				uni.navigateTo({
					url: '/subpackages/search/search',
					animationType: 'fade-in',
					animationDuration: 1000
				});
			},
			// 得到数据
			getData(){
				this.$ajax([
					{
						url:this.$urls.baseCategory
					},
					{
						url:this.$urls.baseGoodslist
					}
				]).then(res=>{
					this.leftArr = res[0].data.data.categoryList;
					this.allRightArr = [...res[0].data.data.goodsList.data,...res[1].data.data.list.data];
					this.rightArr =  [...res[0].data.data.goodsList.data,...res[1].data.data.list.data];
					this.isShow = true;
				})
			},
			// 改变数据
			async  changeData(index){
					 this.indexLeft = index;
				 if(index==-1){ 			
					 this.rightArr = this.allRightArr;
				 }else{
					await this.$ajax({
						 url:this.$urls.baseOneList(index)
					 }).then(res=>{
						 this.rightArr = res.data.data.list.data
					 })
				 }
			},
			// 跳到详情
			goShopXq(id){
				uni.navigateTo({
					url: `/subpackages/shopXq/shopXq?id=${id}`,
				});
			}
		},
	}
</script>

<style lang="scss" scoped>
	.box{
		background-color: #fff;
	}
.search{
	width: 95%;
	margin: 0 auto;
}
.content{
	display: flex;
	margin-top: 20upx;
	.left{
		height:1050upx;
		    display: flex;
		    width: 22.2222%;
		    color: #444;
		    background: #f8f8f8;
			.left-title{
				    position: relative;
				    height: 90rpx;
				    line-height: 90rpx;
				    text-align: center;
				    z-index: 10;
				    display: block;
				    font-size: 26rpx;
			}
			.active-left{
				background: #fff;
				    color: #ff495e;
				    border-right: none;
				    font-size: 28rpx;
					border-left: 3px solid #ff495e;
			}
	}
	.right{
		flex: 1;
		height:1050upx;
		.goods-item {
		    width: 100%;
		    margin-bottom: 10rpx;
		    padding: 16rpx;
		    box-sizing: border-box;
		    background: #fff;
			display: flex;
			.goods-item_left {
			    display: flex;
			    width: 36%;
			    background: #fff;
			    align-items: center;
				 image {
				    display: block;
				    width: 190rpx;
				    height: 190rpx;
				}
			}
			.foot-right{
				text-align: center;
				margin: 20upx 0;
			}
			.goods-item_right {
			    position: relative;
			    width: 60%;
			    padding-left: 20rpx;
	
				.goods-item_title {
				    height: 72upx;
				    margin-top: 20rpx;
				    font-size: 26upx;
				    color: #333;
					.goods-text{
					    display: -webkit-box;
					    word-break: break-all;
					    text-overflow: ellipsis;
					    overflow: hidden;
					    -webkit-box-orient: vertical;
					    -webkit-line-clamp: 2;
					}
				}
				.goods-item_desc {
				    margin-top: 8rpx;
					.desc-goods_sales {
					    color: #999;
					    font-size: 24upx;
					}
					.good_price{
						
						.price_x {
						    margin-right: 16rpx;
						    color: #f03c3c;
						    font-size: 27rpx;
						}
						.price_y {
						    font-size: 24rpx;
						    text-decoration: line-through;
							color: #999;
						}
					} 
				}
			}
		}
	}
}
</style>
