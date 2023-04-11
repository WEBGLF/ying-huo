<template>
	<view class="box">
		<view class="wechatapp ">
			<view class="header">
				<open-data class="" type="userAvatarUrl"></open-data>
			</view>
		</view>
		<view class="auth-title">申请获取以下权限</view>
		<view class="auth-subtitle">获得你的公开信息（昵称、头像等）</view>
		<view class="u-bot">
			<u-button type="success" :ripple="true" shape="circle" @click="getUserInfo">授权登录</u-button>
		</view>
		<view class="">
			<u-button type="error" :ripple="true" shape="circle" @click="goMain">暂不登录</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				wxcode: null,
			};
		},
		onLoad() {

			uni.login({
				provider: 'weixin',
				univerifyStyle: {
					fullScreen: true
				},
				success: (res) => {
					console.log(res)
					this.wxcode = res.code
				}
			})
		},
		methods: {
			goMain() {
				uni.switchTab({
					url: '/pages/user/user'
				});
			},
			getUserInfo() {
				uni.getUserProfile({
					// 显示用户信息的语言
					lang: 'zh_CN',
					// 声明获取用户个人信息后的用途，不超过30个字符
					desc: '获取用户基本信息',
					// 接口调用成功回调函数
					success: (userInfo) => {
						// 获取信息
						console.log(userInfo);
						uni.setStorage({
							key: 'userinfo',
							data: userInfo,
						});
						// 登录接口
						this.getLogin(userInfo);
					},
				})
			},
			getLogin(e) {
				this.$ajax({
					url: this.$urls.baseLogin,
					method: "POST",
					data: {
						code: this.wxcode,
						user_info: e.rawData,
						encrypted_data: e.encryptedData,
						iv: e.iv,
						signature: e.signature,
						token: '',
						wxapp_id: 10021
					}
				}).then(res => {
				
					// 记录token user_id 登录成功
					uni.$emit('gettoken',res.data.data.token);
					uni.setStorageSync('token', res.data.data.token);
					uni.setStorageSync('user_id', res.data.data.user_id);
						uni.setStorageSync('login', true);
						uni.switchTab({
							url:'/pages/user/user'
						})
				})
			}

		},
	}
</script>

<style lang="scss" scoped>
	.box {
		padding: 0 40upx;
	}

	.wechatapp {
		padding: 80rpx 0 48rpx;
		border-bottom: 1rpx solid #e3e3e3;
		margin-bottom: 72rpx;
		text-align: center;

		.header {
			width: 190rpx;
			height: 190rpx;
			border: 2px solid #fff;
			margin: 0rpx auto 0;
			border-radius: 50%;
			overflow: hidden;
			box-shadow: 1px 0px 5px rgba(50, 50, 50, 0.3);
		}
	}

	.auth-title {
		color: #585858;
		font-size: 34rpx;
		margin-bottom: 40rpx;
	}

	.auth-subtitle {
		color: #888;
		margin-bottom: 88rpx;
		font-size: 28rpx;
	}

	.u-bot {
		margin-bottom: 20upx;
	}
</style>