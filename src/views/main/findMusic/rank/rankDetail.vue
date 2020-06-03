<template>
	<div class="rankDetail">
		<div class="nav-bar"></div>
		<div class="rank-detail" ref="wrapper">
			<div class="desc">
				<img v-lazy="rankList.coverImgUrl" />
				<div class="info">
					<p class="name">
						<span class="tag">歌单</span>
						<strong>{{rankList.name}}</strong>
					</p>
					<div class="author">
						<img :src="rankList.creator ? rankList.creator.avatarUrl :require('@/assets/images/default-headimg.png')"  width="30"/>
						<a href="javascript:;">{{rankList.creator ?rankList.creator.nickname : ''}}</a>
						<span>最近更新:{{new Date(rankList.updateTime).getMonth()+1}}月{{new Date(rankList.updateTime).getDate()}}日</span>
					</div>

					<ul class="operate">
						<li>
							<span @click="playAll"><i class="icon icon-circle-play" ></i>播放全部</span>
							<span><i class="icon icon-plus"></i></span>
						</li>
						<li>
							<i class="icon icon-collect" v-if="subList.some(ele=>ele.id==desc.id)" @click="addMark(2)">取消收藏({{ desc.subscribedCount | fixedNum }})</i>
							<i class="icon icon-collect" v-else @click="addMark(1)">收藏({{ desc.subscribedCount | fixedNum }})</i>
						</li>
						<li><i class="icon icon-share"></i>分享({{rankList.shareCount}})</li>
						<li><i class="icon icon-download">下载全部</i></li>
					</ul>

					<p class="count">
						<span>歌曲数:<i>{{rankList.trackCount}}</i></span>
						<span>播放数:<i>{{Math.ceil(rankList.playCount/1000)}}万</i></span>
					</p>

					<p class="description">简介：<i>{{rankList.description}}</i></p>
				</div>
			</div>

			<div class="menu">
				<ul class="tab">
					<li @click="changeTab(0)" :class="{red:tab==0}">歌曲列表</li>
					<li @click="changeTab(1)" :class="{red:tab==1}">评论列表({{commentTotal}})</li>
					<li @click="changeTab(2)" :class="{red:tab==2}">收藏者</li>
					<li class="active" :style="{left:tab*130+'px'}"></li>
				</ul>
			</div>
			
			<div class="list-table" v-if="tab==0">
				<el-table 
					:data="rank" 
					stripe 
					:row-style="{background:'rgb(27,27,27)',height:'40px'}"
					:header-row-style="{background:'rgb(27,27,27)',borderBottom:'none',height:'30px'}"
					:header-cell-style="{background:'rgb(27,27,27)'}"
					@row-dblclick="toPlay($event)"
					>
					<el-table-column label="" width="10px"></el-table-column>
					<el-table-column label=""  align="center" width="50px">
						<template slot-scope="scope">
							<i class="icon icon-volume red" v-if="scope.row.id == audioInfo.id"></i>
							<template v-else>{{scope.$index+1}}</template>
						</template>
					</el-table-column>
					<el-table-column label="" width="30px" v-if="idx!=3">
						<template slot-scope="scope">
							<i class="icon icon-sheng red" v-if="upList[scope.$index].lr>scope.$index"></i>
							<i class="icon icon-jiang blue" v-else-if="upList[scope.$index].lr<scope.$index"></i>
							<i class="icon icon-ping " v-else-if="upList[scope.$index].lr==scope.$index"></i>
							<i class="icon icon-new green" style="font-size:20px" v-else></i>

						</template>
					</el-table-column>
					<el-table-column label="" width="30px" align="center">
						<template slot-scope="scope">
							<a href="javascript:;">
								<i class="icon icon-like" v-if="likeList.includes(scope.row.id)" @click="addLike(scope.row.id,false)" style="cursor:pointer"></i>
								<i class="icon icon-like-hollow" v-else @click="addLike(scope.row.id,true)" style="cursor:pointer"></i>
							</a>
						</template>
					</el-table-column>
					<el-table-column label="" width="30px" align="center">
						<template slot-scope="scope">
							<a href="javascript:;">
								<i class="icon icon-download" :key="scope.row.id" style="cursor:pointer"></i>
							</a>
						</template>
					</el-table-column>
					<el-table-column label="音乐标题" min-width="120px">
						<p slot-scope="scope" 
							class="text-ellipses flex" 
							:class="{red:scope.row.id == audioInfo.id}"
							>
							<span class="flex1">{{scope.row.name}}</span>
							
							<i class="icon icon-video red ml5 fs12" v-if="scope.row.mv" @click="toMv(scope.row.mv)"></i>
						</p>
					</el-table-column>
					<el-table-column label="飙升率" width="80px" align="center" v-if="this.idx==3">
						<template slot-scope="scoped">{{upList[scoped.$index].ratio}}%</template>	
					</el-table-column>
					<el-table-column label="歌手" min-width="120px">
						<p slot-scope="scope" class="text-ellipses">
							<template v-for="(singer,index) in scope.row.ar" >
								<router-link tag="a" :to="{name:'art',params:{art_id:singer.id}}" href="javascript:;" :key="singer.id">{{index==0?singer.name : '/'+singer.name}}</router-link>
							</template>
						</p>
					</el-table-column>
					<el-table-column label="专辑" min-width="100px">
						<p slot-scope="scope" class="text-ellipses">{{scope.row.al.name}}</p>
					</el-table-column>
					<el-table-column label="时长" min-width="50px">
						<template slot-scope="scoped">
							{{scoped.row.dt | duration}}
						</template>
					</el-table-column>
					<el-table-column  width="10px"></el-table-column>
				</el-table>
			</div>

			<!-- <div class="comment-wrapper" v-if="tab==1">
				<div class="comment-fun-wrap">
					<textarea v-model="commentContent" rows="4" style="width:100%"></textarea>
					<div class="comment-fun">
						<span  >
							<i class="icon icon-emoji" @click.stop="showEmoji = true"></i>
							<ul class="emojiList" v-show="showEmoji">
								<li v-for="item in emoji" :key="item.pic" @click.stop="addEmoji(item.pic)">{{item.pic}}</li>
							</ul>
						</span>
						<span><i class="icon icon-aite" @click = "addAite"></i></span>
						<span><i class="icon" @click="addJing">#</i></span>
					</div>
					<a href="javascript:;" class="send-btn" @click="sendComment">评论</a>
					<span>{{140-commentContent.length}}</span>
				</div>

			</div> -->
			<div class="comment-wrapper" v-if="tab==1">
				<div class="comment">
					<textarea v-model="commentContent" style="width:100%"></textarea>
					
					<div class="comment-fun">
						<div class="special">
							<span  >
								<i class="icon icon-emoji" @click.stop="showEmoji = true"></i>
								<ul class="emojiList" v-show="showEmoji">
									<li v-for="item in emoji" :key="item.pic" @click.stop="addEmoji(item.pic)">{{item.pic}}</li>
								</ul>
							</span>
							<span><i class="icon icon-aite" @click = "addAite"></i></span>
							<span><i class="icon" @click="addJing">#</i></span>
						</div>
						<a href="javascript:;" class="send-btn" @click="sendComment">评论</a>
						<span>{{140-commentContent.length}}</span>


					</div>

					<div class="hot-comment">
						<p class="title">精彩评论</p>
						<comment type="video" v-for="item in hotComment" :key="item.commentId" :comment="item"></comment>
					</div>
					
					<div class="comments">
						<p class="title" ref="latest">最新评论 <a href="javascript:;" name="latest"></a><span>({{commentTotal}})</span></p>
						<comment type="video" v-for="item in commentList" :key = "item.commentId" :comment="item"></comment>
					</div>
					<div class="page">
						<a href="#latest" ref="hook" @click="scroll($event)"></a>
						<Page class-name="pagination" :current.sync="page" :page-size="20" :styles="{background:'none !important'}" :total="commentTotal" @on-change="changeCommentPage($event)"/>
					</div>
				</div>
			</div>

			<div class="subscribe-list" v-if="tab==2">
				<ul>
					<li v-for="user in subscribeList" :key="user.id">
						<img :src="user.avatarUrl" />
						<a href="javascript:;">{{user.nickname}}</a>
						<i class="icon icon-male" v-if="user.gender==1"></i>
						<i class="icon icon-female" v-else></i>
					</li>
				</ul>

				<!-- <Page class-name="pagination" :current.sync="subPage" :page-size="20" :styles="{background:'none !important'}" :total="subTotal" @on-change="changeSubPage($event)"/> -->

			</div>
		</div>
	</div>
