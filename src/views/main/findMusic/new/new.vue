<template>
	<div class="new">
		<ul class="tabbar">
			<li :class="{checked:check==1}" @click="checkTab(1)">新歌速递</li>
			<li :class="{checked:check==2}" @click="checkTab(2)">新碟上架</li>
		</ul>
		
		<div class="operate">
			<ul class="filter">
				<li><a href='javascript:;'>全部</a></li>
				<li><a href='javascript:;'>华语</a></li>
				<li><a href='javascript:;'>欧美</a></li>
				<li><a href='javascript:;'>韩国</a></li>
				<li><a href='javascript:;'>日本</a></li>
			</ul>
			<div class="other" v-if="check==1">
				<span @click="playAll">播放全部</span>
				<span>收藏全部</span>
			</div>
			<div class="toggle-type" v-if="check==2">
				<span :class="{darkred:currentCDType == 0}">推荐</span>
				<span :class="{darkred:currentCDType == 1}">全部</span>
			</div>
		</div>	
		
		<ul class="list" v-if="check == 1">
			<li v-for="(song,index) in newList" :key="song.id" @dblclick="play(song.id)">
				<span class="no">{{index+1}}</span>
				<div class="song-info">
					<div class="poster" >
						<img v-lazy=song.album.blurPicUrl />
						<i class="icon icon-play"></i>
					</div>
					<p class="song-name">
						{{song.name}}
						<template v-if="song.transName && song.transName.length>0">
							(
							<template v-for="(name,idx) in song.transName">
								{{idx ==0 ? name : '&' + name}}
							</template>
							)
						</template>
						
					</p>
					<div class="mv">
						<i class="icon icon-play" v-if="song.mvid"></i>
					</div>
					<i class="icon icon-sq" v-if="song.privilege.maxbr>320000"></i>
				</div>
				<p class="artist">
					<template v-for="(art,idx) in song.artists">
						{{idx == 0 ?art.name : '/'+art.name}}
					</template>
				</p>
				<span class="album">{{song.album.name}}</span>
				<span class="duration">{{song.duration | duration}}</span>
			</li>
		</ul>
		<div class="cdList" v-if="check == 2" >
			<div class="title">本周新碟</div>
			<ul class="cds" ref="cds">
				<li v-for="item in cdList" :key ="item.id">
					<div class="poster">
						<img v-lazy=item.picUrl />
					</div>
					<p class="name">{{item.name}}</p>
					<span class="art">{{item.artist.name}}</span>
				</li>
			</ul>	
		</div>
	</div>
</template>

<script>
	import axios from "axios"
	export default {
		data(){
			return {
				check:1,
				currentType:0,
				newList:[],
				currentCDType:0,
				cdList:[],
				page:1,
				reachButtomFlag:false,
			}
		},
		methods:{
			getNewList(){
				axios.post("/top/song",{
					type:this.currentType
				}).then(res=>{
					this.newList = res.data.data
				})
			},
			getTuiList(){
				axios.post("/top/album",{
					offset:(this.page-1)*20,
					limit:20
				}).then(res=>{
					this.cdList = this.cdList.concat(res.data.albums);
					this.reachButtomFlag = false;
				},()=>{
					this.reachButtomFlag = false;
				})
			},
			play(id){
				this.bus.$emit("play",[id])
			},
			checkTab(index){
				this.check = index;
				const self = this;
				if(index == 2){
					this.$nextTick(()=>{
						document.querySelector(".home-content-wrapper").onscroll = function(e){
							if(self.$refs.cds.offsetHeight - e.srcElement.scrollTop < 600){
								if(!self.reachButtomFlag){
									console.log("次数")
									//获取下页
									self.reachButtomFlag = true;
									self.page++;
									self.getTuiList()
								}
							}
						}
					})
				}else{
					document.querySelector(".home-content-wrapper").onscroll = null
				}
			},
			playAll(){
				this.$confirm('"播放全部"将会替换当前的播放列表，是否继续?', '替换播放列表', {
					confirmButtonText: '继续',
					confirmButtonClass:'confirm-btn',
					center:true,
					showCancelButton:false,
					customClass:'confirmBox'
				}).then(()=>{
					var songid = this.newList.map(ele=> ele.id);
					this.bus.$emit('play',[songid,true])
				})
			}
			
		},
		mounted(){
			this.getNewList();
			this.getTuiList();
			
		},
		beforeRouteLeave(to,from,next){
			document.querySelector(".home-content-wrapper").onscroll = null;
			next()
		},
		filters:{
			duration:val=>{
				let min = Math.floor(val/60000);
				let sec = Math.ceil(val%60000/6000);
				function addZero(val){
					return val >9 ? val : '0'+val
				}
				return addZero(min)+":"+addZero(sec)
			}
		}
		
	}
