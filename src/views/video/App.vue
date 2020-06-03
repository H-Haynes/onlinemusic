<template>
	<div id="app">
		<div class="base-content-wrapper" >
			<div class="base-content">
				<ul class="system-operate">
					<li class="icon"></li>
					<li class="icon"></li>
					<li class="icon"></li>
				</ul>
				
				<div class="login-box" v-show="showLogin">
					<div class="login-box-mask" @click="showLogin=false"></div>
					<div class="login-content">
						<span class="icon icon-close" @click="showLogin=false"></span>
						<div class="login-form">
							<div class="bg"><span class="phone icon icon-phone"></span></div>

							<div class="login-info">
								<div class="tel">
									<div class="prefix">
										<span class="phone icon icon-phone"></span>
										<span class="prefix-num">{{ nowPrefix }}</span>
										<span class="triangle"></span>
									</div>
									<input type="number" v-model="loginForm.phone" @focus="hideError" placeholder="请输入手机号" />
								</div>
								<div class="password">
									<span class="icon icon-lock"></span>
									<input type="password" autocomplete="off" @focus="hideError" v-model="loginForm.pwd" placeholder="请输入密码" />
									<span class="reset-pwd">重设密码</span>
								</div>
								<p class="errormsg">{{ loginMsg }}</p>
							</div>

							<p class="sub-login" @click="login" :style="{ background: loginlock ? 'rgb(170,170,170)' : 'rgb(199,27,27)' }">登录</p>
							<a class="register">注册</a>
							<ul class="login-way">
								<li class="icon icon-wechat"></li>
								<li class="icon icon-qq"></li>
								<li class="icon icon-weibo"></li>
								<li class="icon icon-wangyi"></li>
							</ul>

							<div class="proctol">
								<label>
									<input type="checkbox" v-model="isAgreeProctol" />
									同意
								</label>
								<a href="javascript:;">服务条款</a>
								、
								<a href="javascript:;">隐私条款</a>
								、
								<a href="javascript:;">儿童隐私政策</a>
							</div>
						</div>
					</div>
				</div>
				<div class="search-bar">
					<input placeholder="🔍搜索" />
					<span class="icon icon-setting"></span>
					<span class="icon icon-message"></span>
					<span class="icon icon-skin"></span>
					<span class="icon icon-mini"></span>
				</div>
				<div class="content-header"></div>
				<div class="video-content-wrap" ref="wrapper">
					<div class="video-content">
						<div class="left">
							<p class="page-title">
								<span class="back-page" @click="historyBack"><i class="icon icon-back"></i>
								{{type=='v'?'视频':'MV'}}详情</span>
								
							</p>
							
							<div class="player">
								<video ref="video" @click="playVideo" :src="type=='v'?(urls[0] && urls[0].url):urls" :poster="videoInfo.coverUrl"></video>
								<span class="play" v-show="isPaused" @click="playVideo"><i class="icon icon-play"></i></span>
							</div>
							
							<div class="author">
								<p>
									<img :src="type=='v'?(videoInfo.creator && videoInfo.creator.avatarUrl):(videoInfo.cover)"/>
									<a>{{type=='v'?(videoInfo.creator && videoInfo.creator.nickname):videoInfo.artistName}}</a>
								</p>
								
								<span class="follow">+ 关注</span>
							</div>
							
							<div class="video-info">
								<p class="video-name">{{type=="v"?videoInfo.title:videoInfo.name}}</p>
								<p class="play-info">
									<span>发布：{{videoInfo.publishTime|toDateStr}}</span>
									<span>播放：{{type=='v'?videoInfo.praisedCount:videoInfo.playCount|fixedNum}}次</span>
								</p>
								<div class="group">
									<span v-for="tag in videoInfo.videoGroup" :key="tag.id">{{tag.name}}</span>
								</div>
							</div>
							
							<div class="count">
								<p>
									<span class="zan">
										<i class="icon icon-zan"></i>
										赞({{type=='v'?videoInfo.praisedCount:videoInfo.likeCount}})
									</span>
									<span class="collect">
										<i class="icon icon-collect"></i>
										收藏({{type=='v'?videoInfo.subscribeCount:videoInfo.subCount}})
									</span>
									<span class="share">
										<i class="icon icon-share"></i>
										分享({{videoInfo.shareCount}})
									</span>
								</p>
								<a href="javascript">举报</a>
							</div>
							
							<div class="comment">
								<p class="title">
									<strong>听友评论</strong>
									<span>(已有{{total}}条评论)</span>
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
									<a href="javascript:;" class="send-btn" @click="sendComment">评论</a>
									<span>{{140-commentContent.length}}</span>
								</div>
							</div>
							
							<div class="hot-comment">
								<p class="title">精彩评论</p>
								<comment type="video" v-for="item in hotComment" :key="item.commentId" :comment="item"></comment>
							</div>
							
							<div class="comments">
								<p class="title" ref="latest">最新评论 <a href="javascript:;" name="latest"></a><span>({{total}})</span></p>
								<comment type="video" v-for="item in comments" :key = "item.commentId" :comment="item"></comment>
								
							</div>
							<div class="page">
								<a href="#latest" ref="hook" @click="scroll($event)"></a>
								<Page class-name="pagination" :current.sync="page" :page-size="20" :styles="{background:'none !important'}" :total="total" @on-change="changeCommentPage($event)"/>
							</div>
							
						</div>
						<div class="right">
							<p class="title">相关推荐</p>
							<ul>
								<li v-for="item in relativeList"  :key="item.id" @click="refresh(type=='v'?item.vid:item.id)">
									<div class="poster" :style="{backgroundImage:'url('+(type=='v'?item.coverUrl:item.cover)+')'}"></div>
									<div class="info">
										<p class="name">{{type=='v'?item.title:item.name}}</p>
										<span class="author">by <a>{{type=='v'?item.creator[0].userName:item.artistName}}</a></span>
									</div>
								</li>
							</ul>
						</div>			
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>

