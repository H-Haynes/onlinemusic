<template>
	<div class="rank" v-cloak>
		<p class="rank-head">官方榜</p>
		<div class="biaosheng" v-cloak>
			<div class="poster" :style="{backgroundImage:'url('+biaosheng.coverImgUrl+')'}">
				<span class="date">{{new Date(biaosheng.updateTime).getMonth()+1 || 1}}月{{new Date(biaosheng.updateTime).getDate() ||1}}日更新</span>
			</div>
			<div class="rank-list">
				<ul  v-if="biaosheng.tracks && biaosheng.tracks.length>0">
					<li v-for="(item,index) in 5" class="flex" :key="index" >
						<strong>{{item}}</strong>
						<p @dblclick="play(biaosheng.tracks[index].id)">{{biaosheng.tracks[index].name}}</p>
						<span>
							<template v-for="(ar,idx) in biaosheng.tracks[index].ar">
									{{idx==0 ? ar.name : '/'+ar.name}}
							</template>
						</span>
					</li>
					
					<li class="more">
						<!-- <span>查看更多 <i class="icon icon-forward"></i></span> -->
						<router-link tag="span" to="/rankdetail/3" >查看更多 <i class="icon icon-forward"></i></router-link>
					</li>
				</ul>
			</div>
		</div>
		
		<div class="newRank" v-cloak>
			<div class="poster" :style="{backgroundImage:'url('+newRank.coverImgUrl+')'}">
				<span class="date">{{new Date(newRank.updateTime).getMonth()+1 || 1}}月{{new Date(newRank.updateTime).getDate() ||1}}日更新</span>
			</div>
			<div class="rank-list">
				<ul  v-if="newRank.tracks && newRank.tracks.length>0">
					<li v-for="(item,index) in 5" class="flex" :key="index">
						<strong>{{item}}</strong>
						<p @dblclick="play(newRank.tracks[index].id)">{{newRank.tracks[index].name}}</p>
						<span>
							<template v-for="(ar,idx) in newRank.tracks[index].ar">
									{{idx==0 ? ar.name : '/'+ar.name}}
							</template>
						</span>
					</li>
					
					<li class="more">
						<!-- <span>查看更多 <i class="icon icon-forward"></i></span> -->
						<router-link tag="span" to="/rankdetail/0" >查看更多 <i class="icon icon-forward"></i></router-link>
					</li>
				</ul>
			</div>
		</div>
		
		<div class="original" v-cloak>
			<div class="poster" :style="{backgroundImage:'url('+original.coverImgUrl+')'}">
				<span class="date">{{new Date(original.updateTime).getMonth()+1 || 1}}月{{new Date(original.updateTime).getDate() ||1}}日更新</span>
			</div>
			<div class="rank-list">
				<ul  v-if="original.tracks && original.tracks.length>0">
					<li v-for="(item,index) in 5" class="flex" :key="index">
						<strong>{{item}}</strong>
						<p @dblclick="play(original.tracks[index].id)">{{original.tracks[index].name}}</p>
						<span>
							<template v-for="(ar,idx) in original.tracks[index].ar">
									{{idx==0 ? ar.name : '/'+ar.name}}
							</template>
						</span>
					</li>
					
					<li class="more">
						<!-- <span>查看更多 <i class="icon icon-forward"></i></span> -->
						<router-link tag="span" to="/rankdetail/2" >查看更多 <i class="icon icon-forward"></i></router-link>
					</li>
				</ul>
			</div>
		</div>
		
		<div class="hotRank" v-cloak>
			<div class="poster" :style="{backgroundImage:'url('+hotRank.coverImgUrl+')'}">
				<span class="date">{{new Date(hotRank.updateTime).getMonth()+1 || 1}}月{{new Date(hotRank.updateTime).getDate() ||1}}日更新</span>
			</div>
			<div class="rank-list">
				<ul  v-if="hotRank.tracks && hotRank.tracks.length>0">
					<li v-for="(item,index) in 5" class="flex" :key="index">
						<strong>{{item}}</strong>
						<p @dblclick="play(hotRank.tracks[index].id)">{{hotRank.tracks[index].name}}</p>
						<span>
							<template v-for="(ar,idx) in hotRank.tracks[index].ar">
									{{idx==0 ? ar.name : '/'+ar.name}}
							</template>
						</span>
					</li>
					
					<li class="more">
						<!-- <span>查看更多 <i class="icon icon-forward"></i></span> -->
						<router-link tag="span" to="/rankdetail/1" >查看更多 <i class="icon icon-forward"></i></router-link>
					</li>
				</ul>
			</div>
		</div>
		
		<div class="singer-rank" v-cloak>
			<div class="poster" :style="{backgroundImage:'url('+singerPoster+')'}">
				<span class="date">每天更新</span>
			</div>
			<div class="rank-list">
				<ul  v-if="singerRank.length>0">
					<li v-for="(item,index) in 5" class="flex" :key="index">
						<strong>{{item}}</strong>
						<p>{{singerRank[index].name}}</p>
						
					</li>
					
					<li class="more">
						<span>查看更多 <i class="icon icon-forward"></i></span>
					</li>
				</ul>
			</div>
		</div>
		
		<p class="rank-head">全球榜</p>
		<ul class="other-rank" v-cloak v-if="rankType.length>0">
			<li v-for="(item,index) in rankType" :key="item.id" v-show="index>3">
				<div class="rank-box"  :style="{backgroundImage:'url('+item.coverImgUrl+')'}"></div>
				<a href="javascript:;" class="desc">{{item.name}}</a>
			</li>
			<li class="empty" v-for="num in ((rankType.length-3)%4)" :key="num">
				<span style="display:none">补位:{{num}}</span>
			</li>
		</ul>
	</div>
