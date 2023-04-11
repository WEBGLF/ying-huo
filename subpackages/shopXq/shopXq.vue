<template>
	<view class="box" v-if="isShow">
		<view class="image-swiper">
			<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="500" :current="current"
				circular='1' style="width: 100%;height: 700upx;" @change="changeIndex">
				<swiper-item v-for='item,index in dataObj.detail.image' :key="item.id" @click="bigImg">
					<image class="slide-image" :src="item.file_path" style="width: 100%;height: 100%;"
						mode='aspectFill'></image>
				</swiper-item>
			</swiper>

		</view>
		<!-- 价钱数量 -->
		<view class="content-nav">
			<view class="navone">
				<text class="title" v-text="dataObj.detail.goods_name"></text>
				<text v-text="'销量: '+ dataObj.detail.goods_sales" class="xiaol"></text>
			</view>
			<view class="money-box">
				<text class="num" v-text="'￥'+numObj.goods_price"></text>
				<text class="del" v-text="'￥'+numObj.line_price"></text>
			</view>
			<view class="navone">
				<text v-text="'库存: '+ numObj.stock_num" class="xiaol"></text>
			</view>
		</view>

		<!-- 规格 -->
		<view class="goods-property-box">
			<uni-collapse ref="collapse" v-model="value">
				<uni-collapse-item :title="'已选 '+count+' 个'">
					<view class="content-two">
						<view class="content-boxs" v-for="item,index in dataObj.specData.spec_attr" :key="item.group_id"
							v-if="dataObj.specData">
							<view class="tipstxt" v-text="item.group_name"></view>
							<view class="cartypelist">
								<view :class="item.checked==v? 'cartypeitem cur' :'cartypeitem' "
									v-for="i,v in item.spec_items" :key="i.item_id" v-text="i.spec_value"
									@click="changeTabs(index,v,i.item_id)">
								</view>
							</view>
						</view>
						<view class="content-boxs">
							<view class="tipstxt">购买数量</view>
							<u-number-box v-model="count" :min='1'></u-number-box>
						</view>
					</view>
				</uni-collapse-item>
			</uni-collapse>


		</view>
		<!-- 返回顶部 -->
		<u-back-top :scroll-top="scrollTop" bottom='150'></u-back-top>

		<!-- 商品描述 -->
		<view class="p-bottom">
			<view class="m-top20">
				<view class="top-nav-bar">
					商品描述
				</view>
				<view class="good-const-list">
					<mp-html :content="dataObj.detail.content" />
				</view>
			</view>
		</view>
		<!-- 底部导航 -->
		<view class="bottom">
			<uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick"
				@buttonClick="buttonClick" />
		</view>
		<u-modal v-model="show" content="暂不支持该会话" title="温馨提示" confirm-text="返回"></u-modal>
		<!-- 删除弹框 -->
			<u-modal v-model="kuang" content="您还未登录"  ></u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				kuang:false,
				show: false,
				scrollTop: 0, //判断顶部
				dataObj: {}, //数据
				isShow: false,
				current: 0,
				numObj: {}, //价钱销量等
				count: 1, //购买数量
				token: uni.getStorageSync('token'), //得到token
				value: ['0'],
				options: [{
					icon: 'headphones',
					text: '客服'
				}, {
					icon: 'cart',
					text: '购物车',
					info: 0
				}],
				buttonGroup: [{
						text: '加入购物车',
						backgroundColor: '#ff0000',
						color: '#fff'
					},
					{
						text: '立即购买',
						backgroundColor: '#ffa200',
						color: '#fff'
					}
				],
				id:0
			};
		},
		onLoad(options) {
			const {
				id
			} = options;
			this.id = id;
			this.getData(id);
		},
		methods: {
			getData(id) {
				this.$ajax({
					url: this.$urls.baseShopXq(id)
				}).then(res => {
					if (res.data.data.specData) {
						res.data.data.specData.spec_attr.map(item => {
							item.checked = 0
						});
					}

					this.numObj = res.data.data.detail.spec[0];
					this.dataObj = res.data.data;
					this.isShow = true;
					console.log(this.dataObj);
				})
			},
			bigImg() {
				const imgArr = this.dataObj.detail.image.map(item => item.file_path);
				// 预览图片
				uni.previewImage({
					urls: imgArr,
					current: this.current,
					loop: true,
				});
			},
			changeIndex(e) {
				this.current = e.detail.current

			},
			changeTabs(Findex, index, id) {
				// 每次点击将改变选择
				this.dataObj.specData.spec_attr[Findex].checked = index;
				// 改变价钱等
				let a1 = this.numObj.spec_sku_id.split('_');
				a1[Findex] = id;
				const a2 = a1.join('_');
				const a3 = this.dataObj.detail.spec.filter(item => item.spec_sku_id == a2);
				this.numObj = a3[0]
			},
			onClick(e) {
				if (e.index == 0) {
					this.show = true
				} else if (e.index == 1) {
					uni.switchTab({
						url: '/pages/cart/cart'
					});
				}
			},
			buttonClick(e) {
				if (e.index == 0) {
					if(this.token){
						this.getAdd();
					}else{
						this.kuang=true
					}
					
				} else if (e.index == 1) {
                    if(this.token){
                    	// 跳到确认
						uni.navigateTo({
							url: `/subpackages/Confirm/Confirm?id=${this.id}&num=${this.count}&sku_id=${this.numObj.spec_sku_id}`,
					
						});
						
                    }else{
                    	this.kuang=true
                    }
				}
			},
			getAdd() {
				let _this = this;
				this.$ajax({
					url: this.$urls.baseCartAdd,
					method: 'POST',
					data: {
						wxapp_id: 10021,
						token: this.token,
						goods_id: this.dataObj.detail.goods_id,
						goods_num: this.count,
						goods_sku_id: this.numObj.spec_sku_id,
					}
				}).then(res => {
					this.options[1].info = res.data.data.cart_total_num;
					console.log(res.data.msg);
				     if(res.data.msg=='加入购物车成功'){
						 uni.showToast({
						 	title: '添加成功',
						 	duration: 1000
						 });
					 }else{
						 uni.showToast({
						 	title:res.data.msg,
							icon:'none',
						 	duration: 1000
						 });
					 }
				})
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		}
	}
