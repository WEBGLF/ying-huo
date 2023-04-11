<template>
	<view class="box">
		<view class="fix-img">
			<image src="../../static/background/user-header2.png"></image>
		</view>
		<!-- 未登录 -->
		<view class="login-info" v-if="!islogin">
			<view class="order-info"  @click="goLogin">
				<image src="../../static/default-avatar.png" class="arve"></image>
				<view class="isgo">
					<view style="font-weight: 900;font-size: 33upx;margin-bottom: 10upx;">未登录</view>
					<view> 点击登录账号</view>
				</view>
			</view>
		</view>
		<!-- 已登录 -->
		<view class="login-info" v-else>
			<view class="order-info">
				<image :src="userInfo.avatarUrl" class="arve"></image>
				<view class="isgo">
					<view style="font-weight: 900;font-size: 33upx;margin-bottom: 10upx;">{{userInfo.nickName}}</view>
					<view>199****3520</view>
				</view>
			</view>
		</view>
		<view class="order-navbar">
			<view class="navbar-one">
				<view class="order-navbar-header" @click="order(0)">
					<text style="font-size: 30upx;">我的订单</text>
					<view class="order-right">
						<text>全部订单</text>
						<u-icon name="arrow-right" color="#666" size="26"></u-icon>

					</view>
				</view>

			</view>
			<view class="order-navbar-footer">
				<view class="flex-box" @click="order(0)">
					<view class="flex-img">
						<image src="../../static/order/status/wait_pay.png" mode="widthFix"></image>
					</view>
					<view class="order-navbar__name">
						全部订单
					</view>
				</view>
				<view class="flex-box" @click="order(1)">
					<view class="flex-img">
						<u-badge type="error" :count="getInfo.orderCount.payment" :offset='[0,40]' v-if="islogin" ></u-badge>
						<image src="../../static/order/status/close.png" mode="widthFix"></image>

					</view>
					<view class="order-navbar__name">
						待付款
					</view>
				</view>
				<view class="flex-box" @click="order(2)">
					<view class="flex-img">
					<u-badge type="error" :count="getInfo.orderCount.delivery" :offset='[0,40]' v-if="islogin" ></u-badge>
						<image src="../../static/order/status/wait_receipt.png" mode="widthFix"></image>

					</view>
					<view class="order-navbar__name">
						待发货
					</view>
				</view>
				<view class="flex-box" @click="order(3)">
					<view class="flex-img">
						<u-badge type="error" :count="getInfo.orderCount.received" :offset='[0,40]' v-if="islogin"></u-badge>
						<image src="../../static/order/status/received.png" mode="widthFix"></image>

					</view>
					<view class="order-navbar__name">
						待收货
					</view>
				</view>
			</view>
		</view>

		<view class="content">
			<view class="oneContent" @click="goAddress">
				<view class="left-oneContent">
					<text><u-icon name='map' size="38"></u-icon></text><text>收货地址</text>
				</view>
				<view class="">
					<u-icon name="arrow-right" color="#666" size="26"></u-icon>
				</view>
			</view>
			<view class="oneContent" @click="showDal">
				<view class="left-oneContent">
					<text><u-icon name='question-circle' size="38"></u-icon></text><text>我的帮助</text>
				</view>
				<view class="">
					<u-icon name="arrow-right" color="#666" size="26"></u-icon>
				</view>
			</view>
			<view class="oneContent" @click="showDal">
				<view class="left-oneContent">
					<text><u-icon name='kefu-ermai' size="38"></u-icon></text><text>联系客服</text>
				</view>
				<view class="">
					<u-icon name="arrow-right" color="#666" size="26"></u-icon>
				</view>
			
			</view>
		</view>