</template>

<script>
	import axios from 'axios'
	export default{
		data(){
			return {
				rankType:[],
				biaosheng:{},
				newRank:{},
				original:{},
				hotRank:{},
				singerRank:[],
				singerUpdate:"",
				singerPoster:"",
			}
		},
		methods:{
			getRankType(){
				axios.post("/toplist").then(res=>{
					this.rankType = res.data.list;
					this.singerPoster = res.data.artistToplist.coverUrl
				})
			},
			getBiaoSheng(){
				axios.post("/top/list",{
					idx:3
				}).then(res=>{
					this.biaosheng = res.data.playlist;
					this.bl = res.data.playlist.tracks
				})
			},
			getNewRank(){
				axios.post("/top/list",{
					idx:0
				}).then(res=>{
					this.newRank = res.data.playlist
				})
			},
			getOriginal(){
				axios.post("/top/list",{
					idx:2
				}).then(res=>{
					this.original = res.data.playlist
				})
			},
			getHotRank(){
				axios.post("/top/list",{
					idx:1
				}).then(res=>{
					this.hotRank = res.data.playlist
				})
			},
			getSingerRank(){
				axios.post("/toplist/artist").then(res=>{
					this.singerRank = res.data.list.artists
					this.singerUpdate = res.data.list.updateTime
				})
			},
			play(songid){
				console.log(songid)
				console.log("触发")
				this.bus.$emit("play",[songid])
			}
		},
		mounted(){
			this.getRankType();
			this.getBiaoSheng();
			this.getNewRank();
			this.getOriginal();
			this.getHotRank();
			this.getSingerRank();
		}
	}
</script>

<style lang="less" scoped>
	.poster{
		width:175px;
		height:175px;
		background-size:100% 100%;
		border-radius:5px;
		position:relative;
		margin-right:20px;
		.date{
			width:100%;
			text-align:center;
			position:absolute;
			top:70%;
			left:0;
			color:#fff;
		}
	}
	.rank{
		padding:30px;
		.rank-head{
			text-align:left;
			margin-bottom:20px;
			color:rgb(202,202,202);
		}
		.biaosheng,.newRank,.original,.hotRank,.singer-rank{
			display:flex;
			margin-bottom:20px;
			.rank-list{
				flex:1;
				text-align: left;
				li{
					display:flex;
					color:rgb(172,172,172);
					height:35px;
					font-size:13px;
					cursor:pointer;
					align-items: center;
					padding:0 10px;
					&:last-of-type{
						i::before{
							font-size:13px;
						}
						background:none !important;
						color:rgb(132,132,132) !important;
						&:hover span ,&:hover i::before{
							color:rgb(172,172,172) !important
						}
					}
					&:nth-of-type(odd){
						background:rgb(42,42,42)
					}
					&:hover{
						background:rgb(50,50,50)
					}
					strong{
						width:20px;
						font-size:13px;
						height:100%;
						line-height:35px;
					}
					p{
						flex:1;
						line-height:35px;
						text-align: left;
					}
					span{
						max-width:200px;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
				}
			}
		}
		.other-rank{
			display:flex;
			flex-wrap:wrap;
			justify-content: space-around;
			li{
				width:160px;
				margin-bottom:40px;
				text-align: left;
				.rank-box{
					height:160px;
					width:160px;
					background-size: 100% 100%;
					border-radius:5px;
				}
				.desc{
					line-height:30px;
					font-size:13px;
				}
			}
		}
	}
</style>
