// params 请求的内容
//header 请求头 get/GET  请求方式 "content-type:json" toUpperCase()
//header 请求头 post/POST  请求方式 "content-type:multipart/form-data " toUpperCase()
 function getDatas(params){
   return new Promise((resolve,reject)=>{
  uni.showLoading({
  	title: '加载中',
	mask:true
  });
     uni.request({
         method:"GET",
      ...params,
      header: {
        'content-type': params.methed?.toUpperCase()=="GET"? "application/json; charset=utf-8" :"application/x-www-form-urlencoded; charset=utf-8"
      },
      success:(res)=>{
        resolve(res)
      },
      fail:(err)=>{
        reject(err)
      },
      complete:()=>{
       uni.hideLoading();
      }
     })
   })
}
async function netWork(args) {
  if (args instanceof Array) {//args为数组 - 说明做多次网络请求
    let results = [];//用来存储多次(多个接口url)请求回来的数据
    // 遍历数组
    for (let index in args) {
      let data = await getDatas(args[index]);//依次对数组元素中的接口做网络请求
      results.push(data);//将每次请求返回的数据，存储到数据中
    }
    return results;//返回数组
  } else {//args为对象 - 一次请求
    return await getDatas(args);
  }
}
export default netWork
