
<template>
	<div class="fm" v-cloak>
		<div class="header-bar"></div>
		<div class="fm-info-wrapper" ref="wrapper">
			<div class="fm-box">
				<div class="song-info">
					<div class="poster">
						<img v-lazy="FMList[currentIndex] && FMList[currentIndex].album.picUrl" />
						<span class="status" :class="{
							pause:!FMList[currentIndex] || audioInfo.id != FMList[currentIndex].id || audioStatus=='paused',
							playing:FMList[currentIndex] && (audioInfo.id == FMList[currentIndex].id && audioStatus =='play')
						}">
							<i class="icon icon-play" v-if="!FMList[currentIndex] || audioInfo.id != FMList[currentIndex].id || audioStatus=='paused'" @click="toPlay()"></i>
							<i class="icon icon-pause" v-else @click="toPause()"></i>
						</span>
					</div>
					<div class="controls">
						<span><i class="icon icon-like-hollow"></i></span>
						<span @click="next"><i class="icon icon-nextone"></i></span>
						<span @click="trash"><i class="icon icon-del"></i></span>
						<span><i class="icon icon-more"></i></span>
					</div>
				</div>
				<div class="lyric" v-if="FMList[currentIndex]">
					<div class="song-name">
						{{FMList[currentIndex]&&FMList[currentIndex].name}}
						<span v-if="FMList[currentIndex].mvid">
							<i class="icon icon-mv ml5"></i>
						</span>
						<div class="quality ml5">
							<span @click="showQuality=true">
								{{quality==1 ? '标准品质':(quality==2 ? '较高品质' :'极高品质')}}
							</span>
							<ul v-show="showQuality">
								<li :class="{red:quality==1}" @click="checkQuality(1)">标准品质</li>
								<li :class="{red:quality==2}" @click="checkQuality(2)">较高品质</li>
								<li :class="{red:quality==3}" @click="checkQuality(3)">极高品质</li>
							</ul>
						</div>
					</div>
					<p class="artists">
						<span class="album">专辑:<i>{{FMList[currentIndex].album && FMList[currentIndex].album.name}}</i></span>
						<span class="singer">歌手:<i>{{FMList[currentIndex].artists[0] && FMList[currentIndex].artists[0].name}}</i></span>
					</p>
					<div class="fm-lyric-wrapper" >
						<!-- <div class="lyric-content" v-html="lyric">
							
						</div> -->
						<ul class='fm-lyric-content'>
							<li v-for="(text,index) in lyric"  :data-time="text.time" :key="text.time+index">
								<!-- :class="{current:text.time>=(currentTime-2)*100000 && (lyric[index+1]&&lyric[index+1].time >= (currentTime-2)*100000)}" -->
								{{text.text}}
							</li>
						</ul>
					</div>
				</div>
				
				
			</div>
			<div class="comment">
				<p class="title">
					<strong>听友评论</strong>
					<span>(已有{{total}}条评论)</span>
				</p>
				<div class="write" @click="showComment" >
					<span>
						<i class="icon icon-write"></i>
						发表评论
					</span>
					<span>
						<i class="icon icon-emoji"></i>
						<i class="icon icon-aite"></i>
					</span>
				</div>
				
				<div class="hot-comment">
					<p class="title">精彩评论</p>
					<comment v-for="item in hotComment" :key="item.commentId" :comment="item"></comment>
				</div>
				
				<div class="comments">
					<p class="title" ref="latest">最新评论 <a href="javascript:;" name="latest"></a><span>({{total}})</span></p>
					<comment v-for="item in comments" :key = "item.commentId" :comment="item"></comment>
					
				</div>
				<div class="page">
					<a href="#latest" ref="hook" @click="scroll($event)"></a>
					<Page 
						class-name="pagination" 
						:current.sync="page" 
						:page-size="20" 
						:styles="{background:'none !important'}" 
						:total="total" 
						@on-change="changeCommentPage($event)"/>
				</div>
				
			</div>
		</div>
		
		<div class="send-comment-wrapper" v-show="showCommentBox">
			<div class="mask" @click="showCommentBox=false"></div>
			<div class="send-comment">
				<p class="title">
					<i class="icon icon-close" @click="showCommentBox=false"></i>
					歌曲：{{FMList[currentIndex] && FMList[currentIndex].name}}
				</p>
				<textarea v-model="commentContent" style="width:100%"></textarea>
				
				<div class="other">
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
					<span>{{140-commentContent.length}}</span>
				</div>
				
				<div class="btns">
					<span class="send-btn" @click="sendComment">评论</span>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import $ from "jquery"
	import axios from "axios"
	import {mapState,mapMutations} from "vuex"
	import comment from "@/components/comment.vue"
	import {Page} from "view-design"
	export default {
		components:{
			comment,
			Page
		},
		data(){
			return {
				showCommentBox:false,
				commentContent:"",
				showQuality:false,
				quality:1,
				currentIndex:0,
				FMList:[],
				lyric:[],
				timer:null,
				page:1,
				hotComment:[],
				comments:[],
				total:0,
				showEmoji:false,
				emoji:[
					{
						text:"[大笑]",
						pic:"😄"
					},
					{
						text:"[可爱]",
						pic:"😊"
					},
					{
						text:"[憨笑]",
						pic:"😌"
					},
					{
						text:"[色]",
						pic:"😍"
					},
					{
						text:"[亲亲]",
						pic:"😘"
					},
					{
						text:"[惊恐]",
						pic:"😱"
					},
					{
						text:"[流泪]",
						pic:"😭"
					},
					{
						text:"[亲]",
						pic:"😚"
					},
					{
						text:"[呆]",
						pic:"😳"
					},
					{
						text:"[哀伤]",
						pic:"😔"
					},
					{
						text:"[龇牙]",
						pic:"😬"
					},
					{
						text:"[吐舌]",
						pic:"😝"
					},
					{
						text:"[撇嘴]",
						pic:"😒"
					},
					{
						text:"[怒]",
						pic:"😡"
					},
					{
						text:"[奸笑]",
						pic:"😏"
					},
					{
						text:"[汗]",
						pic:"😓"
					},
					{
						text:"[痛苦]",
						pic:"😖"
					},
					{
						text:"[惶恐]",
						pic:"😨"
					},
					{
						text:"[生病]",
						pic:"😰"
					},
					{
						text:"[口罩]",
						pic:"😷"
					},
					{
						text:"[大哭]",
						pic:"😂"
					},
					{
						text:"[晕]",
						pic:"😵"
					},
					{
						text:"[发怒]",
						pic:"👿"
					},
					{
						text:"[开心]",
						pic:"😀"
					},{
						text:"[鬼脸]",
						pic:"😜"
					},
					{
						text:"[皱眉]",
						pic:"😞"
					},
					{
						text:"[流感]",
						pic:"😢"
					},
					{
						text:"[心碎]",
						pic:"💔"
					},
					{
						text:"[钟情]",
						pic:"💘"
					},
					{
						text:"[星星]",
						pic:"⭐️"
					},
					{
						text:"[生气]",
						pic:"💢"
					},
					{
						text:"[便便]",
						pic:"💩"
					},
					{
						text:"[强]",
						pic:"👍"
					},
					{
						text:"[弱]",
						pic:"👎"
					},
					{
						text:"[拜]",
						pic:"🙏"
					},
					{
						text:"[牵手]",
						pic:"👬"
					},
					{
						text:"[跳舞]",
						pic:"👯"
					},
					{
						text:"[禁止]",
						pic:"🙅"
					},
					{
						text:"[这边]",
						pic:"💁"
					},
					{
						text:"[爱意]",
						pic:"💑"
					},
					{
						text:"[示爱]",
						pic:"💏"
					},
					{
						text:"[嘴唇]",
						pic:"👄"
					},
					{
						text:"[狗]",
						pic:"🐶"
					},
					{
						text:"[猫]",
						pic:"🐱"
					},
					{
						text:"[猪]",
						pic:"🐷"
					},
					{
						text:"[兔子]",
						pic:"🐰"
					},
					{
						text:"[小鸡]",
						pic:"🐤"
					},
					{
						text:"[公鸡]",
						pic:"🐓"
					},
					{
						text:"[圣诞]",
						pic:"🤶"
					},
					{
						text:"[外星]",
						pic:"👽"
					},
					{
						text:"[钻石]",
						pic:"💎"
					},
					{
						text:"[礼物]",
						pic:"🎁"
					},
					{
						text:"[男孩]",
						pic:"👦"
					},
					{
						text:"[女孩]",
						pic:"👧"
					},
					{
						text:"[蛋糕]",
						pic:"🎂"
					},
					{
						text:"[18]",
						pic:"🔞"
					},
					{
						text:"[圈]",
						pic:"⭕️"
					},
					{
						text:"[叉]",
						pic:"❌"
					}
				]
			}
		},
		computed:{
			...mapState(['uid','audioStatus','currentTime','audioInfo','duration']),
			
		},
		methods:{
			...mapMutations(['changeShowLogin']),
			showComment(){
				if(this.uid){
					this.showCommentBox = true;
				}else{
					// this.$store.commit("changeShowLogin",true)
					this.changeShowLogin(true)
				}
			},
			getFM(){
				return	axios.post("/personal_fm").then(res=>{
					this.FMList = res.data.data;
					this.getLyric();
					//如果未在播放状态，进入页面则直接播放第一首
					if(this.audioStatus=='paused'){
						this.bus.$emit("play",[this.FMList[this.currentIndex].id])
					}
					this.getComment()
					return new Promise(resolve=>resolve())
				})
			},
			checkQuality(index){
				this.quality = index;
				this.showQuality = false;
			},
			getLyric(){
				axios.post('/lyric',{
					id:this.FMList[this.currentIndex].id
				}).then(res=>{
					if(!res.data || !res.data.lrc || !res.data.lrc.lyric){
						this.lyric = [
							{
								time:0,
								text:''
							},
							{
								time:0,
								text:''
							},
							{
								time:0,
								text:''
							},
							{
								time:0,
								text:''
							},
							{
								time:0,
								text:''
							},
							{
								time:0,
								text:'该歌曲为没有填词的纯音乐，请您欣赏!'
							},
						]
						return;
					}
					let lyric = decodeURIComponent(res.data.lrc.lyric);
					// console.log(decodeURIComponent(lyric))
					var reg = /\[\d+:\d+[.][\d]*]/g;					//匹配所有的时间的正则
					let list = lyric.split("\n");
					let lyricObj = []
					for(var i = 0;i<list.length;i++){
						//得到歌词
						var lyricText = list[i].split("]");
						lyricText = lyricText[lyricText.length-1];
						//时间数组
						var timeArray = list[i].match(reg);
						if(!timeArray){//没有时间
							lyricObj.push({
								time:0,
								text:lyricText
							})
							continue ;
						}
						for(let x =0 ;x < timeArray.length;x++){
							let info = {};
							info.text = lyricText;
							let time = timeArray[x].replace(/(\[|])/g,'').split(":").reverse();
							// console.log(time)
							info.time=(+time[0])*1000 + (+time[1]*60000);
							lyricObj.push(info);
						}
						
						
						
						
						// lyricObj[i] = {};
						// let time = list[i].split("]")[0].replace("[",'');
						// lyricObj[i].text = list[i].split("]")[1];

						// if(time){
						// 	time = time.split(":").reverse();
						// 	lyricObj[i].time = (+time[0])*1000 + (+time[1]*60000);

						// }else{
						// 	lyricObj[i].time=0;
						// }
					}
					if(lyricObj.length==0){
						this.lyric = [
							{
								time:0,
								text:''
							},
							{
								time:0,
								text:''
							},
							{
								time:0,
								text:''
							},
							{
								time:0,
								text:''
							},
							{
								time:0,
								text:''
							},
							{
								time:0,
								text:'该歌曲为没有填词的纯音乐，请您欣赏!'
							},
						]
						return;
					}
					this.lyric =lyricObj.sort((a,b)=>a.time-b.time)
				})
			},
			getComment(){
				axios.post("/comment/music",{
					limit:20,
					offset:(this.page-1)*20,
					id:this.FMList[this.currentIndex].id
				}).then(res=>{
					if(this.page==1){
						this.hotComment = res.data.hotComments;
					}
					if(this.page!=1){
						this.$nextTick(()=>{
							this.$refs.wrapper.scrollTop=this.$refs.latest.offsetTop-100
						})
					}

					this.comments = res.data.comments;
					this.total = res.data.total;
					
				})
			},
			changeCommentPage(page){
				this.page = page;
				this.getComment();
			},
			toPlay(){
				//如果当前播放的就是这首，则改变状态，否则进行播放
				if(!this.FMList[this.currentIndex]) return;
				if(this.audioInfo.id == this.FMList[this.currentIndex].id){
					this.bus.$emit("changeStatus")
				}else{
					this.bus.$emit('play',[this.FMList[this.currentIndex].id])
				}
			},
			toPause(){
				this.bus.$emit("changeStatus")
			},
			next(){
				//如果有下一首，则切歌，没有则重新拉取列表，并重置指针
				if(this.FMList[this.currentIndex+1]){
					this.currentIndex++;
					this.page=1;
					this.getLyric()
					this.toPlay()
				}else{
					this.currentIndex=0
					this.getFM().then(()=>{
						this.toPlay()
					})
				}
			},
			trash(){
				axios.post("/fm_trash",{
					id:this.FMList[this.currentIndex].id
				}).then(()=>{
					this.next()
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
						id:this.FMList[this.currentIndex].id,
						t:1,
						type:0,
						content:this.commentContent,
					}).then(res=>{
						console.log(res)
						if(res.data.code==200){
							this.$toast({
								message:"发送成功"
							})
							this.showCommentBox = false;
							this.getComment()
						}
					})
				}
			}
		},
		mounted(){
			this.getFM();
			const self = this;
			document.onclick=function(){
				self.showEmoji = false;
			}
		},
		watch:{
			currentTime:function(val){
				if(this.audioInfo.id != this.FMList[this.currentIndex].id) return;	//不是当前播放的歌曲，不滚动歌词
				clearInterval(this.timer)
				var li = $(".fm-lyric-wrapper li");
				let current = li.filter(function(index,ele){	//找到当播放的歌词行，双语可能有多行
					// if(Math.abs($(ele).attr("data-time") - val*1000) <= 1500){

					// 	return $(ele)
					// }
						//当前时间大于歌词行的时间且小于下一行的时间
						if(val * 1000>= $(ele).attr("data-time") && (li[index+1]?val*1000 <$(li[index+1]).attr("data-time"):true) ){
							return $(ele)
						}
				})

				li.removeClass("current");	//所有行移除高亮
				current.addClass("current");	//当前播放的加上高亮


				let index = $(".fm-lyric-content li").index(current.last())
				
				// let speed = Math.ceil((index>7 ? (index-7)*30:0)/Math.ceil(300 / 16));
				// this.timer = setInterval(()=>{
				// 	if($(".lyric-wrapper").get(0).scrollTop==(index>7 ? (index-7)*30:0)){
				// 		clearInterval(self.timer)
				// 	}
				// 	$(".lyric-wrapper").get(0).scrollBy(0,speed)
				// },16)

				// $(".lyric-wrapper").get(0).scroll(0,index>7 ? (index-7)*30:0);
				console.log(index)
				$(".fm-lyric-wrapper ul").css({
					marginTop:index>6 ? -(index-6)*30:0
				});


				
				
				
				// var li = document.querySelectorAll(".lyric-wrapper li");	//获取所有的歌词行
				// for(var i=0;i<li.length;i++){
				// 	let time = li[i].dataset.time;		//当前行歌词的开始时间
				// 	if(Math.abs(time - val*1000) <= 500){	//误差1秒内视为当前正在播放的歌词
				// 		li[i].classList.add('red');	//当前行设置为高亮
				// 	}else{
				// 		// li[i].classList.remove("red")
				// 	}
				// }
			}
		}
}
</script>
<style scoped lang="less">
	*{
		color:rgb(172,172,172)
	}
	.current{
		font-size:16px;
		// color:#f40 !important;
		// text-shadow:1px 0px 0 orangered,
		// 			0px 1px 0 orangered;
		background-image:-webkit-linear-gradient(right,#f40,orange,yellow,green,skyblue,cyan,purple); 
			-webkit-background-clip:text; 
			-webkit-text-fill-color:transparent;
	}
	.router-link-exact-active{
		
		color:#c82525 !important
	}

	.fm{
		width:100%;
		height:100%;
		position: relative;
		.header-bar{
			height:70px;
			background:rgb(32,32,32);
		}
		.fm-info-wrapper{
			height:calc(100% - 70px);
			background:rgb(23,24,25);
			overflow-y:scroll;
			.fm-box{
				height:500px;
				// border:1px solid red;
				display: flex;
				margin:0 30px;				
				.song-info{
					width:350px;
					display: flex;
					flex-direction: column;
					justify-content: space-around;
					align-items: center;;
					.poster{
						width:300px;
						height:300px;
						margin:0 auto;
						border-radius:5px;
						overflow: hidden;
						position:relative;
						img{
							width:100%;
						}
						.status{
							transition:all .3s linear;
							position:absolute;
							width:50px;
							height:50px;
							border-radius:50%;
							background:rgba(230,230,230,.7);
							left:0;
							top:0;
							overflow:hidden;
							&.pause{
								left:50%;
								top:50%;
								transform: translate(-50%,-50%);
							}
							&.playing{
								left:240px;
								top:240px;
							}
							i{
								color:#f40;
								width:100%;
								height:100%;
								font-size:20px;
								line-height:50px;
								text-align:center;
							}
						}
					}
					.controls{
						width:300px;
						display:flex;
						justify-content: space-between;
						font-size:20px;
						span{
							width:50px;
							height:50px;
							background:rgb(42,42,42);
							line-height:50px;
							text-align: center;
							border-radius:50%;
							cursor: pointer;
							&:hover i{
								color:#fff;
							}
						}
					}
				}
				.lyric{
					flex:1;
					display:flex;
					flex-direction: column;
					text-align: left;
					.song-name{
						font-size:20px;
						line-height:40px;
						font-weight:500;
						.icon::before{
							font-size:23px;
						}
						
						.quality{
							font-size:12px;
							border-radius:2px;
							border:1px solid rgb(190,35,35);
							padding:2px 8px;
							line-height:1;
							font-weight: normal;
							color:rgb(190,35,35);
							display: inline-block;
							position:relative;
							top:-3px;
							span{
								color:rgb(190,35,35)
							}
							ul{
								position: absolute;
								top:20px;
								left:10px;
								background:rgb(32,32,32);
								width:150px;
								font-size:13px;
								border-radius:5px;
								text-align: center;
								li{
									width:100%;
									padding: 10px 0;
									cursor:pointer;
									&:hover{
										background:rgb(42,42,42)
									}
								}
							}
						}
					}
					.artists{
						font-size:12px;
						display:flex;
						line-height:30px;
						margin-bottom:20px;
						// margin-bottom: 20px;
						span{
							font-size:12px;
							flex:1;
							i{
								color:rgb(110,160,210)
							}
						}
					}
					.fm-lyric-wrapper{
						// border:1px solid cyan;
						flex:1;
						overflow-y:scroll;
						.fm-lyric-content{
							line-height:30px;
							font-size:14px;
							color:rgb(132,132,132)
						}
						ul{
							line-height:40px;
							font-size:14px;
							color:rgb(132,132,132);
							font-weight:400;
							transition:all .3s linear;
							li{
								height:30px;
								overflow: hidden;
							}
						}
					}
				}
			}
			.comment{
				height:100px;
				padding:0 30px;
				margin-top:50px;
				text-align: left;
				p.title{
					strong{
						font-size:18px;
						margin-right:20px;
					}
					span{
						font-size:13px;
						color:rgb(172,172,172)
					}
				}
				.write{
					margin-top:20px;
					height:30px;
					background:rgb(42,45,49);
					display:flex;
					padding:0 10px;
					justify-content: space-between;
					align-items:center;
					font-size:13px;
					.icon{
						font-size:18px;
						margin-right:5px;
						cursor:pointer;
					}
				}
			}
			.hot-comment,.comments{
				margin-top:50px;
				.title{
					font-weight:bolder;
					color:rgb(202,202,202);
					font-size:18px;
					span{
						font-size:13px;
						font-weight:normal
					}
				}
				ul{
					margin-top:30px;
					li{
						margin:30px 0;
						display:flex;
						font-size:14px;
						img{
							width:50px;
							height:50px;
							margin-right:20px;
							border-radius:50%;
							flex-shrink: 0;
						}
					}
				}
			}
		}
		.send-comment-wrapper{
			position: absolute;
			background:transparent;
			left:0;
			top:0;
			width:100%;
			height:100%;
			.mask{
				width:100%;
				height:100%;
				background:transparent;
			}
			.send-comment{
				width:480px;
				height:260px;
				position:absolute;
				left:50%;
				top:50%;
				transform: translate(-50%,-50%);
				background:rgb(45,45,45);
				border-radius:5px;
				padding:10px 20px;
				.title{
					height:40px;
					line-height:40px;
					font-size:18px;
					color:rgb(162,172,202);
					font-weight: bolder;
					position: relative;
					overflow:hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					i{
						float:left;
						font-size:20px;
						color:rgb(100,100,100);
						font-weight:100;
						cursor: pointer;
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
				}
				.other{
					display:flex;
					justify-content: space-between;
					.special{
						font-size:18px;
						span{
							position:relative;
							margin:0 5px;
							cursor: pointer;
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
				}
				.btns{
					margin-top:20px;
					display:flex;
					justify-content: flex-end;
					span{
						width:80px;
						height:30px;
						line-height:30px;
						color:rgb(202,202,202);
						border-radius:30px;
						background: rgb(195,36,37);
						letter-spacing: 5px;
						cursor:pointer
					}
				}
			}
		}
		
	}

	.page{
		margin: 30px 0;
		text-align: center;
	}
	
		
		

</style>
