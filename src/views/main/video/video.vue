<template>
	<div class="videos">
		<div class="typebar">
			<span class="current-type">全部视频<i class="icon icon-forward"></i></span>
			
			<ul class="type-list">
				<li v-for="type in typeList.slice(0,11)" :key="type.id" >{{type.name}}</li>
			</ul>
		</div>
		<ul class="video-list">
			<li v-for="video in videoList" :key="video.id" @click="toVideo(video.data.vid)">
				<div class="poster" :style="{backgroundImage:'url('+video.data.coverUrl+')'}">
					<span class="play-count"><i class="icon icon-play-hollow"></i>{{video.data.praisedCount}}</span>
					<span class="duration">{{video.data.durationms|durationFormat}}</span>
					<span class="play">
						<i class="icon icon-play"></i>
					</span>
				</div>
				<p class="title">{{video.data.title}}</p>
				<span class="description">{{video.data.description}}</span>
			</li>
		</ul>
	</div>
</template>

<script>
	import axios from "axios"
	export default {
		data(){
			return{
				typeList:[],
				videoList:[]
			}
		},
		methods:{
			getType(){
				return axios.post("/video/group/list").then(res=>{
					this.typeList = res.data.data;
					return new Promise(resolve=>resolve())
				})
			},
			getVideoList(){
				axios.post("/video/group",{
					id:this.typeList[0].id
				}).then(res=>{console.log(res)
					this.videoList = this.videoList.concat(res.data.datas)
				})
			},
			toVideo(id){
				console.log(id)
				location.href=`/video.html?id=${id}&type=v`
			}
		},
		mounted(){
			this.getType().then(()=>{
				this.getVideoList();
				this.getVideoList()
			})
		},
		filters:{
			durationFormat(val){
				if(!val) return "--:--:--"
				var hours = val/3600000;	//时
				var min = Math.floor(val%3600000/60000);	//分
				var sec = Math.round(val%3600000%60000/1000);	//秒
				var result = "";
				if(hours > 1){
					result += hours>9?`${hours}:` : `0${hours}:`
				}
				result += min > 9 ? `${min}:`: `0${min}:`;
				result += sec > 9 ? `${sec}`:`0${sec}`;
				return result;
			},
		}
		
	}
</script>

<style lang="less" scoped>
*{
	color:rgb(172,172,172)
}
	.videos{
		padding:10px 30px;
		.typebar{
			display: flex;
			justify-content: space-between;
			align-items: center;

			.current-type{
				height:24px;
				line-height:24px;
				font-size:12px;
				flex-shrink:0;
				text-align:center;
				border-radius:24px;
				padding:0 10px;
				border:1px solid rgb(172,172,172);
				cursor: pointer;
				i::before{
					font-size:12px;
				}
			}
			.type-list{
				display: flex;
				align-items: center;
				li{
					height:100%;
					margin-left:15px;
					flex-shrink: 0;
					cursor: pointer;
					
					&:hover{
						color:rgb(202,202,202)
					}
				}
			}
		}
		.video-list{
			width:100%;
			margin-top:30px;
			display:flex;
			justify-content: space-between;
			flex-wrap:wrap;
			li{
				width:200px;
				margin-bottom:30px;
				text-align:left;
				.poster{
					width:200px;
					height:120px;
					background-size:100% 100%;
					border-radius:5px;
					overflow:hidden;
					display:flex;
					justify-content: center;
					align-items: center;
					position:relative;
					.play-count{
						position: absolute;
						top:5px;
						right:5px;
						i{
							font-size:12px;
							margin-right:5px;
						}
					}
					.duration{
						position:absolute;
						bottom:5px;
						right:5px;
					}
					.play{
						width:50px;
						height:50px;
						border-radius:50%;
						background:rgba(200,200,200,.7);
						text-align:center;
						line-height:50px;
						transition:all .3s linear;
						opacity: 0;
						i{
							color:#C82525;
							font-size:18px;
						}
					}
					&:hover .play{
						opacity: 1;
					}
				}
				.title{
					line-height:30px;
					white-space: nowrap;
					overflow:hidden;
					text-overflow: ellipsis;
					font-size:13px;
					color:rgb(202,202,202)
				}
				.description{
					white-space:nowrap;
					overflow:hidden;
					text-overflow: ellipsis;
					text-align: left;
					width:200px;
					display:inline-block;
					font-size:!3px;
					color:rgb(100,100,100)
				}
			}
		}
	}
	
</style>
