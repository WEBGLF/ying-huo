<template>
	<view class="box">
		<view class="nav-title">
			<u-tabs :list="list" name="cate_name" :current="current" @change="change" active-color="#ff0000"
				gutter='45'></u-tabs>
		</view>
		<scroll-view scroll-y="true" class="scr-box" v-if="info">
			<view class="wrapper" v-for="item,index in dataArr" :key="item.order_id">
				<view class="order-box">
					<view class="order-header">
						<view class="t-l">商品列表</view>
						<view class="t-r"><text class="cont" v-text="item.pay_status.text"></text> </view>
					</view>
				</view>
				<!-- 第二 -->
				<view class="order-box b-f">
					<view class="order-cont">
						<view class="order-time"><text v-text="'订单号 : '+item.order_no"></text> </view>
						<view class="order-time"><text v-text="item.create_time"></text> </view>
					</view>
				</view>
			<!-- 商品详情 -->
			<view class="order-box order-img_list">
				<view class="order-shop" @click="goOrderDef(item.order_id)">
					<view class="dis-flex">
						<view class="left">
							<view class="order-shop-left">
								<image :src="item.goods[0].image.file_path" ></image>
							</view>
						</view>
						<view class="right">
							<view class="goods-number" v-text="'共'+item.goods[0].total_num+'件'">
							</view>
							<u-icon name="arrow-right" color="#777" size="28"></u-icon>
						</view>
					</view>
				</view>
				
			</view>
		<!-- 底部 -->
		<view class="order-box b-f">
			<view class="order-cont">
				<view class="order-time"> <view class="" >
					<text>合计:</text>
					<text v-text="' ￥'+item.total_price" style="color: #ff495e;font-weight: 700;"></text>
				</view> </view>
				<view class="order-time">
					<view class="btn-default" @click="goBacks(item.order_id)">
						取消
					</view>
					<view class="btn-main" @click="goPay">
						付款
					</view>
				</view>
			</view>
		</view>
			</view>
		</scroll-view>
		<view class="yoshop-notcont" v-else>
		<view class="immg">
			<image src="../../static/wallet.png" mode="widthFix"></image>
		</view>
		<view class="cont">
			亲，您还没有订单消息哦！
		</view>
		</view>
		<!-- 购买弹窗 -->
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
				list: [{
					cate_name: '全部订单',
					type: 'all'
				}, {
					cate_name: '待付款',
					type: 'payment'
				}, {
					cate_name: '待发货',
					type: 'delivery'

				}, {
					cate_name: '待收货',
					type: 'received'
				}],
				current: 0, //选择那个
				info: false,
				dataArr: [],
				isShow:false,//显示购买弹窗
				isBack:false,//显示取消弹窗
				order_id:0,
			};
		},
		onLoad(options) {
			this.current = options.id;
			const type = this.list[this.current].type;
			this.getData(type);
		},
		onShow() {
         const type = this.list[this.current].type;
		this.getData(type);
		},
		methods: {
			change(index) {
				this.current = index;
				const type = this.list[index].type;
				this.getData(type);
			},
			getData(type) {
				this.$ajax({
					url: this.$urls.baseOrderList(type)
				}).then(res => {
					console.log(res.data.data.list);
					if (res.data.data.list.length > 0) {
						this.dataArr = res.data.data.list;
						this.info = true;
					} else {
						this.info = false;
					}

				})
			},
			goPay(){
			this.isShow=true;	
			},
			goBacks(order_id){
				this.order_id = order_id;
				this.isBack=true;
			},
			delOneOrder(){
			this.$ajax({
				url:this.$urls.baseOrderDel,
				method:'POST',
				data:{
					wxapp_id: 10021,
					token:this.token ,
					order_id:this.order_id ,
				}
			}).then(res=>{
				const type = this.list[this.current].type;
				this.getData(type);
			})
			
			},
			goOrderDef(id){
				uni.navigateTo({
					url: `/subpackages/OrderDef/OrderDef?id=${id}`,

				});
			}
		},
	}
</script>

<style lang="scss" scoped>
	.box {
		padding-top: 90upx;

		.nav-title {
			width: 100vw;
			box-sizing: border-box;
			height: 90upx;
			border-bottom: 1rpx solid #e4e4e4;
			display: flex;
			background: #fff;
			position: fixed;
			top: 0;
			z-index: 100;
		}

		.scr-box {
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
						align-items: center;
						 .left {
						    flex: 4;
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
							flex: 1;
							display: flex;
							.goods-number {
							    font-size: 28rpx;
							    color: #777;
							}
						}
					}
				}
			}
		
			
			}
		}
	}
	.yoshop-notcont {
	    margin: 90rpx 100rpx;
		.immg{
			text-align: center;
			image{
				margin: 0 auto;
				width: 200upx;
				
			}
		}
		 .cont {
		    display: block;
		    text-align: center;
		    font-size: 30rpx;
		    color: #999;
		    margin-top: 20rpx;
			
		}
		
	}
</style>