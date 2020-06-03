module.exports = {
	publicPath:"/",
	productionSourceMap:false,
	pages:{
		index:{
			entry:"./src/views/main/main.js",
			template:"public/index.html",
			filename:"index.html",
			title:"网易云音乐",
			chunks: ["chunk-vendors", "chunk-common", "index"]
		},
		video:{
			entry:"./src/views/video/main.js",
			template:"public/index.html",
			filename:"video.html",
			title:"视频播放",
			chunks: ["chunk-vendors", "chunk-common", "video"]
		},
	},
	configureWebpack:{
		module:{
			rules:[
				{
					test: /\.tsx?$/,
					loader: 'ts-loader',
					exclude: /node_modules/,
					options: {
						appendTsSuffixTo: [/\.vue$/],
					}
				}
			]
		}
		
	},
	// chainWebpack: config => {
	// 	config.module
	// 	  .rule('ts')
	// 	  .test(/\.vue/)
	// 	  .use('ts-loader')
	// 		.loader('ts-loader')
	// 		.end()
	// },
	
	
	devServer:{
		proxy:{
			"/":{
				target:"http://imdeveloper.cn:3000",
				ws:true,
				changeOrigin:true,
				pathRewrite:{
					'^/':''
				}
			},
			
		}
	}
}