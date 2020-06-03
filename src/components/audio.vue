<!-- 全局音频 -->
<template>
	<audio ref="audio" :src="audioSrc"></audio>
</template>

<script>
	import axios from "axios"
	import {mapState,mapActions,mapMutations} from "vuex"
	export default{
		data(){
			return {
				audio:"",
				// playList:[],
				// playIndex:0,
				//播放状态:pause,play
				currentSong:{},
				audioSrc:""
			}
		},
		computed:{
			...mapState(['currentSongId','audioStatus','lyric',"playList","playIndex"])
		},
		methods:{
			...mapActions(['changeLyric','changeAudioStatus']),
			...mapMutations(['changePlayIndex','changePlayList'])
		},
		mounted(){
			const self = this;
			this.audio = this.$refs.audio;
			this.audio.ontimeupdate = function(e){
				self.$store.commit("changeCurrentTime",e.target.currentTime);
				self.$store.commit("changeDuration",e.target.duration);
			}
			this.audio.onended = function(){	//播放完毕 
				// self.audioStatus = "paused";
				// self.$store.commit("changeAudioStatus",'paused');
				self.changeAudioStatus('paused');
				if(self.playList[self.playIndex+1]){
					//存在下一首则自动播放
					// self.playIndex++;
					self.changePlayIndex(self.playIndex + 1);
					self.bus.$emit("play",[self.playList[self.playIndex]])
				}else{
					//不存在，是否开启了循环;
					console.log(self.playList[self.playIndex]);

					console.log("切歌")
					self.changePlayIndex(0);
					console.log(self.playList[self.playIndex]);
					setTimeout(()=>{
						self.bus.$emit("play",[self.playList[self.playIndex]])
					})
				}
			}
			this.bus.$on("play",([songid,replace])=>{

				if(songid instanceof Array){
					//传入了一个数组，批量
					if(replace){
						self.changePlayList(songid);
						self.changePlayIndex(0);
						songid = self.playList[0];
					}else{
						//规则，去除当前播放列表中当前播放项之后的重复歌曲，记录当前播放id，最后将index修正
						var currentIndex = self.playList.findIndex(ele=>ele == self.audioInfo.id);
						var newPlayList = self.playList;
						for(var i = currentIndex;i<newPlayList.length;i++){
							if(songid.includes(newPlayList[i])){
								newPlayList.splice(i,1);
								i -- ;
							}
						}
						newPlayList = newPlayList.concat(songid);
						self.changePlayList(newPlayList);
						self.changePlayIndex(newPlayList.findIndex(ele=>ele.id == self.audioInfo.id));
						//不替换就先不切歌，
						return;
					}
				}else if(typeof songid == 'number' ){

					if(self.audioInfo && songid == self.audioInfo.id) return;
					//单个id,由于旧代码的兼容，将replace作为是否立即播放的标志，false为立即播放
					if(replace){
						//检查是否存在该歌曲
						var idx = self.playList.findIndex(ele=>ele == songid)
						if(idx!=-1){
							var newlist = self.playList;
							newlist.splice(idx,1);
							self.changePlayList(newlist.concat(songid));
							self.changePlayIndex(self.playList.findIndex(ele=>ele == self.audioInfo.id));
						}else{//不存在直接添加在最后
							self.changePlayList(self.playList.concat(songid))
						}
						return ;//不立即播放的
					}else{//立即播放的
						console.log('查看5')

							var idx1 = self.playList.findIndex(ele=>ele == songid);

							if(idx1!=-1){
								var newlist1 = self.playList.slice();	//复制
								newlist1.splice(idx1,1);
								self.changePlayList(newlist1.concat(songid));
								console.log('重复')
							}else{
								self.changePlayList(self.playList.concat(songid));
								console.log('没有重复');
								console.log(self.playList)
							}
							self.changePlayIndex(self.playList.length-1>=0 ? self.playList.length-1 : 0);
					}
				}else{
					//没有传入任何值，切歌
					console.log('触发了切歌')
				}

				console.log("触发播放",songid == self.playList[self.playIndex])
				
					axios.post("/song/url",{
						// id:songid
						id:self.playList[self.playIndex]
					}).then(res=>{
						self.audioSrc = res.data.data[0].url;
						self.audio.oncanplay = ()=>{
							self.audio.play();
							self.changeAudioStatus("play");
						}
						
						//获取歌曲详细信息
						axios.post("song/detail",{
							// ids:songid.toString()
							ids:self.playList[self.playIndex].toString()
						}).then(success=>{
							self.audioInfo = success.data.songs[0]
							self.$store.dispatch("changeAudioInfo",success.data.songs[0])
							return axios.post('/lyric',{	//获取歌词
										// id:songid.toString()
										id:self.playList[self.playIndex]
								})
						},err=>{
							console.log("获取歌曲信息时出错",err);
							self.$toast({
								title:"获取歌曲信息错误"
							})
							self.$emit('changeStatus','paused')
						}).then(res=>{
							console.log(res)
							if(!res.data || !res.data.lrc || !res.data.lrc.lyric){
								var lyric1 = [
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
								this.changeLyric(lyric1);
								return 
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
							var lyric2 =lyricObj.sort((a,b)=>a.time-b.time);
							this.changeLyric(lyric2);
						})
					},err=>{
						console.log("获取歌曲播放地址出错",err)
					})
			})
			
			this.bus.$on("changeCurrent",time=>{
				this.audio.currentTime = time;
			})
			this.bus.$on('changeStatus',()=>{
				if(self.audioStatus == 'play'){
					//改为暂停
					self.audio.pause();
					// self.$store.commit("changeAudioStatus",'paused')
					self.changeAudioStatus('paused')
				}else if(self.audioStatus == 'paused'){
					self.audio.play();
					// self.$store.commit("changeAudioStatus",'play')
					self.changeAudioStatus('play')
				}
			})

		}
		
	}
</script>

<style>
	
</style>