<template>
	<view class="box">
<view class="flow-checkout-header dis-flex">
	<view class="padding-box">
		<view class="col-3">
			<text  v-text="dataObj.address.name"></text>
			<text class="col-m" v-text="dataObj.address.phone"></text>
		</view>
	<view class="flow-checkout-address" v-text="dataObj.address.region.city+' '+dataObj.address.region.province+' '+dataObj.address.region.region+' '+dataObj.address.detail">
		
	</view>
	</view>

</view>
<!-- 商品 -->
	<view class="wrapper" >
				<view class="order-box">
					<view class="order-header">
						<view class="t-l">商品列表</view>
						<view class="t-r"><text class="cont" v-text="dataObj.pay_status.text"></text> </view>
					</view>
				</view>
				<!-- 第二 -->
				<view class="order-box b-f">
					<view class="order-cont">
						<view class="order-time"><text v-text="'订单号 : '+dataObj.order_no"></text> </view>
						<view class="order-time"><text v-text="dataObj.create_time"></text> </view>
					</view>
				</view>
			<!-- 商品详情 -->
			<view class="order-box order-img_list">
				<view class="order-shop" >
					<view class="dis-flex">
						<view class="left">
							<view class="order-shop-left">
								<image :src="dataObj.goods[0].image.file_path" ></image>
							</view>
						</view>
						<view class="right">
							<text class="h4" v-text="dataObj.goods[0].goods_name">
							</text>
							<text class="f-22" v-text="dataObj.goods[0].goods_attr"></text>
							<view class="goods-number" >
								<text class="flow-cont" v-text="'￥ '+dataObj.goods[0].goods_price " ></text>
								<text v-text="'x'+dataObj.goods[0].total_num"></text>
							</view>
						</view>
					</view>
				</view>
				
			</view>
		<!-- 底部 -->
		<view class="order-box b-f">
			<view class="order-cont">
				<view class="order-time"> <text style="font-size: 28upx;font-weight: 600;" v-text="'共'+dataObj.goods[0].total_num+'件商品,'"></text> </view>
				<view class="order-time">
					
					<text style="color:#ff495e;font-size: 28upx;font-weight: 600;" v-text="'合计:'+dataObj.goods[0].goods_price"></text>
					
				</view>
			</view>
		</view>
			</view>
			<!-- 价钱 -->
			<view class="flow-all-money">
				<view class="flow-all-list">
					<text style="font-weight: 700;">订单金额</text>
				</view>
				<view class="listcon">
					<text>商品金额：</text>
					<text style="color: #ff495e;" v-text="'￥'+dataObj.goods[0].goods_price"></text>
				</view>
				<view class="listcon">
					<text>配送费用：</text>
					<text style="color: #ff495e;" v-text="'￥'+dataObj.express_price"></text>
				</view>
				<view class="listcon">
					<text>应付金额：</text>
					<text style="color: #ff495e;" v-text="'￥'+dataObj.pay_price"></text>
				</view>
			</view>
<view class="O-bottom">
	<view>
	</view>
	<view class="boton">
	<u-button shape="circle"  size="medium"  hover-class="none"  @click="goBack">取消</u-button>
		<u-button shape="circle" type="error"  size="medium" @click="goPay">去支付</u-button>
	</view>
</view>
<!-- 支付 -->
		<u-modal v-model="isShow" content="mch_id参数格式错误" ></u-modal>
		<!-- 取消弹窗 -->
		<u-modal v-model="isBack" content="确认取消订单?" :show-cancel-button="true" @confirm='delOneOrder'></u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			token:uni.getStorageSync('token'),
             dataObj:{},
			 id:0,
			 isShow:false,//显示购买弹窗
			 isBack:false,//显示取消弹窗
			}
		},
		onLoad(ops){
			this.id = ops.id;
			this.getData(ops.id);
		},
		methods: {
  getData(id){
	  this.$ajax({
		  url:this.$urls.baseOrderXq(id)
	  }).then(res=>{
		  this.dataObj = res.data.data.order
	  })
  },
  goPay(){
	  this.isShow = true
  },
  goBack(){
	  this.isBack = true
  },
  // 删除订单
	delOneOrder(){
			this.$ajax({
				url:this.$urls.baseOrderDel,
				method:'POST',
				data:{
					wxapp_id: 10021,
					token:this.token ,
					order_id:this.id ,
				}
			}).then(res=>{
				uni.navigateBack();
			})
			
			},
  
		},
	}