</script>

<style scoped lang="less">
*{
	color:rgb(172,172,172);
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
	.icon-sq{
		font-size:20px;
		margin-right:3px;
	}
	.icon-sq::before{
		vertical-align: text-bottom;
	}
	.new{
		// padding:20px;
		.tabbar{
			width:200px;
			height:30px;
			border:1px solid rgb(83,83,83);
			border-radius:30px;
			align-items: center;
			display:flex;
			position: relative;
			overflow: hidden;
			margin:0 auto 10px;
			li{
				width:100px;
				height:100%;
				font-size:13px;
				line-height: 30px;
				text-align:center;
				border-radius:30px;
				color:rgb(202,202,202);
				cursor:pointer;
				&.checked{
					background:rgb(83,83,83)
				}
			}
		}
		.operate{
			padding-left:20px;
			display:flex;
			margin-bottom: 10px;
			justify-content: space-between;
			align-items: center;
			font-size:14px;
			.filter{
				display:flex;
				li{
					margin:0 15px;
				}
			}
			.other{
				span{
					display:inline-block;
					border-radius:30px;
					padding:3px 15px;
					margin:5px;
					font-size:13px;
					cursor:pointer;
					&:first-of-type{
						background:rgb(200,40,40);
						color:#fff;
					}
					&:last-of-type{
						border:1px solid rgb(132,132,132)
					}
				}
			}
			.toggle-type{
				span{
					display:inline-block;
					// margin-right:10px;
					margin:5px;
					font-size:13px;
					padding:3px 15px;
				}
			}
		}
		.list{
			li{
				display:flex;
				align-items: center;;
				height:80px;
				padding:0 20px;
				font-size:12px;
				&:nth-of-type(odd){
					background:rgb(40,38,38)
				}
				.no{
					width:40px;
					text-align: center;
				}
				.song-info{
					flex:1;
					height:100%;
					// border:1px solid red;
					display:flex;
					font-size:14px;
					align-items: center;
					overflow:hidden;
					.poster{
						width:60px;
						height:60px;
						overflow:hidden;
						position: relative;
						border-radius:5px;
						margin-right: 10px;
						img{
							width:100%
						}
						i{
							position:absolute;
							left:50%;
							top:50%;
							transform: translate(-50%,-50%);
						}
					}
					.song-name{
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						
					}
				}
				.artist{
					width:120px;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					text-align: left;
					text-indent:5px;
				}
				.album{
					width:150px;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					text-align: left;
					text-indent:5px;
				}
				.duration{
					width:60px;
				}
			}
		}
		.cdList{
			display:flex;
			padding:0 30px;
			.cds{
				flex:1;
				// height:800px;
				display:flex;
				flex-wrap: wrap;
				justify-content: space-between;
				li{	
					width:150px;
					margin-bottom:30px;
					text-align: left;
					.poster{
						width:100%;
						height:150px;
						background-size:100% 100%;
						border-radius:5px;
						overflow:hidden;
						img {
							width:100%;

						}
					}
					.name{
						text-align: left;
						font-size:14px;
						overflow:hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						margin-top:5px;
					}
					.art{
						width:100%;
						font-size:12px;
						color:rgb(150,150,150);
					}
				}
			}
			.title{
				height:40px;
				width:40px;
				position:sticky;
				top:40px;
				font-weight:bolder;
				flex-shrink:0;
				margin-right:20px
			}
		}
	}
</style>