</template>

<script >
	import axios from "axios"
	import comment from "@/components/comment.vue"
	import {Page} from "view-design"
	import {mapState,mapMutations} from "vuex"

	import {emoji} from "@/utils/emoji"
	export default{
		props:["idx"],
		components:{
			comment,
			Page
		},
		data(){
			return {
				rankList:{},
				desc:{},
				tab:0,
				rank:[],
				upList:[],
				commentList:[],
				hotComment:[],
				commentTotal:0,
				showEmoji:false,
				emoji:emoji,
				commentContent:"",
				page:1,
				subscribeList:[],
				subPage:1,
			}
		},
		mounted(){
			const self = this;
			this.getRankList();
			this.getRankDesc();
			document.onclick=function(){
				self.showEmoji = false;
			}
		},
		computed:{
			...mapState(["audioInfo","likeList",'subList','uid'])
		},
		methods:{
			...mapMutations(["changeLikeList",'changeSubList']),
			getRankDesc(){
				axios.post("/toplist/detail").then(res=>{
					// this.desc = res.data.list[this.idx]
					console.log(res.data.list)
					switch(+this.idx){
						case 0:this.desc = res.data.list[1]; break;
						case 1:this.desc = res.data.list[3]; break;
						case 2:this.desc = res.data.list[this.idx]; break;
						case 3:this.desc = res.data.list[0];break;
					}
					this.getComment();
					this.getSubscribeList();
				})
			},
			getRankList(){
				axios.post("/top/list",{
					idx:this.idx
				}).then(res=>{
					this.rankList = res.data.playlist;
					this.rank = res.data.playlist.tracks;
					this.upList = res.data.playlist.trackIds;
				})
			},
			changeTab(tab){
				if(this.tab == tab){
					return
				}else{
					this.tab  = tab;
				}
			},
			addLike(id,mode){
				axios.post("/like",{
					id,
					like:mode
				}).then(()=>{
					this.$toast({
						message:mode ? '已添加至喜欢列表~':'已从喜欢列表移除~'
					});
					if(mode){
						this.changeLikeList(this.likeList.concat(id));
					}else{
						var list = this.likeList;
						var index = this.likeList.findIndex(ele=>ele==id);
						console.log(index)
						list.splice(index,1)
						this.changeLikeList(list);
					}
				})
			},
			toPlay(e){
				this.bus.$emit("play",[e.id]);
			},
			toMv(id){
				location.href=`/video.html?mvid=${id}&type=m`
			},
			getComment(){
				console.log("调用")
				axios.post("/comment/playlist",{
					id:this.desc.id,
					limit:20,
					offset:(this.page-1)*20,
				}).then(res=>{
					console.log(res)


					if(this.page==1){
							this.hotComment = res.data.hotComments;
					}
					if(this.page!=1){
						this.$nextTick(()=>{
								this.$refs.wrapper.scrollTop=this.$refs.latest.offsetTop-100
						})
					}
					// this.hotComment = res.data.hotComments;
					this.commentTotal = res.data.total;
					this.commentList = res.data.comments;
				})
			},
			addEmoji(text){
				this.commentContent +=text;
			},
			addAite(){
				this.commentContent +="@";
			},
			addJing(){
				this.commentContent +="#";
			},
			sendComment(){
				if(!this.commentContent.trim()){
					this.$toast({
						message:"请输入评论内容"
					})
				}else{
					axios.post("/comment",{
						id:this.desc.id,
						t:1,
						type:2,
						content:this.commentContent,
					}).then(res=>{
						if(res.data.code==200){
							this.$toast({
								message:"发送成功"
							})

							this.showCommentBox = false;
							setTimeout(()=>{
								this.getComment()
							},500)
						}else{
							this.$toast({
								message:res.data.msg
							})
						}
					})
				}
			},
			changeCommentPage(page){
				console.log(111)
				this.page = page;
				this.getComment();
			},
			getSubscribeList(){
				axios.post("/playlist/subscribers",{
					id:this.desc.id,
					limit:20,
					offset:(this.subPage-1)*20
				}).then(res=>{
					this.subscribeList = res.data.subscribers
				})
			},
			changeSubPage(page){
				this.subPage = page;
				this.getSubscribeList();
			},
			playAll(){
				this.$confirm('"播放全部"将会替换当前的播放列表，是否继续?', '替换播放列表', {
					confirmButtonText: '继续',
					confirmButtonClass:'confirm-btn',
					center:true,
					showCancelButton:false,
					customClass:'confirmBox'
				}).then(()=>{
					var songid = this.rank.map(ele=> ele.id);
					this.bus.$emit('play',[songid,true])
				})
			},
		addMark(t){
			axios.post("/playlist/subscribe",{
				t,
				id:this.desc.id
			}).then(()=>{
				this.$toast({
				message:t==1?'已收藏该歌单~':'已取消收藏哟'
				});
				axios.post("/user/playlist",{
					uid:this.uid
				}).then(res=>{
					this.changeSubList(res.data.playlist)
				})
			},err=>{
				this.$toast({
				message:err.msg
				})
			})
        },

		}

	}