</script>

<style scoped lang="scss">
	
	.dis-flex {
	    display: flex !important;
		.padding-box {
		    padding: 0 24rpx;
		    box-sizing: border-box;
			.col-3 {
				    font-size: 26rpx;
			    color: #333;
				.col-m {
				    color: #ff495e !important;
				}
			}
			.flow-checkout-address {
			    font-size: 26rpx;
			    color: #777;
			    margin-top: 6rpx;
			}
		}
	}
	.wrapper {
		margin-top: 20upx;
		background: #fff;
	
		.order-box {
			padding: 0 15px;
	
			.order-header {
				padding-top: 10rpx;
				display: flex !important;
				font-weight: 700;
	
				.t-l {
					text-align: left;
					flex: 1;
				}
	
				.t-r {
					text-align: right;
					flex: 1;
	
					.cont {
						font-size: 30rpx;
						color: #fd4a5f;
					}
				}
			}
		}
	
		.b-f {
			.order-cont {
				padding: 15rpx 0;
				justify-content: space-between;
				display: flex !important;
	
				.order-time {
					display: flex;
					text {
						color: #777;
						font-size: 26rpx;
					}
					.btn-default {
					    border-radius: 4px;
					    border: 1rpx solid #ccc;
					    padding: 6rpx 20rpx;
					    font-size: 28rpx;
					    color: #555;
					    float: right;
					}
					.btn-main {
					    border-radius: 4px;
					    border: 1rpx solid #fd4a5f;
					    padding: 6rpx 20rpx;
					    font-size: 28rpx;
					    color: #fd4a5f;
					    margin-left: 10rpx;
					    float: right;
					}
	
				}
			}
		}
	
	.order-img_list {
	    background: #fff;
	    border-top: 1rpx solid #f1f1f1;
	    border-bottom: 1rpx solid #f1f1f1;
		.order-shop {
		    padding: 16rpx 0 16rpx 0;
			.dis-flex {
			    display: flex !important;
				 .left {
				    flex: 2;
				    overflow: hidden;
				    position: relative;
					.order-shop-left, .order-shop-left image {
					    width: 160rpx;
					    height: 160rpx;
					    margin-right: 15rpx;
					    display: inline-block;
					    background: #fff;
					}
				}
				.right{
					flex: 4;
					display: flex;
					flex-wrap: wrap;
					.h4 {
						width: 100%;
					    font-size: 30rpx;
					    color: #333;
					    display: -webkit-box;
					    word-break: break-all;
					    text-overflow: ellipsis;
					    overflow: hidden;
					    -webkit-box-orient: vertical;
					    -webkit-line-clamp: 2;
					}
					.f-22 {
							width: 100%;
					    font-size: 22rpx;
						    color: #777;
					}
					.goods-number {
						width: 100%;
						box-sizing: border-box;
					    font-size: 28rpx;
					    color: #777;
						padding-top: 10rpx;
						display: flex;
						justify-content: space-between;
						.flow-cont {
						    font-size: 30rpx;
						    color: #ff495e;
						}
					}
					
				}
			}
		}
	}

	}
	.flow-all-money {
	    padding: 8px 12px;
	    color: #444;
	    margin-top: 25rpx;
		background-color: #fff;
		.flow-all-list {
		    font-size: 30rpx;
		    padding: 20rpx 0;
		    border-bottom: 1rpx solid #f1f1f1;
		}
		.listcon{
    font-size: 28rpx;
    padding: 10rpx 20upx ;
	display: flex;
	justify-content: space-between;

	 font-weight: 700;
}
	}
	.O-bottom{
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: #fff;
		height: 100upx;
		width: 100%;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		box-shadow: -2px 2px 4px 2px rgba(0,0,0,0.1);
		view{
			flex: 1;
		}
		.boton{
			display: flex;
			justify-content: space-around;
			flex: 2;
		}
	}
	
</style>