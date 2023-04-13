let ip;
const app = getApp();
// #ifdef H5
 ip = '/api';
// #endif
// #ifndef H5
 ip = 'http://43.143.190.87:8081/';
// #endif
const baseUrl = ip+'index.php?s=/api/';
const login =uni.getStorageSync('login');
let userInfo='&wxapp_id=10021&token=';
if(login){
	// 登录了
	const token = uni.getStorageSync('token');
	 userInfo = `&wxapp_id=10021&token=${token}`;
}

const url = {
	baseIfo : baseUrl+'wxapp/base'+userInfo,//信息
	baseIndexPage:baseUrl+'index/page'+userInfo,//首页数据
	baseCategory:baseUrl+'category/index'+userInfo,//分类数据
	baseGoodslist: baseUrl+'goods/lists'+userInfo+'&page=2&category_id=0',//分类数据2
	baseOneList:(id)=>`${baseUrl}goods/lists${userInfo}&page=1&category_id=${id}`,//单个数据
	baseSearchList:(str)=>`${baseUrl}goods/lists${userInfo}&page=1&sortType=all&sortPrice=0&category_id=0&search=${str}`,//获取搜索综合数据,
	baseSearchListTwo:(str)=>`${baseUrl}goods/lists${userInfo}&page=1&sortType=sales&sortPrice=1&category_id=0&search=${str}`,//获取销量数据
		baseSearchListThree:(str)=>`${baseUrl}goods/lists${userInfo}&page=1&sortType=price&sortPrice=0&category_id=0&search=${str}`,//获取价格
	baseLogin:`${baseUrl}user/login`,//登录
	baseShopXq:(id)=>`${baseUrl}goods/detail${userInfo}&goods_id=${id}`,//获取商品详情数据
	baseUserInfo:`${baseUrl}user.index/detail${userInfo}`,//获取个人地址和收货信息
	baseCartList:`${baseUrl}cart/lists${userInfo}`,//得到购物车数据
	baseCartAdd:`${baseUrl}cart/add`,//增加数据
	baseCartPev:`${baseUrl}cart/sub`,//减少数据
	baseCartDelete:`${baseUrl}cart/delete`,//删除数据
	baseOrderList:(type)=>`${baseUrl}user.order/lists${userInfo}&dataType=${type}`,//订单分类
	baseOrderDel:`${baseUrl}user.order/cancel`,//删除订单
	baseOrderXq:(id)=>`${baseUrl}user.order/detail${userInfo}&order_id=${id}`,
	baseOrderComm:(id,num,sku)=>`${baseUrl}order/buyNow${userInfo}&goods_id=${id}&goods_num=${num}&goods_sku_id=${sku}`,//单个订单详情
	baseAddress:`${baseUrl}address/lists${userInfo}`,//得到收货地址列表
	baseSetRess:`${baseUrl}address/setDefault`,//修改默认地址
	baseDelRess:`${baseUrl}address/delete`,//删除地址
	baseEditRess:`${baseUrl}address/edit`,//修改地址address/add
	baseAddRessADD:`${baseUrl}address/add`,//新增地址
};


export default url