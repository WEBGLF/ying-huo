<template>
	<view>
		<view class="index-search-box">
			<view class="search1">
				<u-search :placeholder="str" :show-action="false"></u-search>
			</view>
			<view class="icon1">
				<u-icon :name="icon ? 'grid': 'list' " size="38" color="#999" @click="()=>icon=!icon"></u-icon>
			</view>
		</view>
		<view class="tabs">
			<u-tabs :list="list" :is-scroll="false" :current="current" @change="change" active-color="#ff0000" :bold="false"></u-tabs>
		</view>
	
	<!-- 有内容 -->
	<view class="content" v-if="isLength">
	<scroll-view scroll-y="true" class="view-scr" >
		 <view :class="icon? 'listconone':'listcon'">
		 	<view class="list" v-for="item,index in dataArr " :key="item.goods_id" @click="goShopXq(item.goods_id)" >
		 		<view class="left">
		 			<image :src="item.goods_image" ></image>
		 		</view>
		 	    <view class="right">
		 	    	<text class="title" v-text="item.goods_name"></text>
					<view class="r-price">
						<text style="color:#ff495e;" v-text="'￥'+item.goods_sku.goods_price"></text>
						<text class="del" v-text="'￥'+item.goods_sku.line_price"></text>
					</view>
		 	    </view>
			</view>
		 </view>
		 <view class="footer">
		 	亲,没有内容了
		 </view>
	</scroll-view>
	</view>
	<!-- 无内容 -->
	<view class="content" v-else>
		<view class="wu-content">
			<view class="image" >
				<image src="../../static/empty-02.png" mode="widthFix" ></image>
		  <text class="cont">亲,没有相关内容</text>
			</view>
		</view>
	</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				dataArr: [],
				isLength: false,
				str: '',
				icon: false,
				list: [{
					name: '综合'
				}, {
					name: '销量'
				}, {
					name: '价格'
				}],
				current: 0
			};
		},
		onLoad(options) {
			const {
				str
			} = options;
			console.log(str);
			this.str = str
			this.getData(this.$urls.baseSearchList(str));
		},
			methods: {
					change(index) {
						this.current = index;
						if(index==0){
					this.getData(this.$urls.baseSearchList(this.str));
						}else if(index==1){
							this.getData(this.$urls.baseSearchListTwo(this.str));
						}else if(index==2){
							this.getData(this.$urls.baseSearchListThree(this.str));
						}
						
						
					},
					getData(baseusl){
						this.$ajax({
							url:baseusl,
						}).then(res => {
							console.log(res.data.data.list.data);
							if (res.data.data.list.data.length > 0) {
								this.isLength = true
							}
							this.dataArr = res.data.data.list.data;
						})
					},
					goShopXq(id){
						uni.navigateTo({
							url: `/subpackages/shopXq/shopXq?id=${id}`,
						});
					}
				}
	}
</script>

<style lang="scss" scoped>
	.index-search-box {
		top: 1rpx;
		left: 0rpx;
		right: 0rpx;
		z-index: 999;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		position: fixed;
		background: #fff;
		padding: 18rpx 13rpx;
		border-bottom: 1px solid #eee;

		.search1 {
			width: 90%;
		}
	}
	.tabs{
		position: fixed;
		width: 100%;
		top: 100upx;
		z-index: 100;
	}
	.content{
		.footer{
			text-align: center;
			padding: 40upx;
			    color: #737373;
				font-size: 33upx;
		}
		padding-top: 180upx;
		.view-scr{
			    height: 513*2upx;
			    width: 376*2upx;
				.listcon{
					padding: 0 10upx;
					 display: flex;
					 justify-content: space-between;
					 flex-wrap: wrap;
					.list {
					    box-sizing: border-box;
					    width: 49%;
						background-color: #fff;
						padding-bottom: 10upx;
						
						.left{
							width: 100%;
							image {
							    width: 100%;
							    height: 375rpx;
							    display: block;
							}
						}
						.right {
						    padding: 0 12rpx;
							.title{
								height: 76rpx;
								line-height: 1.3;
								display: -webkit-box;
								word-break: break-all;
								text-overflow: ellipsis;
								overflow: hidden;
								-webkit-box-orient: vertical;
								-webkit-line-clamp: 2;
							}
							.r-price{
								.del {
								    text-decoration: line-through;
								    padding-left: 10rpx;
								    color: #999;
								}

							}
						}
					}
				}
				// 第二视图
				.listconone{
					padding: 0 10upx;
					 display: flex;
					 justify-content: space-between;
					 flex-wrap: wrap;
					.list {
					    box-sizing: border-box;
					    width: 100%;
						background-color: #fff;
					display: flex;
					justify-content: space-between;
					padding-bottom: 10upx;
						.left{
							image {
							   width: 220rpx;
							 height: 220rpx;
							}
						}
						.right {
							width: 65%;
							.title{
								height: 76rpx;
								line-height: 1.3;
								display: -webkit-box;
								word-break: break-all;
								text-overflow: ellipsis;
								overflow: hidden;
								-webkit-box-orient: vertical;
								-webkit-line-clamp: 2;
							}
							.r-price{
								.del {
								    text-decoration: line-through;
								    padding-left: 10rpx;
								    color: #999;
								}
				
							}
						}
					}
				}
			
		}
	}
	.wu-content{
		padding: 100upx 0;
		text-align: center;
		.image{
			width: 400upx;
			margin: 0 auto;
			image{
				width: 80%;
				margin: 0 auto;
			}
			.cont {
			    display: block;
			    text-align: center;
			    font-size: 30rpx;
			    color: #999;
			    margin-top: 20rpx;
			}
		}
	}
</style>