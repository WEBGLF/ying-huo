<template>
	<view class="box" v-if="isShow">
		<view class="search">
			<u-search :show-action="false" input-align="center" bg-color="#FFFFFF" shape="square" height="72"
				placeholder="搜索商品" @focus="goSearch"></u-search>
		</view>
		<view class="swiper">
			<u-swiper :list="list" :effect3d="true" height="400" interval="3000" duration="1000"></u-swiper>
		</view>

		<view class="new-pin">
			<view class="new-title">
				新品推荐
			</view>

			<view class="new-scroll">
				<scroll-view scroll-x="true" class="scroll-v">
					<view class="list-scroll" v-for="item,index in dataObj.newest" :key="item.goods_id" @click="goShopXq(item.goods_id)">
						<view class="nav-img">
							<image :src="item.image[0].file_path"></image>
						</view>
						<view class="new-name" v-text="item.goods_name">
						</view>
						<view class="new-name new-name1" v-text="'￥'+ item.spec[0].goods_price">
						</view>
					</view>
				</scroll-view>
			</view>

		</view>

		<view class="title-hrbg">
			<text style="color: rgba(0,0,0,0.1);">—————</text>
			<image src="../../static/hot.png" mode="widthFix" style="width: 30upx;"></image> <text>猜你喜欢</text><text
				style="color: rgba(0,0,0,0.1);">—————</text>
		</view>

		<view class="care-list">
			<view class="care-listarr" v-for="item,index in dataObj.best" @click="goShopXq(item.goods_id)" :key="item.goods_id">
				<image :src="item.image[0].file_path" style="width: 100%;height: 375upx;"></image>
				<view class="cont">
					<text class="name-img" v-text="item.goods_name"></text>
					<text class="img-price" v-text="'￥'+item.spec[0].goods_price"></text>
				</view>

			</view>
		</view>
		<view class="title-footer">
			<text style="color: rgba(0,0,0,0.1);">—————</text> 我是有底线的<text style="color: rgba(0,0,0,0.1);">—————</text>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				isShow: false,
				dataObj: {},
				list: [{
						image: '',
					},
					{
						image: '',

					},
					{
						image: '',

					}
				]
			}
		},
		onLoad(options) {
			this.getData()

		},
		methods: {
			// 跳转搜索
			goSearch() {
				uni.navigateTo({
					url: '/subpackages/search/search',
					animationType: 'fade-in',
					animationDuration: 1000
				});
			},
			// 网络请求
			getData() {
				this.dataObj = {},
					this.$ajax([{
						url: this.$urls.baseIfo
					}, {
						url: this.$urls.baseIndexPage
					}]).then(res => {
						console.log(res[1].data.data);
						this.dataObj = res[1].data.data;
						this.list[0].image = res[1].data.data.items.n284962404126371.data.n014379047407619.imgUrl;
						this.list[1].image = res[1].data.data.items.n284962404126371.data.n47614158436841.imgUrl;
						this.list[2].image = res[1].data.data.items.n284962404126371.data.n9594455402878554.imgUrl;

						this.isShow = true;
						uni.stopPullDownRefresh();
					})
			},
			goShopXq(id){
				uni.navigateTo({
					url: `/subpackages/shopXq/shopXq?id=${id}`,
				});
			}

		},

		onPullDownRefresh() {
			this.getData();

		}
	}
</script>

<style lang="scss" scoped>
	.search {
		position: unset;
		padding: 10px 24rpx;
	}

	.swiper {
		height: 420upx;
	}

	.new-pin {
		background: #fff;

		.new-title {
			height: 100upx;
			line-height: 100upx;
			font-weight: 700;
			margin-left: -10upx;
			text-align: center;
			font-size: 36upx;
			font-weight: 900;
			text-shadow: -2upx 2upx #bbb;
		}

		.new-scroll {
			padding: 0 12px 0px 12px;

			.scroll-v {
				width: 100%;
				display: flex;
				flex-direction: row;
				flex-wrap: nowrap;
				justify-content: left;
				white-space: nowrap;

				.list-scroll {
					display: inline-block;
					width: 166upx;
					margin-right: 20upx;

					.nav-img {
						border: 1upx solid #f2f2f2;
						border-radius: 8upx;
						overflow: hidden;
						width: 166upx;
						height: 166upx;

						& image {
							width: 100%;
							height: 100%;
						}
					}

					.new-name {
						text-align: center;
						font-size: 26rpx;
						margin: 10upx 0rpx;
						width: 100%;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					.new-name1 {
						color: #ff495e !important;
						font-size: 33rpx;
					}
				}
			}
		}
	}

	.title-hrbg {
		position: relative;
		z-index: 1;
		height: 80rpx;
		line-height: 80rpx;
		display: flex;
		align-items: center;
		overflow: hidden;
		color: #888;
		text-align: center;
		justify-content: center;
	}

	.care-list {
		display: flex;
		justify-content: space-around;
		box-sizing: border-box;
		flex-wrap: wrap;

		.care-listarr {
			background-color: #fff;
			box-sizing: border-box;
			width: 48%;
			margin-bottom: 10upx;
		}

		.cont {
			padding: 0 12rpx;

			.name-img {
				height: 76upx;
				line-height: 38upx;
				display: -webkit-box;
				word-break: break-all;
				text-overflow: ellipsis;
				overflow: hidden;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
			}

			.img-price {
				color: #ff495e !important;
				font-weight: 700;
				font-size: 34rpx;
			}
		}
	}

	.title-footer {
		position: relative;
		z-index: 1;
		height: 80rpx;
		line-height: 80rpx;
		overflow: hidden;
		color: #888;
		text-align: center;
		margin: 0 18rpx 0;
	}
</style>