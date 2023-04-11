module.exports={
	 devServer: {
	    proxy: {
	      '/api': {
	        target: 'http://43.143.190.87:8081/',
	        changeOrigin: true,
	        pathRewrite: {
	          '^/api': ''
	        }
	      }
	    },
	  }
}