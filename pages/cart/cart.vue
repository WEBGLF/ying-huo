<template>
	<view class="box">
		<view class="content" v-if="tabbarIndex==0">
			<image src="../../static/empty.png" mode="widthFix"></image>
			<text>{{islogin ? '您的购物车是空的,快去逛逛吧':'你还未登录'}}</text>
			<view class="" style="margin-top: 30upx;">
				<u-button type="error" shape="circle" :ripple="true" size="medium"
					@click="goSouye">{{islogin ? '去逛逛':'去登录'}}</u-button>
			</view>
		</view>
		<view class="cartlist" v-else>
			<view class="cart-nav">
				共<text style="color: #ff0000;">{{dataObj.order_total_num}}</text>件商品
			</view>
			<view class="cart-box">
				<u-swipe-action :options="options" @click="delShop(item)" class="swi" v-for="item,index in dataObj.goods_list" :index="index" :key="item.goods_id" bg-color='#F1F1F2' >
					<view class="cartcont">
						<view class="cart-img">
						<image :src="item.image[0].file_path"  ></image>
						</view>
						<view class="cart-right">
							<view class="twolist-hidden" v-text="item.goods_name">
							</view>
							<view class="goods-gg">
								<text class="col-7" v-text="item.goods_sku.goods_attr"></text>
							</view>
							<view class="wx-goods_price">
								<text class="dish-item-money" v-text="'￥'+item.goods_price"></text>
							</view>
						<view class="num-box">
							<view class="">
								<u-button size="mini"  @click="pev(item,index)" :disabled='item.total_num<=1'  ><u-icon name="minus"></u-icon></u-button>
							</view>
							<view class="">
								 <u-button size="mini" disabled='1' v-text="item.total_num" style="margin: 0 0upx;"  ></u-button>
							</view>
				             <view class="">
				             		<u-button size="mini" @click="add(item,index)" ><u-icon name="plus"></u-icon></u-button>
				             </view>
							
						</view>
						</view>
					</view>
				</u-swipe-action>
			</view>
		
		</view>
		<view class="cart-tab-wrp" v-if="!tabbarIndex==0" >
			<view class="bot-allprice">
				<text class="cart-item-total-price" v-text="'合计: ￥'+dataObj.order_total_price"></text>
			</view>
			<view class="">
				<u-button type="error" shape="circle" :ripple="true" @click="goPays" >去结算</u-button>
			</view>
		</view>
		<!-- 删除弹框 -->
			<u-modal v-model="kuang" content="您确定要移除当前商品吗?" :show-cancel-button="true" @confirm='delOneShop'></u-modal>
	</view>
</template>

