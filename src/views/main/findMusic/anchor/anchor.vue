<template>
	<div class="anchor">
		<div class="banner">
			<myBanner :list="banner"></myBanner>
		</div>
		<div class="catgory-list">
			<div  class="prev" >
				
				<span v-show="currentPosition<0" class=" icon icon-back" @click="listMove('l')"></span>
			</div>
			<div class="list-wrapper">
				<ul :style="{left:currentPosition*640+'px'}">
					<li v-for="type in radioTypeList" :key="type.id" >
						<span class="pic-box" >
							<i class="pic" :style="{backgroundImage:'url('+type.pic56x56Url+')'}"></i>
						</span>
						<span>{{type.name}}</span>
					</li>
				</ul>
			</div>
			<div class="next">
				<span class=" icon icon-forward" @click="listMove('r')" v-show="currentPosition>-2"></span>
			</div>
		</div>
		<p class="type-nav">
			<a>付费精品 <i class="icon icon-forward"></i></a>
		</p>
		
		<ul class="payTop">
			<router-link tag="li" :to="{name:'radio',params:{radio_id:item.id}}" v-for="item in payType" :key="item.id">
				<div class="poster">	
					<img :src="item.picUrl"/>
					<!-- <p>{{item.createTime | toDateStrZH}}更新</p> -->
				</div>
				<div class="info">
					<p>{{item.name}}</p>
					<div class="desc">
						<span>{{item.rcmdText}}</span>
						<span><i class="icon icon-play-hollow"></i>{{item.lastProgramName}}</span>
					</div>
					<strong class="red">￥ {{item.originalPrice/100}}</strong>
				</div>
			</router-link>
		</ul>
		
		<template v-for="(tui,index) in tuiList" >
			<p class="type-nav" :key="index+'p'">
				<a>{{radioTypeList[index].name}}<i class="icon icon-forward"></i></a>
			</p>
			<div class="tui" :key="index+'div'">
				<ul>
					<router-link tag="li" :to="{name:'radio',params:{radio_id:item.id}}" v-for="item in tui" :key="item.id">
						<img :src="item.picUrl"/>
						<p>{{item.name}}</p>
					</router-link>
				</ul>
			</div>
		</template>
		
	</div>
</template>

<script>
	import axios from "axios"
	import myBanner from "@/components/banner.vue"
	export default {
		components:{
			myBanner
		},
		data(){
			return {
				banner:[],
				radioTypeList:[],
				currentPosition:0,
				payType:[]	,	//付费精品
				tuiList:[]
			}
		},
		methods:{
			getBanner(){
				axios.post("/dj/banner").then(res=>{
					this.banner = res.data.data;
				})
			},
			getTypeList(){
				axios.post("/dj/catelist",{
					limit:5
				}).then(res=>{
					this.radioTypeList = res.data.categories;
					for(var i=0;i<5;i++){
						axios.post("/dj/recommend/type",{
							type:this.radioTypeList[i].id
						}).then(res=>{
							this.tuiList.push(res.data.djRadios)
						})
					}
				})
			},
			listMove(dir){
				if(dir == 'r'){
					if(this.currentPosition<-2){
						return 
					}else{
						this.currentPosition -=1
					}
				}else{
					if(this.currentPosition>=0){
						return 
					}else{
						this.currentPosition +=1
					}
				}
			},
			getPayTypeList(){
				axios.post("/dj/paygift",{limit:4}).then(res=>{
					console.log(res)
					this.payType = res.data.data.list
				})
			},
			
		

		},
		mounted(){
			this.getBanner();
			this.getTypeList();
			this.getPayTypeList();
		
		}
	}
</script>

<style scoped lang="less">
	.anchor{
		width:100%;
		height:100%;
		box-sizing: border-box;
		padding:0 30px;
		.banner{
			width:100%;
			margin:15px auto;
			height:200px;
		}
		.catgory-list{
			margin-top:60px;
			width:720px;
			height:100px;
			display:flex;
			.prev,.next{
				width:40px;
				display:flex;
				justify-content: center;
				align-items: center;
				cursor:pointer;
				&::before{
					font-size:24px;
					color:rgb(172,172,172);
					font-weight:100;
				}
				span{
					width:100%;
					height:100%;
					display:flex;
					justify-content: center;
					align-items: center;
				}
				
			}
			.list-wrapper{
				flex:1;
				overflow:hidden;
				position:relative;
				ul{
					position:absolute;
					transition:all .5s ease-in-out;
					top:0;
					height:100%;
					display:flex;
					li{
						width:80px;
						height:100px;
						flex-shrink: 0;
						display:flex;
						flex-direction: column;
						align-items: center;
						justify-content: space-around;
						font-size:12px;
						cursor:pointer;
						color:rgb(172,172,172);
						.pic-box{
							width:50px;
							height:50px;
							border-radius:50%;
							background:rgb(50,30,30,.1);
							display: flex;
							justify-content: center;
							align-items: center;
							.pic{
								display: inline-block;
								width:30px;
								height:30px;
								background-size:auto 100%;
								background-repeat: no-repeat;
								background-position: 0px 0px; 
							}
						}
					}
				}
			}
		}
		.payTop{
			margin-top:30px;
			width:100%;
			display:flex;
			flex-wrap: wrap;
			justify-content: space-between;
			li{
				width: 45%;
				display:flex;
				padding:30px 0;
				border-top:1px solid rgb(72,72,72);
				color:rgb(172,172,172);
				.poster{
					width:130px;
					height:130px;
					border-radius:5px;
					margin-right:10px;
					position: relative;
					overflow: hidden;
					img{
						width:150px;
					}
					p{
						position: absolute;
						left:0;
						bottom: 0;
						width:100%;
						text-align: center;
						color:#fff;
						font-size:13px;
					}
				}
				
				.info{
					display:flex;
					flex:1;
					flex-direction: column;
					justify-content: space-between;
					overflow: hidden;
					text-align: left;
					p{
						line-height:30px;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						font-size:14px;
						&:hover{
							color:rgb(232,232,232);
						}
					}
					.desc{
						display:flex;
						flex-direction: column;
						overflow: hidden;
						span{
							color:rgb(72,72,72);
							font-size:13px;
							line-height:24px;
							&:last-of-type{
								white-space: nowrap;
								overflow: hidden;
								text-overflow: ellipsis;
							}
						}
					}
				}
			}
		}
		.tui{	
			width:100%;
			overflow-x:scroll;
			margin-top:30px;
			&::-webkit-scrollbar{
				display:none;
			}
			ul{
				display:flex;
				li{
					margin-right:20px;
					img{
						width:120px;
						border-radius:5px;
					}
					p{
						font-size:12px;
						text-align:left;
						color:rgb(172,172,172)
					}
				}
			}
			&::-webkit-scrollbar{
				width:0
			}
		}
	}
</style>
