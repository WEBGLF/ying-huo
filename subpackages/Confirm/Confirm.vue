<template>
	<view class="box">
		<view class="flow-checkout-header dis-flex" @click="goAddress">
			<view class="padding-box">
				<view class="one">
					<u-icon name="map" color="#888" size="40"></u-icon>
				</view>
				<view class="two">
					<view class="col-3">
						<text v-text="xqObj.address.name+'  '+xqObj.address.phone"></text>
					</view>
					<view class="checkout-address"
						v-text="xqObj.address.region.city+' '+xqObj.address.region.province+' '+xqObj.address.region.region+' '+xqObj.address.detail">

					</view>
				</view>
				<view class="three">
					<u-icon name="arrow-right" color="#888" size="30"></u-icon>
				</view>

			</view>
		</view>
		<!-- 商品列表 -->
		<view class="box-list">
			<view class="checkout_list" v-for="item,index in xqObj.goods_list" :key="item.goods_id">
				<!-- 商品详情 -->
				<view class="order-shop" @click="goShopXq(item.goods_id)">
					<view class="dis-flex">
						<view class="left">
							<view class="order-shop-left">
								<image :src="item.image[0].file_path"></image>
							</view>
						</view>
						<view class="right">
							<text class="h4" v-text="item.goods_name">
							</text>
							<text class="f-22" v-text="item.goods_sku.goods_attr"></text>
							<view class="goods-number">
								<text class="flow-cont" v-text="'￥ '+item.goods_price "></text>
								<text v-text="'x'+item.total_num"></text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 底部 -->
			<view class="order-box b-f">
				<view class="order-cont">
					<view class="order-time"> <text style="font-size: 28upx;font-weight: 600;"
							v-text="'共'+xqObj.order_total_num+'件商品,'"></text> </view>
					<view class="order-time">

						<text style="color:#ff495e;font-size: 28upx;font-weight: 600;"
							v-text="'合计:'+xqObj.order_total_price"></text>

					</view>
				</view>
			</view>
			<!-- 价钱 -->
			<view class="flow-all-money">
				<view class="flow-all-list">
					<text style="font-weight: 700;">订单金额</text>
				</view>
				<view class="listcon">
					<text>商品总金额：</text>
					<text style="color: #ff495e;" v-text="'￥'+xqObj.order_total_price"></text>
				</view>
				<view class="listcon">
					<text>配送费用：</text>
					<text style="color: #ff495e;" v-text="'￥'+xqObj.express_price"></text>
				</view>
			</view>
			<!-- 底部 -->
			<view class="O-bottom">
				<view class="left">
					<text>实付款:</text>
					<text style="color: #ff495e;font-weight: 700;" v-text="'￥'+xqObj.order_pay_price"></text>
				</view>
				<view class="right" @click="goPay">
					提交订单
				</view>
			</view>

			<!-- 支付 -->
			<u-modal v-model="isShow" content="mch_id参数格式错误" @confirm="goOr"></u-modal>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				xqObj: {},
				isShow: false,
				islogin: uni.getStorageSync('login'),
			};
		},
		onLoad(ops) {
			// 详情来的
			if (ops.id) {
				const {
					id,
					num,
					sku_id
				} = ops;
				this.getXq(id, num, sku_id);

			} else {
				// 购物车来的
				console.log('购物车');
				this.getCart();
			}

		},
		onShow() {

		},
		methods: {
			// 得到详情订单数据
			getXq(id, num, sku_id) {
				this.$ajax({
					url: this.$urls.baseOrderComm(id, num, sku_id)
				}).then(res => {
					console.log(res.data.data);
					this.xqObj = res.data.data;
				})
			},
			// 去详情
			goShopXq(id) {
				uni.navigateTo({
					url: `/subpackages/shopXq/shopXq?id=${id}`,
				});
			},
			goPay() {
				this.isShow = true;
			},
			goOr() {
				uni.navigateTo({
					url: `/subpackages/Order/Order?id=${0}`

				});
			},
			//得到商品数量
			getCart() {
				if (this.islogin) {
					this.$ajax({
						url: this.$urls.baseCartList
					}).then(res => {
						this.xqObj = res.data.data
					})
				}
			},
			// 去地址
			goAddress() {
				uni.navigateTo({
					url: '/subpackages/address/address',
				});
			}

		}
	}
</script>

<style lang="scss" scoped>
	.box {
		padding-bottom: 110upx;
	}

	.dis-flex {
		display: flex !important;

		.padding-box {
			width: 100%;
			padding: 0 34rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.two {
				width: 80%;

				.col-3 {
					color: #333;
					font-size: 30rpx;
					font-weight: 700;
				}

				.checkout-address {
					font-size: 26rpx;
					color: #777;
					margin-top: 6rpx;
					font-weight: 700;
				}
			}

		}
	}

	.box-list {
		margin-top: 25upx;

		.checkout_list {
			padding: 10px 15px 2px 15px;
			background: #fff;
			border-bottom: 1rpx solid #eee;

			.order-shop {
				padding: 16rpx 0 16rpx 0;

				.dis-flex {
					display: flex !important;

					.left {
						flex: 2;
						overflow: hidden;
						position: relative;

						.order-shop-left,
						.order-shop-left image {
							width: 160rpx;
							height: 160rpx;
							margin-right: 15rpx;
							display: inline-block;
							background: #fff;
						}
					}

					.right {
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

	.order-cont {
		background-color: #fff;
		display: flex;
		font-size: 30rpx;
		color: #777;
		padding: 15rpx 12px;
		justify-content: space-between;
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

		.listcon {
			font-size: 28rpx;
			padding: 10rpx 20upx;
			display: flex;
			justify-content: space-between;

			font-weight: 700;
		}
	}

	.O-bottom {
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: #fff;
		height: 100upx;
		width: 100%;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		box-shadow: -2px 2px 4px 2px rgba(0, 0, 0, 0.1);
		justify-content: space-between;
		z-index: 100;

		.right {
			background: linear-gradient(90deg, #FE6035, #EF1224);
			width: 30%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #fff;

		}

		.left {
			width: 60%;
			font-size: 32rpx;
			padding-left: 12px;
			display: flex;
			align-items: center;
		}
	}
</style>