<script>
	const app = getApp();
	export default {
		data() {
			return {
				kuang:false,
				islogin: uni.getStorageSync('login'),
				tabbarIndex: app.globalData.tabbarIndex,
				dataObj: {},
				options: [
					{
						text: '删除',
						style: {
							backgroundColor: '#dd524d'
						}
					}
				],
				token:uni.getStorageSync('token'),
				delObj:{},
			};
		},
		onLoad() {

		},
		onShow() {

			this.islogin = uni.getStorageSync('login');
			this.tabbarIndex = app.globalData.tabbarIndex;
			this.getCart();

		},
		methods: {
			goSouye() {
				if (this.islogin) {
					uni.switchTab({
						url: '/pages/index/index',
					});
				} else {
					uni.navigateTo({
						url: '/subpackages/login/login',
					});
				}

			},
			//得到商品数量
			getCart() {
				if (this.islogin) {
					this.$ajax({
						url: this.$urls.baseCartList
					}).then(res => {
						this.dataObj = res.data.data

						uni.$emit('changeGo', this.dataObj.order_total_num);
						this.tabbarIndex = app.globalData.tabbarIndex;

					})
				}
			},
			delShop(item){
				this.delObj = item;
				this.kuang = true;
			},
			// 删除商品
			delOneShop(){
				console.log(this.delObj);
				const item = this.delObj;
				this.$ajax({
					url:this.$urls.baseCartDelete,
					method:'POST',
					data:{
						wxapp_id: 10021,
						token:this.token ,
						goods_id: item.goods_id,
						goods_sku_id: item.goods_sku_id,
					}
				}).then(res=>{
				this.getCart();
				})
			},
		add(item,index) {
			// 找到 对应的数量
			this.dataObj.goods_list[index].total_num = this.dataObj.goods_list[index].total_num+1;
		this.getNum(item,this.$urls.baseCartAdd,'add');
	
			},
			pev(item,index){
				// 找到 对应的数量
					this.dataObj.goods_list[index].total_num = this.dataObj.goods_list[index].total_num-1;
				this.getNum(item,this.$urls.baseCartPev,'pev');
			
				
			},
			// 加减请求
			getNum(item,url,check){
				this.$ajax({
					url,
					method:'POST',
					data:{
						wxapp_id: 10021,
						token:this.token ,
						goods_id: item.goods_id,
						goods_num: 1,
						goods_sku_id: item.goods_sku_id,
					}
				}).then(res=>{
				   if(check=='add'){
					   // 总钱数
					   this.dataObj.order_total_price = this.dataObj.order_total_price*1+item.goods_sku.goods_price*1;
					   this.tabbarIndex++;
				   }else if(check=='pev'){
					    this.tabbarIndex--;
						this.dataObj.order_total_price = this.dataObj.order_total_price*1-item.goods_sku.goods_price*1;
				   }
					
					
				})
			},
			// 跳
			goPays(){
				// 跳到确认
				uni.navigateTo({
					url: `/subpackages/Confirm/Confirm`,				
				});
			}

		},
		watch: {
			tabbarIndex: {
				handler(newName, oldName) {
					uni.$emit('changeGo', newName);
				},
			}
		}
	}
</script>

<style lang="scss" scoped>
	.box{
		 padding-bottom: 110upx;
	}
	.content {
		text-align: center;
		padding-top: 150upx;
		image {
			width: 300upx;
		}

		text {
			display: block;
			text-align: center;
			font-size: 30rpx;
			color: #999;
			margin-top: 20rpx;
		}
	}

	.cartlist {
		box-sizing: border-box;

		.cart-nav {
			font-weight: 700;
			padding: 20upx 30upx;
			text-shadow: -2upx 2upx #bbb;
		}
		.cart-box{
		
			.swi{
				.cartcont{
					display: flex;
					width: 100%;
					box-sizing: border-box;
					background-color: #fff;
					padding: 20upx;
					border: 1rpx solid #eee;
					.cart-img{
						image{
							width: 200rpx;
							height: 200rpx;
							 margin: 0 auto;
						}
					}
					.cart-right{
						flex: 1;
						padding-left: 10upx;
						.twolist-hidden {
							font-weight: 700;
						    display: -webkit-box;
						    word-break: break-all;
						    text-overflow: ellipsis;
						    overflow: hidden;
						    -webkit-box-orient: vertical;
						    -webkit-line-clamp: 2;
						}
						.goods-gg{
								margin-top: 10upx;
							.col-7 {
							    color: #777;
							    font-size: 24rpx;
							}
						}
						.num-box{
							margin-top: 10upx;
							display: flex;
						}
						.wx-goods_price {
						    overflow: hidden;
							margin-top: 10upx;
							.dish-item-money {
							    color: #ff495e;
							    font-size: 32rpx;
							    padding: 0 0 10rpx 0;
								font-weight: 700;
							}
						}
					}
					
				}
			}
		}
	}
	.cart-tab-wrp {
	    height: 100rpx;
	    position: fixed;
	    bottom: 0rpx;
	    background: #fff;
	    border-top: 1rpx solid #ddd;
	    display: flex;
	    flex-direction: row;
		align-items: center;
	    width: 100%;
	    z-index: 10;
	    color: black;
		padding: 0 20upx;
		box-sizing: border-box;
		justify-content: space-between;
		
		.bot-allprice{
			.cart-item-total-price {
				font-weight: 700;
			    font-size: 32rpx;
			    color: #ff495e;
			    text-align: center;
			}
		}
	}
</style>