<!-- 是否退出 -->
			<view class="tui" v-if="islogin">
				<u-button shape="circle" type="error" :ripple="true" @click="backTui" >退出登录</u-button>
			</view>
		<!-- 显示弹框 -->
		<u-modal v-model="show" :content="content" title="温馨提示" show-cancel-button="true" cancel-text="在逛逛"
			confirm-text="去登录" @confirm="goLogin"></u-modal>
		<!-- 登录否 -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				islogin: uni.getStorageSync('login'),
				show: false,
				content: "您还未登录,请先登录",
				userInfo: {},
				getInfo:{},
			}
		},
		onShow() {
			this.userInfo = uni.getStorageSync('userinfo').userInfo;
			this.islogin = uni.getStorageSync('login');
			if(this.islogin&&!this.getInfo.orderCount){
				// 获取地址收货信息
				this.$ajax({
					url:this.$urls.baseUserInfo
				}).then(res=>{
					this.getInfo = res.data.data
				})
			}
		},
		methods: {
			showDal() {
				if (!this.islogin) {
					this.show = true
				}else{
					
				}

			},
			// 登录
			goLogin() {
				uni.navigateTo({
					url: '/subpackages/login/login',

				});
			},
			// 退出登录
			backTui(){
				this.islogin = false;
					uni.$emit('changeGo',0);
					uni.setStorageSync('login', false);
					uni.removeStorageSync('token');
					uni.removeStorageSync('user_id');
					uni.removeStorageSync('userinfo');
			},
			//去订单
			order(index){
				if(this.islogin){
					uni.navigateTo({
						url: `/subpackages/Order/Order?id=${index}`,
					
					});
				}else{
					this.showDal()
				}
			},
			// 去地址
			goAddress(){
				if (!this.islogin) {
					this.show = true
				}else{
					uni.navigateTo({
						url: '/subpackages/address/address',
					});
					
				}
				
			}


		},
		components: {}
	}
</script>

<style lang="scss" scoped>
	.box {
		position: relative;

		.fix-img {
			width: 100vw;
			height: 400upx;
			position: fixed;
			top: 0;
			left: 0;
			z-index: -1;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.login-info {
			position: fixed;
			top: 130upx;
			z-index: 1;
			padding: 0 30upx;

			.order-info {
				display: flex;
				flex-direction: row;
				align-items: center;

				.arve {
					width: 120rpx;
					height: 120rpx;
					border-radius: 50%;
				}

				.isgo {
					margin-left: 30upx;
					color: #D2AC6E;
				}
			}

		}

		.order-navbar {
			position: fixed;
			top: 300upx;
			left: 2.5vw;
			width: 95%;
			box-shadow: 0 1rpx 5rpx 0px rgba(0, 0, 0, 0.05);
			font-size: 30rpx;
			border-top: 1rpx solid #eee;
			border-radius: 5rpx;
			background: #fff;
			z-index: 10;

			.navbar-one {
				padding: 20upx 10upx;

				.order-navbar-header {
					box-sizing: border-box;
					display: flex;
					margin: auto;
					padding-bottom: 10rpx;
					width: 91%;
					height: 70rpx;
					border-bottom: 1px solid #eee;
					justify-content: space-between;
					align-items: center;
				}

				.order-right {
					color: #666;
					font-size: 24upx;
				}
			}

		}
	}

	.order-navbar-footer {
		width: 100%;
		padding-bottom: 20upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;

		.flex-box {
			flex: 1;
			text-align: center;

			.order-navbar__name {
				display: block;
				font-size: 24rpx;
				color: #666;
			}

			.flex-img {
				position: relative;
				image {
					width: 80upx;
				}
			}
		}
	}

	.content {
		top: 570upx;
		position: fixed;
		background-color: #fff;
		width: 100%;

		.oneContent {
			display: flex;
			align-items: center;
			padding: 28rpx 28rpx;
			border-bottom: 1rpx solid #eee;
			box-sizing: border-box;
			justify-content: space-between;

			.left-oneContent {
				font-size: 33upx;

				text {
					margin-right: 20upx;
				}
			}
		}

	}
	.tui{
		margin: 0 auto;
		margin-top: 900upx;
		width: 60%;
		
	}
</style>