</script>

<style lang="scss" scoped>
	.content-nav {
		padding: 20rpx;
		background-color: #fff;

		.navone {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.title {
				display: -webkit-box;
				word-break: break-all;
				text-overflow: ellipsis;
				overflow: hidden;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
			}

			.xiaol {
				color: #888;
				font-size: 24upx;
			}
		}

		.money-box {
			margin-top: 10rpx;

			.num {
				color: #ff495e;
				font-size: 40rpx;
				margin-top: 10rpx;
			}

			.del {
				font-size: 24rpx;
				color: #999;
				margin-left: 6rpx;
				text-decoration: line-through;
			}

		}

	}

	.goods-property-box {
		position: relative;
		margin-top: 20upx;
	}

	.content-two {
		padding: 20rpx 12px;
		border-top: 1rpx solid #eee;

		.content-boxs {
			.tipstxt {
				font-size: 28rpx;
				color: #888;
				margin-bottom: 10rpx;
			}

			.cartypelist {
				display: inline-block;

				.cartypeitem {
					position: relative;
					display: inline-block;
					overflow: hidden;
					height: 60rpx;
					font-size: 31rpx;
					line-height: 60rpx;
					padding: 0 30rpx;
					margin: 0 20rpx 20rpx 0;
					border: 1rpx solid #f3f2f8;
					background: #f3f2f8;
					border-radius: 10rpx;
					color: #444;
				}

				.cur {
					background: #ff495e;
					color: #fff;
					border: 1rpx solid #ff495e;
				}
			}
		}
	}

	.p-bottom {
		padding-bottom: 60rpx;

		.m-top20 {
			margin-top: 25rpx;
			background-color: #fff;
			border-bottom: 1rpx solid #eee;

			.top-nav-bar {
				display: flex;
				flex-wrap: wrap;
				padding: 12px;
				font-size: 31rpx;
			}
		}
	}

	.bottom {
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 99;
		width: 100%;
	}
</style>