import axios from "axios"
import {Page} from "view-design"
import comment from "@/components/comment"
export default {
		components:{
			Page,
			comment
		},
		data(){
			return {
					nowPrefix:"+86",
					telPrefixList:[
						{
							country:"中国",
							prefix:"+86",
							icon:"icon-china"
						},
						{
							country:"中国香港",
							prefix:"+852",
							icon:"icon-hongkong"
						},
						{
							country:"中国澳门",
							prefix:"+853",
							icon:"icon-macau"
						},
						{
							country:"中国台湾",
							prefix:"+886",
							icon:"icon-taiwan"
						},
					],
					loginForm:{
						phone:"",
						pwd:""
					},
					isAgreeProctol:false,
					showLogin:false,
					loginMsg:"",
					// userAccount:{},
					userId:"",
					token:"",
					userDetail:{},
					showUserInfoBox:false,
					loginlock:false,
					isPaused:true,
					relativeList:[],
					vid:"",
					urls:[],
					videoInfo:{},
					commentContent:"",
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
					],
					total:0,
					showEmoji:false,
					page:1,
					hotComment:[],
					comments:[],
					type:"",
					mvid:""
				}
				
		},
		methods:{
			login(){
				const self = this;
				if(!this.isAgreeProctol){
					this.$toast({
						message:'请先勾选同意服务条款、隐私政策、儿童隐私政策',
						// type:'loading',
						position:'middle',
						duration:1000
					});

				}else if(!this.loginForm.phone.trim()){				//检查手机号
					this.loginMsg = "请输入手机号";
					return;
				}else if(!this.loginForm.pwd.trim()){
					this.loginMsg = "请输入登录密码";
					return;
				}else{
					this.loginlock = true;
					axios.post("/login/cellphone",{
							phone:this.loginForm.phone,
							password:this.loginForm.pwd
					}).then(res=>{
						this.loginlock = false;
						if(res.data.code===200){
							this.userId = res.data.account.id;
							this.$store.dispatch('changeUid',this.userId);
							this.token = res.data.token;

							this.$toast({
								message:"登陆成功"
							});
							// this.showLogin = false;
							// this.$store.commit("changeShowLogin",false)
							this.changeShowLogin(false)
							//获取用户详情
							this.getUserDetail()
						}
					}).catch(function (error) {
						self.loginlock = false;
						if(error.response) {
							self.$toast({
								message:error.response.data.msg,
								duration:2000
							})
						}
					});

				}
			},
			hideError(){
				this.loginMsg = ""
			},
			getUserDetail(){
				axios.post("/user/detail",{
					uid:this.userId
				}).then(res=>{
					if(res.status ===200){
						this.userDetail = res.data;
					}
				})
			},
			preventBubble(e){
				e.stopPropagation()
			},
			historyBack(){
				history.back(1)
			},
			historyForward(){
				history.forward(1)
			},
			playVideo(){
				if(this.$refs.video.paused){
					this.$refs.video.play()
				}else{
					this.$refs.video.pause()
				}
			},
			getRelative(){
				if(this.type=='v'){
					axios.post("/related/allvideo",{
						id:this.vid
					}).then(res=>{
						this.relativeList = res.data.data
					})
				}else{
					axios.post("/simi/mv",{
						mvid:this.mvid
					}).then(res=>{
						this.relativeList = res.data.mvs
					})
				}
				
			},
			getVideoUrl(){
				if(this.type=="v"){
					return	axios.post("/video/url",{
						id:this.vid
					}).then(res=>{
						this.urls = res.data.urls;
					})
				}else if(this.type=="m"){
					return	axios.post("/mv/url",{
						id:this.mvid
					}).then(res=>{
						this.urls = res.data.data.url;
					})
				}
				
			},
			getVideoInfo(){
				if(this.type=='v'){
					axios.post("/video/detail",{
						id:this.vid
					}).then(res=>{
						this.videoInfo = res.data.data
					})
				}else if(this.type=='m'){
					axios.post("/mv/detail",{
						mvid:this.mvid
					}).then(res=>{
						this.videoInfo = res.data.data
					})
				}
				
			},
			refresh(id){
				//切换视频
				if(this.type=='v'){
					this.vid = id;
				}
				this.playVideo()

				if(this.type=="m"){
					this.mvid = id
				}
				this.getComment();
				this.getVideoInfo();
				this.getVideoUrl().then(()=>{
					this.playVideo()
				});
				this.getRelative();
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
						id:this.type=='v'?this.vid:this.mvid,
						t:1,
						type:this.type=='v'?5:1,
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
			getComment(){

					axios.post(`/comment/${this.type=='v'?'video':'mv'}`,{
						limit:20,
						offset:(this.page-1)*20,
						id:this.type=='v'?this.vid:this.mvid
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
		},
		
		
		mounted(){
			let href=location.search.split("?")[1];
			href = href.split("&");
			if(href){
				for(var i = 0;i<href.length;i++){
					let temp = href[i].split("=");
					if(temp[0]=='id'){
						this.vid = temp[1];
					}
					if(temp[0]=='type'){
						this.type=temp[1]
					}
					if(temp[0]=='mvid'){
						this.mvid=temp[1]
					}
				}
			}else{
				alert("未传入视频相关信息")
			}
			this.getVideoInfo();
			this.getVideoUrl();
			this.getComment();
			const self = this;
			this.getRelative()
			document.onclick=function(){
				self.showEmoji = false;
			}
			this.$refs.video.onplay = function(){
				self.isPaused = false;
			}
			this.$refs.video.onpause = function(){
				self.isPaused = true;
			}
			this.$refs.video.onended = function(){
				self.isPaused = true;
			}
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
			timeFormat(val){
				if(!val) return "--:--:--"
				var hours = val/36000;
				var min = Math.floor(val%3600/60);
				var sec = Math.floor(val%3600%60);
				var result = "";
				if(hours>1){
					result += hours > 9 ? `${hours}` : `0${hours}:`
				}
				result += min >9 ? `${min}` : `0${min}:`;
				result += sec > 9 ? `${sec}` : `0${sec}`;
				return result;
			},
			fixedNum(val){
				if(val<10000){
					return val;
				}else if(val<1000000){
					return (val/10000).toFixed(1)+'万'
				}else if(val<100000000){
					return Math.ceil(val/10000) + '万'
				}else{
					return (val/100000000).toFixed(1)+'亿'
				}
			},
			toDateStr(val){
				var date =  new Date(val);
				var year = date.getFullYear();
				var month = date.getMonth()+1;
				var day = date.getDate();
				function addZero(val){
					return val>9?val : '0'+val
				}
				return year +'-'+ addZero(month)+'-'+ addZero(day)
			}
			
		}
	}


</script>
<style lang="less">

	#app {
		// font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		// color: #2c3e50;	
		width: 100%;
		height: 100%;
		background: #ccc;
		display: flex;
		justify-content: center;
		align-items: center;
		min-width:1000px;
	}
	body,
	html {
		width: 100%;
		height: 100%;
	}
	
	.base-content-wrapper {
		width: 1000px;
		background: rgb(33, 33, 33);
		border: 1px solud purple;
		height: 700px;
		border-radius: 5px;
		overflow: hidden;
		position: relative;
		.base-content{
			/* width:100%; */
			width:1000px;
			height:700px;

			/* border-bottom:1px solid #444; */
			.system-operate {
				position: absolute;
				left: 10px;
				top: 15px;
				display: flex;
				cursor: pointer;
				z-index:999;
				// background: rgb(252, 72, 71);
				li {
					width: 15px;
					height: 15px;
					border-radius: 50%;
					cursor: pointer;
					margin-right: 8px;
					display: flex;
					justify-content: center;
					align-items: center;
					&:first-of-type{
						background: rgb(252, 72, 71);
						&::before{
							content: '\e7a5';
							color: rgb(108, 7, 2);
						}

					}
					&:nth-of-type(2){
						background: rgb(253, 181, 37);
						&::before{
							content: '\e63c';
							color: rgb(134, 19, 3);
						}
					}
					&:last-of-type{
						background: rgb(42, 202, 51);
						
						&::before{
							content: '\ea47';
							color: rgb(11, 84, 12);
						}
					}
					&::before{
						font-size: 12px;
						height: 15px;
						line-height: 15px;
						display: none;
					}
					
				}
				&:hover li::before{
					display: inline-block;
				}
			}
			
			.login-box{
				width:100%;
				height:100%;
				position: absolute;
				left:0;
				top:0;
				z-index:998;
				.login-box-mask{
					width:100%;
					height:100%;
				}
				.login-content{
					width:350px;
					height:480px;
					background:#fff;
					border-radius:5px;
					position:absolute;
					left:50%;
					top:50%;
					transform:translate(-50%,-50%);
				}
				.login-form{
					width:250px;
					height:400px;
					/* border:1px solid red; */
					margin:60px auto 0 ;
					.bg{
						width:100%;
						/* background-image:url("@/assets/images/login_bg.jpg"); */
						background-size:100% 100%;
						height:80px;
						display:flex;
						justify-content: center;
						align-items: center;
						.phone{
							font-size:80px;
							color:rgb(237,136,141);
						}
					}
					.login-info{
						width:100%;
						height:80px;
						margin:30px 0;
						border:1px solid rgb(214,214,214);
						border-radius:5px;
						.tel{
							display:flex;
							align-items:center;
							height:40px;
							border-bottom:1px solid rgb(214,214,214);
							box-sizing:border-box;
							padding:0 10px;
							.prefix{
								flex:1;
								height:40px;
								line-height:40px;
								border-right:1px solid rgb(214,214,214);
								display:flex;
								align-items: center;
								cursor:pointer;
								.phone{
									width:20px;
									color:#aaa;
								}
								.triangle{
										width:0;
										height:0;
										border:5px solid transparent;
										margin:0 10px;
										border-top-color:rgb(135,135,135);
								}
								.prefix-num{
									flex:1;
									font-size:12px;
								}
							}
							input{
								flex:2;
								border:none;
								outline: none;
								font-size:12px;
								margin-left:10px;
								font-weight:700;
							}
						}
						.password{
							display:flex;
							height:40px;
							align-items: center;
							padding:0 10px;
							.icon-lock{
								width:20px;
								margin-right:10px;
							}
							input{
								flex:1;
								border:none;
								font-size:12px;
								outline: none;
							}
						}
						.reset-pwd{
							width:60px;
							text-align: center;
							font-size:12px;
							color:rgb(178,178,178);
							cursor:pointer;
						}
						.errormsg{
							color:red;
							font-size:12px;
							margin-top:5px;
							text-align:right;
						}
					}
					.sub-login{
						height:40px;
						line-height:40px;
						font-size:18px;
						letter-spacing: 5px;
						font-weight:500;
						color:#fff;
						background:rgb(199,27,27);
						cursor: pointer;
						border-radius:3px;
					}
					.register{
						height:40px;
						line-height:40px;
						text-decoration: underline;
						cursor:pointer;
					}
					.login-way{
						display:flex;
						height:50px;
						justify-content: space-between;
						align-items: center;
						li{
							font-size:18px;
							padding:5px;
							border:1px solid rgb(195,195,195);
							border-radius:50%;
							color:rgb(83,83,83);
							cursor:pointer;
						}
					}
					.proctol{
						font-size:10px;
						margin-top:20px;
						color:rgb(180,180,180);
						a{
							color:#409eff;
							text-decoration: none;
						}
					}
				}
				.icon-close{
					position:absolute;
					left:10px;
					top:10px;
					font-size:12px;
					color:rgb(150,150,150);
					cursor:pointer
				}
				
			}
			
			.search-bar{
				position:absolute;
				right:0px;
				top:0px;
				color:rgb(213,213,213);
				height:70px;
				display: flex;
				align-items: center;
				input {
					width:150px;
					height:24px;
					border:none;
					outline:none;
					border-radius:24px;
					text-indent:20px;
					background:rgb(50,57,64);
					color:rgb(213,213,213)
				}
				span{
					margin:0 10px;
					cursor:pointer;
				}	
			}
			.content-header{
				height:60px;
				width:100%;
				background:rgb(35,33,33)
			}
			.video-content-wrap{
				height:640px;
				width:100%;
				// border:1px solid red;
				box-sizing: border-box;
				padding:10px 20px;
				overflow-y: scroll;
				.video-content{
					display:flex;
					width:100%;
					// height:4000px;
					.left{
						flex:1;
						margin-right:30px;
						// border:1px solid green;
						.page-title{
							text-align:left;
							height:30px;
							line-height:30px;
							color:rgb(202,202,202);
							font-weight: bolder;
							i{
								&::before{
									font-size:14px;
									font-weight: normal;
								}
							}
						}
						.player{
							margin-top:10px;
							height:340px;
							width:100%;
							// border:1px solid red;
							border-radius:10px;
							overflow: hidden;
							position: relative;
							cursor: pointer;
							video{
								width:100%;
								height:100%;
								object-fit: contain;
								background:#000;
							}
							.play{
								width:60px;
								height:60px;
								background:rgba(240,240,240,.5);
								border-radius:50%;
								position: absolute;
								left:50%;
								top:50%;
								display:flex;
								justify-content: center;
								align-items: center;
								transform: translate(-50%,-50%);
								i{
									color:#e40;
									font-size:20px;
								}
							}
						}
						.author{
							margin-top:30px;
							display:flex;
							justify-content: space-between;
							align-items: center;
							p{
								display:flex;
								align-items: center;
								img{
									width:50px;
									height:50px;
									border-radius:50%;
									margin-right:10px;
								}
							}
							.follow{
								padding:5px 15px;
								background:rgb(45,35,35);
								border-radius:15px;
								font-size:14px;
								color:rgb(250,50,50);
								cursor:pointer;
							}
						}
						.video-info{
							margin-top:30px;
							text-align:left;
							.video-name{
								font-size:22px;
								font-weight:bolder;
								color:rgb(202,202,202)
							}
							.play-info{
								line-height:30px;
								font-size:13px;
								span{
									color:rgb(100,100,100);
									margin-right:30px;
								}
							}
							.group{
								span{
									padding:0 8px;
									font-size:13px;
									margin-right:10px;
									height:20px;
									line-height:20px;
									border-radius:20px;
									display:inline-block;
									background:rgb(42,42,42);
									color:rgb(202,202,202);
									cursor:pointer;
								}
							}
							
						}
						.count{
							display: flex;
							justify-content: space-between;
							align-items: center;
							margin-top:30px;
							p{
								display:flex;
								span{
									padding:0 15px;
									height:30px;
									line-height:30px;
									border-radius:30px;
									border:1px solid rgb(72,72,72);
									margin-right:10px;
									font-size:13px;
									cursor: pointer;
									&:hover{
										background: rgb(40,40,40);
									}
									.icon{
										font-size:16px;
										&::before{
											vertical-align: middle;
										}
									}
								}
								
							}
							a{
								text-decoration: underline;
								font-size: 13px;
							}
						}
						.comment{
							text-align: left;
							margin-top:30px;
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
								font-size: 16px;
								padding: 5px;
								color:rgb(202,202,202)
							}
							
							.other{
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
						.hot-comment,.comments{
							text-align: left;
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
					.right{
						width:320px;
						.title{
							height:30px;
							line-height:30px;
							color:rgb(202,202,202);
							font-weight: bolder;
						}
						ul{
							li{
								display:flex;
								margin:20px 0;
								.poster{
									flex-shrink: 0;
									width:160px;
									height:100px;
									border-radius:5px;
									background-size:100% 100%;
									margin-right:10px;
								}
								.info{
									text-align: left;
									font-size:13px;
									display: flex;
									flex-direction: column;
									justify-content: space-around;
									font-weight: 800;
									*{
										cursor: pointer;
									}
									.name{
										color:rgb(202,202,202);
									}
									.author{
										color:rgb(120,120,120);
										a{
											color:rgb(120,120,120);
											&:hover{
												color:rgb(200,200,200);
											}
										}
										
									}
								}
							}
						}
					}
				}
				
			}
		}
	}
	
	

	.red{
		color:rgb(195,36,37)
	}
</style>