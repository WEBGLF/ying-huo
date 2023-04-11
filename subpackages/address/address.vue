<template>
	<view class="box">
		<view class="address-box">
			<view class="add-list" v-for="item,index in dataObj.list" :key="item.address_id">
				<view class="title-ress">
					<text v-text="item.name+'   '"></text>
					<text v-text="item.phone"></text>
				</view>
				<view class="title-ress tit">
					<text
						v-text="item.region.city+' '+item.region.province+' '+item.region.region+' '+item.detail"></text>
				</view>
				<!-- 选择器 -->
				<view class="check">
					<view>
						<u-checkbox-group>
							<u-checkbox @change="checkboxChange(item.address_id)" shape='circle' active-color="red" v-model="dataObj.default_id==item.address_id" >{{dataObj.default_id==item.address_id ? '默认':'选择'}}</u-checkbox>
						</u-checkbox-group>
					</view>
					<view class="delicon">
						<view class="delone" @click="goBj(item)">
							<uni-icons type="compose" size="18" color="#777"></uni-icons>
							<text class="title">编辑</text>
						</view>
						<view class="delone" @click="delAds(item.address_id)">
							<uni-icons type="trash" size="18" color="#777"></uni-icons>
							<text class="title">删除</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部 -->
		<view class="O-bottom">
<view class="tba">
	<u-button type="error" shape="circle" @click="goAdd">添加新地址</u-button>
</view>
		
		<!-- 删除 -->
		<u-modal v-model="isBack" content="确认删除地址?" :show-cancel-button="true" @confirm='delOneOrder'></u-modal></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataObj: {},
				token : uni.getStorageSync('token'),
				isBack:false,
				delId:0
			}
		},
		onShow(){
			this.getData();
		},
		methods: {
			getData() {
				this.$ajax({
					url: this.$urls.baseAddress
				}).then(res => {
					console.log(res.data.data);
					this.dataObj = res.data.data
				})
			},
			checkboxChange(item){
				if(this.dataObj.default_id==item){
					return
				}else{
					this.dataObj.default_id=item;
					//网络请求 改变默认
					this.$ajax({
						url:this.$urls.baseSetRess,
						method:"POST",
						data:{
							wxapp_id: 10021,
							token:this.token,
							address_id: item,
						}
					}).then(res=>{
					})
					
				}
				
			},
			delAds(id){
				this.delId=id;
				this.isBack=true;
				
			},
			delOneOrder(){
			// 删除
			this.$ajax({
				url:this.$urls.baseDelRess,
				method:"POST",
				data:{
					wxapp_id: 10021,
					token:this.token,
					address_id: this.delId,
				}
			}).then(res=>{
					this.getData();
			})
			},
			// 点击编辑
			goBj(obj){
				uni.navigateTo({
					url: `/subpackages/addressAdd/addressAdd?obj=${encodeURIComponent(JSON.stringify(obj))}`,
				});
			},
			// 点击新增
			goAdd(){
				uni.navigateTo({
					url: `/subpackages/addressAdd/addressAdd`,
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.box {
		padding-bottom: 130upx;

		.address-box {
			margin: 20upx;

			.add-list {
				background-color: #fff;
				box-sizing: border-box;
				width: 90%;
				margin: 0 auto;
				margin-top: 20upx;
				padding: 20upx;
				border-radius: 20upx;
				box-shadow: 2upx 2upx 2upx 2upx #e6e6e6;

				.title-ress {
					font-weight: 700;
					padding-bottom: 20upx;
				}

				.tit {
					border-bottom: 1px solid #f6f6f9;
				}

				.check {
					padding: 15upx;
					display: flex;
					justify-content: space-between;
					align-items: center;
				}
				.delicon{
						display: flex;
						.delone{
							.title {
							    font-size: 30rpx;
							    padding: 0 24rpx 0 6rpx;
							    color: #666;
							}
						}
					
				}
			}

		}
	}



	.O-bottom {
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: #fff;
		height: 120upx;
		width: 100%;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		box-shadow: -2px 2px 4px 2px rgba(0, 0, 0, 0.1);
		.tba{
			width: 80%;
			margin: 0 auto;
		}
	}
</style>