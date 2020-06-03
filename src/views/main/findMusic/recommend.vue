<template>
	<div 
			class="recommonds" 
			v-loading="loading" 
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(33, 33, 33, 1)">
		<div class="banner">
			<myBanner :list="banner"></myBanner>
		</div>
		
		<p class="recommond">
			<a>推荐歌单 <i class="icon icon-forward"></i></a>
		</p>
		<div class="recommond-list">
			<router-link tag="div" :to="{name:'list',params:{list_id:0}}" class="today">
				<div class="bg">
					<p class="mask">
						根据您的音乐口味生成每日更新
					</p>
					<span class="play">
						<i class="icon icon-play"></i>
					</span>
					<span class="icon icon-calendar"></span>
					<strong class="date">{{new Date().getDate()}}</strong>
				</div>
				<a href="javascript:;">每日歌曲推荐</a>
			</router-link>
			<num-pic v-for="(album,index) in recommomdList" :album="album" :size="135" :key="index"></num-pic>


		</div>
		
		<p class="personalized">
			<a>独家放送 <i class="icon icon-forward"></i></a>
		</p>
		
		<div class="personalized-list">
			<dujia v-for="(item,index) in personalizedList" :key="index" :album="item"></dujia>
			<div class="zongjie">
				<div class="bg" style="background:rgba(50,50,50,.2)">
					<span class="mini">
						<i class="icon icon-mini-program" ></i>
					</span>
				</div>
				<a>网易云音乐年度歌手盘点出炉，为你的偶像点赞吧！</a>
			</div>
		</div>
		
		<p class="latest">
			<a>最新音乐 <i class="icon icon-forward"></i></a>
		</p>
		
		<div class="latest-list">
			<latest  v-for="(song,index) in latestList" :index="index"  :key="song.id" :song="song" style="width:350px;height:90px"  ></latest>
		</div>
		
		<p class="mv">
			<a>推荐MV <i class="icon icon-forward"></i></a>
		</p>
		
		<div class="homemv-list">
			<homemv v-for="mv in mvList" :key="mv.id" :mv="mv"></homemv>
		</div>
		
		<p class="home-radio">
			<a>主播电台 <i class="icon icon-forward"></i></a>
		</p>
		
		<div class="zhubo-list">
			<home-radio style="width:350px;height:120px" v-for="zhubo in radioList" :key="zhubo.id" :radio="zhubo"></home-radio>
		</div>
	</div>
	
</template>

<script>
	import axios from "axios"
	import myBanner from "@/components/banner.vue"
	import numPic from "@/components/numpic.vue"
	import dujia from "@/components/dujia.vue"
	import latest from "@/components/latest.vue"
	import homemv from "@/components/homemv.vue"
	import homeRadio from "@/components/home-zhubo.vue"

	export default {
		// name: 'Home',
		components: {
			myBanner,
			numPic,
			dujia,
			latest,
			homemv,
			homeRadio
		},
		data(){
			return {
				loading:false,
				banner:[],
				currentNavId:1,
				navlist:[
					{
						name:"个性推荐",
						id:1
					},
					{
						name:"歌单",
						id:2
					},
					{
						name:"主播电台",
						id:3
					},
					{
						name:"排行榜",
						id:4
					},
					{
						name:"歌手",
						id:5
					},
					{
						name:"最新音乐",
						id:6
					}
				],
				recommomdList:[],
				personalizedList:[],
				latestList:[],
				mvList:[],
				radioList:[]
			}
		},
		methods:{
			getBanner(){
				axios.post("/banner").then(res=>{
					this.banner = res.data.banners
				})
			},
			getRecommondList(){
				axios.post("/personalized",{
					limit:9
				}).then(res=>{
					this.recommomdList = res.data.result;
				})
			},
			getPersonalizedList(){	//独家放送
				axios.post("/personalized/privatecontent").then(res=>{
					this.personalizedList = res.data.result;
				})
			},
			getLatestList(){

				axios.get("/personalized/newsong").then(res=>{
					this.latestList = res.data.result;
				})
			},
			getMvList(){
				axios.post("/personalized/mv").then(res=>{
					this.mvList = res.data.result
				})
			},
			getRadioList(){
				axios.post("/personalized/djprogram").then(res=>{
					this.radioList  = res.data.result;
					this.loading = false;
				})
			}
		},
		mounted(){
			this.loading = true;
			this.getBanner();
			this.getRecommondList();
			this.getPersonalizedList();
			this.getLatestList();
			this.getMvList();
			this.getRadioList();
		}
	};