</script>

<style scoped lang="less">
	*{
		color:rgb(172,172,172)
	}
	
	.rankDetail{
		height:100%;
		text-align:left;
		display:flex;
		flex-direction: column;
		.nav-bar{
			height:70px;
		}
		.rank-detail{
			flex:1;
			// border:1px solid red;
			overflow-y:scroll;
			.desc{
				padding:0 30px;
				height:250px;
				display:flex;
				align-items: center;
				&>img{
					width:200px;
					height:200px;
					border-radius:10px;
					margin-right:30px;
				}
				.info{
					flex:1;
					// border:1px solid green;
					height:100%;
					.name{
						line-height:50px;
						.tag{
							color:rgb(200,27,27) !important;
							border:1px solid rgb(200,27,27);
							font-size:13px;
							padding:2px 5px;
							vertical-align: top;
							margin-right:10px;
							border-radius:5px;
						}
						strong{
							font-size:24px;
						}
					}
					.author{
						img{
							width:30px;
							height:30px;
							border-radius:50%;
							vertical-align: middle;
							margin-right:10px;
						}
						a{
							color:skyblue;
							margin-right:20px;
						}
						span{
							font-weight:300;
						}
					}
					.operate{
						margin-top:20px;
						display:flex;
						justify-content: space-around;
						li{
							height:30px;
							border-radius:30px;
							display:flex;
							align-items:center;
							text-align:center;
							font-size:13px;
							width:22%;
							border:1px solid rgb(127,127,127);
							cursor:pointer;
							justify-content: center;
							&:first-of-type{
								display: flex;
								background:rgb(200,27,27);
								border-color:rgb(200,27,27);
								color:#fff;
								span:first-of-type{
									flex:1;
									color:#fff;
								}
								span:nth-of-type(2){
									width:30px;
									color:#fff;
									border-left:1px solid rgb(255,27,27);
								}

								i{
									color:#fff;
								}
							}
						}
					}
					.count{
						line-height:30px;
						margin-top:10px;
						font-size:13px;
						i{
							color:rgb(127,127,127);
						}
						span{
							margin-right:30px;
						}
					} 
					.description{
						line-height:30px;
						i{
							color:rgb(127,127,127)
						}
					}
				}
			}
			.menu{
				height:40px;
				display:flex;
				ul{
					margin-left:30px;
					display:flex;
					align-items:center;
					position:relative;
					li{
						width:130px;
						text-align:center;
						cursor:pointer;
						&.active{
							height:2px;
							position:absolute;
							left:0;
							bottom:0;
							background:rgb(255,27,27);
							transition:0.5s ease-in-out
						}
					}

				}
			}
			.list-table{
				padding:30px 0;
			}
			.comment-wrapper{
				padding:30px;
				.comment{
							text-align: left;
							margin-top:30px;
							.title{
								margin-top:30px;
								height:40px;
								line-height:40px;
								font-size:18px;
								color:rgb(162,172,202);
								font-weight: bolder;
								position: relative;
								overflow:hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
								strong{
									font-size:18px;
									margin-right:20px;
								}
								span{
									font-size:13px;
									color:rgb(172,172,172)
								}
							}
							textarea{
								width:100%;
								border-radius:5px;
								height:100px;
								background:rgb(54,54,56);
								border-color:rgb(35,33,33);
								resize:none;
								outline: none;
								font-size: 14px;
								padding: 5px;
								color:rgb(202,202,202)
							}
							
							.comment-fun{
								display:flex;
								justify-content: space-between;
								position:relative;
								margin-top:20px;
								.special{
									font-size:18px;
									span{
										margin:0 5px;
										cursor: pointer;
										font-size:24px;
										i::before{
											font-size:24px;
										}
										.emojiList{
											width:280px;
											background:rgb(55,55,55);
											padding:10px;
											display:flex;
											flex-wrap: wrap;
											position:absolute;
											border-radius: 5px;
											li{
												margin: 0 2px;
											}
										}
									}
								}
								&>span{
									position: absolute;
									right:10px;
									top:-45px;
									color:rgb(132,132,132)
								}
								.send-btn{
									height:30px;
									line-height:30px;
									padding:0 15px;
									border-radius:30px;
									border:1px solid rgb(72,72,72);
									&:hover{
										background:rgb(40,40,40)
									}
								}
							}
						}
			}
			.subscribe-list{
				box-sizing:border-box;
				padding:30px;
				ul{
					display:flex;
					flex-wrap:wrap;
					li{
						width:50%;
						display:flex;
						align-items:center;
						margin-bottom:20px;
						img{
							width:80px;
							height:80px;
							border-radius:50%;
							margin-right:20px;
						}
						i{
							width:24px;
							height:24px;
							border-radius:24px;
							margin-left:10px;
							.icon-male{
								background:rgba(50,100,200,.3)
							}
							.icon-female{
								background:rgba(210,50,100,.3)
							}
						}
					}
				}
			}
		}
	}
</style>
