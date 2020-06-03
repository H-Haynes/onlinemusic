<template>
	<div class="playlist">
		<playlist-banner v-if="qualityList.length>0" :playlist="qualityList[currentTypeIndex]"></playlist-banner>
		
		
		<div class="nav" ref="ss">
			<span class="currentNav">
				<a>{{currentTag  || '全部歌单'}} <i class="icon icon-forward"></i></a>
			</span>
			<ul>
				<li :class="{red:currentTag==tag.name}" v-for="(tag,index) in hotTagList" :key="tag.id" @click="changeCat(tag.name,index)">{{tag.name}}</li>
			</ul>
			
		</div>
		<ul class="playlists" ref="playlists">
			<router-link tag="li" :to="{name:'list',params:{list_id:list.id}}" v-for="list in playList" :key="list.id" >
				<div class="poster" :style="{backgroundImage:`url(${list.coverImgUrl})`}">
					<span class="playCount">
						<i class="icon icon-play-hollow mr5"></i>{{list.playCount | fixedNum}}
					</span>
					<span class="author">
						<i class="icon icon-user mr5"></i>
						{{list.creator.nickname}}
					</span>
					<span class="play">
						<i class="icon icon-play"></i>
					</span>
				</div>
				<p class="name">{{list.name}}</p>
			</router-link>
			<li v-for="index in (4-playList.length%4)" :key="index"></li>
		</ul>
	</div>
</template>

<script>
	import axios from "axios"
	import playlistBanner from "./playlistbanner"
	export default{
		components:{
			playlistBanner
		},
		data(){
			return {
				currentTag:"",
				qualityList:[],
				hotTagList:[],
				playList:[],
				loading:false,
				currentTypeIndex:0,
			}
		},
		methods:{
			getQualityList(){
				axios.post("/top/playlist/highquality",{
					limit:20
				}).then(res=>{
					this.qualityList = res.data.playlists;
				})
			},
			getHotTag(){
				axios.post("/playlist/hot").then(res=>{
					this.hotTagList = res.data.tags;
				})
			},
			getPlaylist(cat='',order='hot'){
				this.loading = true;
				axios.post("/top/playlist",{
					cat,
					order,
					limit:50
				}).then(res=>{
					this.playList = res.data.playlists;
					this.loadimg = false;
				}).catch(err=>{
					this.loading = false;
					console.log(err)
				})
			}, 
			changeCat(cat,index){
				this.currentTag = cat;
				this.currentTypeIndex = index;
				this.getPlaylist(this.currentTag);
			},
			toListDetail(id){
				console.log(111)
				this.$router.push({
					name:"list",
					params:{
						list_id:id
					}
				})
			}
			
		},
		mounted(){
			this.getQualityList();
			this.getHotTag();
			this.getPlaylist()
		}
	}
</script>

<style lang="less" scoped>
	.playlist{

		box-sizing:border-box;
		margin:10px 30px;
		.nav{
			margin-top:10px;
			display:flex;
			justify-content: space-between;
			// align-items: center;
			font-size:14px;
			.currentNav{
				cursor:pointer;
				border:1px solid rgb(132,132,132);
				padding:0 10px;
				display:flex;
				justify-content: center;
				align-items: center;
				height:24px;
				border-radius:24px;
				font-size:12px;
				background:rgba(50,50,50,.5);
				&:hover{
					background:rgba(72,72,72,.5);
				}
				i::before{
					font-size:12px !important;
				}
			}
			ul{
				display:flex;
				align-items: center;
				justify-content: space-between;
				li{
					font-size:12px;
					margin:0 10px;
					color:rgb(172,172,172);
					cursor:pointer;
					&:hover{
						color:#fff;
					}
				}
			}
		}
		.playlists{
			margin-top:20px;
			display:flex;
			justify-content: space-between;
			align-items: center;
			flex-wrap:wrap;
			li{
				width:165px;
				height:200px;
				margin-bottom:50px;
				cursor:pointer;
				.poster{
					height:165px;
					width:165px;
					border-radius:5px;
					position:relative;
					background-size:100% 100%;
					.playCount{
						color:#fff;
						position:absolute;
						right:5px;
						top:5px;
						font-size:12px;
						i{
							color:#fff;
						}
					}
					.author{
						position:absolute;
						left:10px;
						bottom:5px;
						font-size:12px;
						color:#fff;
						i{
							color:#fff;
						}
					}
					
					.play{
						position:absolute;
						right:10px;
						bottom:10px;
						width:35px;
						height:35px;
						border-radius:35px;
						background:rgba(200,200,200,.7);
						line-height:35px;
						text-align:center;
						display:none;
						.icon-play{
							color:#c82525
						}
					}
					&:hover .play{
						display:inline-block;
					}
				}
				.name{
					font-size:12px;
					color:rgb(172,172,172);
					margin-top:10px;
					text-align: left;
					&:hover{
						color:#fff;
					}
				}
				
			}
		}
	}
</style>
