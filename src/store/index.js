import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		uid:"",
		audioInfo:"",
		audioStatus:"paused",//当前音频状态
		currentTime:0,
		duration:0,
		showLogin:false,
		showSearchResult:false,
		lyric : [
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
		],
		likeList:[],
		playList:[],
		playIndex:0,
		subAlbum:[],
		subArt:[],
		subVideo:[],
		userDetail:{},
		subList:[],
	},
	mutations: {
		changeUid(state,uid){
			state.uid = uid
		},
		changeAudioInfo(state,info){
			state.audioInfo = info
		},
		changeCurrentTime(state,time){
			state.currentTime = time;
		},
		changeDuration(state,duration){
			state.duration = duration;
		},
		changeAudioStatus(state,status){
			state.audioStatus = status;
		},
		changeShowLogin(state,isShow){
			state.showLogin = isShow
		},
		changeShowSearchResult(state,isShow){
			state.showSearchResult = isShow
		},
		changeLyric(state,lyric){
			state.lyric = lyric
		},
		changeLikeList(state,list){
			state.likeList = list
		},
		changePlayIndex(state,index){
			state.playIndex = index
		},
		changePlayList(state,list){
			state.playList = list;
		},
		changeSubAlbum(state,list){
			state.subAlbum = list;
		},
		changeSubArt(state,list){
			state.subArt = list;
		},
		changeSubVideo(state,list){
			state.subVideo = list;
		},
		changeUserDetail(state,info){
			state.userDetail = info;
		},
		changeSubList(state,list){
			state.subList = list;
		}
	},
	actions: {
		changeUid({commit},val){
			commit('changeUid',val)
		},
		changeAudioInfo({commit},info){
			commit('changeAudioInfo',info)
		},
		changeShowLogin({commit},isShow){
			commit('changeShowLogin',isShow)
		},
		changeShowSearchResult({commit},isShow){
			commit("changeShowSearchResult" , isShow)
		},
		changeLyric({commit},lyric){
			commit("changeLyric" , lyric)
		},
		changeLikeList({commit},list){
			commit("changeLikeList" , list)
		},
		changePlayIndex({commit},index){
			commit("changePlayIndex",index)
		},
		changePlayList({commit},list){
			commit("changePlayList",list)
		},
		changeAudioStatus({commit},status){
			commit('changeAudioStatus',status)
		}
	},
	
	modules: {
	}
})