</script>

<style lang="less" scoped>
	.recommonds{
		width:100%;
		height:100%;
		box-sizing: border-box;
		padding:0 30px;
		.banner{
			width:100%;
			margin:15px auto;
			height:200px;
		}
		.recommond,.personalized,.latest,.mv,.home-radio{
			margin-top:60px;
			text-align: left;
			color:rgb(172,172,172);
			a{
				cursor:pointer;
				i{
					font-style: normal;
					&::before{
						font-size:16px;
					}
				}
				&:hover{
					color:rgb(232,232,232);
					i::before{
						color:rgb(232,232,232)
					}
				}
			}
		}
		.recommond-list{
			margin-top:10px;
			display:flex;
			justify-content: space-between;
			flex-wrap: wrap;
			.today{
				width:135px;
				margin-bottom:20px;
				.bg{
					width:135px;
					height:135px;
					border-radius: 5px;
					background: url("../../../assets/images/blur_bg.jpg");
					background-size: cover;
					display: flex;
					justify-content: center;
					align-items: center;
					position: relative;
					
					.icon-calendar{
						font-size:80px;
						color:rgb(213,213,213)
					}
					.mask{
						position: absolute;
						top:0;
						left:0;
						width:100%;
						box-sizing: border-box;
						line-height:20px;
						background:rgb(0,0,0);
						opacity: 1;
						font-size:13px;
						color:#fff;
						display: flex;
						flex-direction: column;
						padding:0 10px;
						text-align: left;
						opacity: 0;
						transition: all .3s linear;
					}
					.play{
						width:30px;
						height:30px;
						display:flex;
						justify-content: center;
						align-items:center;
						border-radius:50%;
						background:rgba(200,200,200);
						opacity: 0;
						position: absolute;
						bottom:5px;
						right:5px;
						transition:all .3s linear;
						.icon-play{
							margin-left:5px;
							color:rgb(200,37,37);
						}
					}
					&:hover{
						.mask{
							opacity: 0.4;
						}
						.play{
							opacity: .7;
						}
					}
					.date{
						position: absolute;
						left:50%;
						top:50%;
						font-size:30px;
						transform: translate(-50%,-20%);
						color:rgb(213,213,213)
					}
				}
				a{
					display: inline-block;
					width:100%;
					font-size:13px;
					text-align: left;
					margin-top:5px;
					&:hover{
						color:rgb(213,213,213)
					}
				}
			}
		}
		.personalized{
			margin-top:30px;
		}
		.personalized-list{
			margin-top:10px;
			// margin-bottom: 20px;
			display:flex;
			justify-content: space-between;	
			align-items: center;
			.zongjie{
				width:170px;
				.bg{
					width:170px;
					height:100px;
					background-image:url("../../../assets/images/zongjie.png");
					background-size:100% 100%;
					border-radius:5px;
					position:relative;
					cursor: pointer;
					.mini{
						width:20px;
						height:20px;
						line-height:20px;
						text-align:center;
						position: absolute;
						left:5px;
						top:5px;
						background:rgba(0,0,0,.5);
						border-radius:50%;
						border:1px solid rgb(213,213,213);
						font-size:12px;
					}
				}
				a{
					font-size:13px;
					display: inline-block;
					text-align: left;
					margin-top:10px;
					cursor: pointer;
					&:hover{
						color:rgb(213,213,213)
					}
				}
				
			}
		}
		.latest-list{
			margin-top:20px;
			display:flex;
			flex-wrap: wrap;
			justify-content: space-between;
		}
		.homemv-list{
			display: flex;
			margin-top:20px;
			justify-content: space-between;
		}
		.zhubo-list{
			margin-top:20px;
			display:flex;
			flex-wrap: wrap;
			justify-content: space-between;
			margin-bottom:50px
		}
	}
</style>
