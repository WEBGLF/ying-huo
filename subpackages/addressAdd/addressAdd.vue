<template>
	<view class="address" :style="{height:screenHeight+'px'}">
		<view class="gg">
			<view class="ss">
				<text>收货人</text>
				<view class="inp">
					<input v-model.trim="people" :onkeyup="kep()" type="text" placeholder="请输入收货人姓名">
				</view>
			</view>
			<view class="ss">
				<text>手机号</text>
				<view class="inp">
					<input v-model.trim="tel" type="text" :onkeyup="kep()" placeholder="请输入收货人联系电话">
				</view>
			</view>
			<view class="ss ff">
				<text>所在地区</text>
				<pickerAddress class="inp" @change="change">{{txt}}</pickerAddress>
			</view>
			<view class="ss">
				<text>详细地址</text>
				<view class="inp">
					<input v-model.trim="xiangxi" type="text" :onkeyup="kep()" placeholder="请输入街区小区楼层">
				</view>
			</view>
			<button @click="sub" :disabled="jin" class="btna">保存</button>
		</view>
	</view>
</template>

<script>
	import pickerAddress from "./pickerAddress.vue";
	export default {
		data() {
			return {
				token:uni.getStorageSync('token'),
				txt: '选择省、市、区',
				screenHeight: '',
				tel: '',
				people: '',
				xiangxi: '',
				jin: false,
				id:0,

			}
		},
		components: {
			pickerAddress
		},
		onLoad(options) {
			this.screenHeight = uni.getSystemInfoSync().windowHeight; //获取当前页面的
			if (options.obj) {
				uni.setNavigationBarTitle({
					title: '编辑收货地址'
				});
				const obj = JSON.parse(decodeURIComponent(options.obj));
				this.tel=obj.phone;
				this.people=obj.name;
				this.txt = `${obj.region.city},${obj.region.province},${obj.region.region}`;
				this.xiangxi=obj.detail;
				this.id = obj.address_id;

			} else {
          uni.setNavigationBarTitle({
					title: '新增收货地址'
				});

			}
		},
		methods: {
			subs() {
				if (this.people === '') {
					uni.showToast({
						title: '收件人不能为空',
						duration: 2000
					})
					return false
				}
				if (this.tel.length < 1) {
					uni.showToast({
						title: '手机号不能为空',
						duration: 2000
					})
					return false
				}
				let reg = /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/;
				if (!reg.test(this.tel)) {
					uni.showToast({
						title: '手机号不符合要求',
						duration: 2000
					})
					return false
				}
				if (!this.txt) {
					uni.showToast({
						title: '省市区不能空',
						duration: 2000
					})
					return false
				}
				if (this.xiangxi === '') {
					uni.showToast({
						title: '详细地址不能为空',
						duration: 2000
					})
					return false
				}
				return true
			},

			kep() {
				this.people = this.people.replace(/[, ]/g, '');
				this.tel = this.tel.replace(/[, ]/g, '');
				this.xiangxi = this.xiangxi.replace(/[, ]/g, '')
			},
			change(data) {
				console.log(data);
				this.txt = data.data.join('')
				let arr = data.data
				var str1 = "";
				for (let i = 0; i < arr.length; i++) {
					if (i < arr.length - 1) {
						str1 += arr[i] + ",";
					} else {
						str1 += arr[i];
					}
				}
				this.txt = str1;
				console.log(str1);
			},
			sub() {
				let aa = this.subs();
				if (aa == true) {
					if(this.id==0){
						this.$ajax({
							url:this.$urls.baseAddRessADD,
							method:'POST',
							data:{
								wxapp_id: 10021,
								token: this.token,
								name: this.people,
								phone: this.tel,
								detail: this.xiangxi,
								region: this.txt,
								address_id:this.id,
							}
						}).then(res => {
							uni.showToast({
								title: '添加成功',
								duration: 1000,
							});
							uni.navigateBack();
						})
					}else{
						this.$ajax({
							url:this.$urls.baseEditRess,
							method:'POST',
							data:{
								wxapp_id: 10021,
								token: this.token,
								name: this.people,
								phone: this.tel,
								detail: this.xiangxi,
								region: this.txt,
								address_id:this.id,
							}
						}).then(res => {
							uni.showToast({
								title: '添加成功',
								duration: 1000,
							});
							uni.navigateBack();
						})
					}
					
					
				}
			}
		}
	}
</script>

<style>
	page {
		font-size: 30rpx;
	}

	.address {
		width: 100%;
		background-color: #f3f3f3;
		text-align: center;
	}

	.ss {
		background-color: #fff;
		width: 100%;
		border-top: 1px solid #f3f3f3;
		/* height: 80rpx; */
		padding: 35rpx;
		overflow: hidden;
		box-sizing: border-box;
		text-align: left;
	}

	.ss text {
		float: left;
		width: 130rpx;
	}

	.inp {
		width: 70%;
		display: inline-block;
		padding: 0rpx 2rpx 2rpx 60rpx;
	}

	.ff {
		margin-top: 30rpx;
	}

	.btna {
		margin-top: 30rpx;
		width: 95%;
		background-color: #FF495E;
		color: #fff;
	}
</style>