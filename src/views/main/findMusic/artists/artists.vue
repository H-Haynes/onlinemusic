<template>
	<div class="artists">
		<div class="filters">
			<div class="lang">
				<p class="filter-name">分类:</p>
				<ul>
					<li>
						<a class="checked" href="javascript:;">全部</a>
					</li>
					<li v-for="type in typeList" :key="type.id">
						<a href="javascript:;">{{type.name}}</a>
					</li>
				</ul>
			</div>
			
			<div class="word">
				<p class="filter-name">筛选:</p>
				<ul>
					<li>
						<a class="checked" href="javascript:;">全部</a>
					</li>
					<li v-for="type in words" :key="type">
						<a href="javascript:;">{{type}}</a>
					</li>
				</ul>
			</div>
		</div>
		
		<ul class="artists-content">
			<router-link tag="li" :to="{name:'art',params:{art_id:item.id}}" class="singer" v-for="item in hotSinger" :key="item.id">
				<img :src="item.img1v1Url" />
				<a href="javascript:;">{{item.name}}</a>
			</router-link>
		</ul>
	</div>
</template>

<script>
	import axios from "axios"
	export default {
		data(){
			return {
				typeList:[
					
					{
						name:"华语男歌手",
						cat:1001
					},
					{
						name:"华语女歌手",
						cat:1002
					},
					{
						name:"华语组合",
						cat:1003
					},
					{
						name:"欧美男歌手",
						cat:2001
					},
					{
						name:"欧美女歌手",
						cat:2002
					},
					{
						name:"欧美组合",
						cat:2003
					},
					{
						name:"日本男歌手",
						cat:6001
					},
					{
						name:"日本女歌手",
						cat:6002
					},
					{
						name:"日本组合",
						cat:6003
					},
					{
						name:"韩国男歌手",
						cat:7001
					},
					{
						name:"韩国女歌手",
						cat:7002
					},
					{
						name:"韩国组合",
						cat:7003
					},
					{
						name:"其他男歌手",
						cat:4001
					},
					{
						name:"其他女",
						cat:4002
					},
					{
						name:"其他组合",
						cat:4003
					}
				],
				words:['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','#'],
				hotSinger:[]
			}
		},
		methods:{
			getHotList(){
				axios.post('/top/artists',{
					limit:20
				}).then(res=>{
					this.hotSinger = res.data.artists
				})
			}
		},
		mounted(){
			this.getHotList()
		}
	}
</script>

<style lang="less" scoped>
	.artists{
		padding:20px;
		.filters{
			.lang,.word{
				display:flex;
				.filter-name{
					width:60px;
					color:rgb(172,172,172);
					font-size:13px;
				}
				ul{
					display:flex;
					flex:1;
					flex-wrap: wrap;
					li{
						border-right:1px solid rgb(50,50,50);
						margin-bottom:10px;
						font-size:13px;
						width:80px;
						cursor:pointer;
						a{
							padding:0px 5px;
							border-radius:5px;
							display:inline-block;
						}
						a.checked{
							background:rgb(50,30,30);
							color:rgb(130,30,30)
						}
					}
				}
			}
		}
		.artists-content{
			margin-top:30px;
			display:flex;
			flex-wrap: wrap;
			justify-content: space-around;
			li{
				width:130px;
				margin-bottom:30px;
				img{
					width:100%;
					// height:130px;
					// object-fit: cover;
					border-radius:5px;
				}
				a{
					font-size:13px;
					
				}
			}
		}
	}
</style>
