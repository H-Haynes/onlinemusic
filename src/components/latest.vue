<template>
	<div class="home-latest" @dblclick="play(song.id)">
		<div class="poster">
			<img v-lazy="song.picUrl" />
		</div>
		<span class="sort">{{index+1 > 9 ?index+1 :'0'+(index+1) }}</span>
		<div class="song-info">
			<p class="song-name">{{song.name}}</p>
			<p class="author">
				<i class="icon icon-sq" v-if="song.song.privilege.maxbr>320000"></i>
				<!-- <i class="icon icon-hq"></i> -->
				<span class="artists">
					<template v-for="(artist,index) in song.song.artists">
						{{index>0?'/'+artist.name:artist.name}}
					</template>
				</span>
			</p>
		</div>
		<div @click="tomv(song.song.mvid)" class="mv">
			<i class="icon icon-play" v-if="song.song.mvid" ></i>
		</div>
	</div>
</template>

<script>
	import {mapState} from "vuex"
	export default{
		props:{
			song:{
				type:Object,
				required:true
			},
			index:{
				type:Number,
				required:true
			}
		},
		computed:{
			...mapState(['playList'])
		},
		methods:{
			play(songid){
				this.bus.$emit("play",[songid])
			},
			tomv(id){
				location.href=`/video.html?mvid=${id}&type=m`
			}
		}
	}
</script>

<style lang="less" scoped>
	.home-latest{
		padding:10px;
		box-sizing: border-box;

		border-radius:5px;
		cursor:pointer;
		display:flex;
		align-items: center;
		&:hover{
			background:rgb(42,44,46);
		}
		.poster{
			display:flex;
			width:70px;
			height:70px;
			align-items: center;
			img{
				width:70px;
				height:70px;
				border-radius:5px;
			}
		}
		.sort{
			width:30px;
			font-size:13px;
			color:rgb(83,93,103)
		}
		.song-info{
			flex:1;

			height:100%;
			overflow:hidden;
			display: flex;
			flex-direction: column;
			justify-content: center;
			
			.song-name{
				white-space: nowrap;
				overflow: hidden;
				overflow: hidden;
				text-overflow: ellipsis;
				font-size:14px;
				text-align: left;
				color:rgb(172,172,172);
			}
			.author{
				text-align:left;
				overflow:hidden;
				display:flex;
				align-items: center;
				.icon{
					font-size:20px;
					margin-right:3px;
					.icon-sq::before{
						vertical-align: text-bottom;
					}
				}
				.artists{
					flex:1;
					font-size:12px;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					color:rgb(124,124,124)
				}
			}
		}
		.mv{
			width:30px;
			transform: scale(0.7);
			.icon-play{
				font-size:10px;
				color:rgb(160,30,30);
				padding:3px 5px 3px 7px;
				border:1px solid rgb(160,30,30);
				border-radius:5px;
			}
		}
	}
</style>
