<template>
    <div class="result">
         <div class="nav-bar"></div>
        
        <div class="about-keyword">
            <strong>{{keyword}}</strong>
            <span>
                
                <template v-if="type==1 && songTotal">
                    共找到 {{songTotal}} 首单曲
                </template>
                
                <template v-if="type==100 && singerTotal">
                    共找到 {{singerTotal}} 位歌手
                </template>

                <template v-if="type==10 && albumTotal">
                    共找到 {{albumTotal}} 张专辑
                </template>
                <template v-if="type==1000 && listTotal">
                    共找到 {{listTotal}} 个歌单
                </template>
                <template v-if="type==1002 && userTotal">
                    共找到 {{userTotal}} 位用户
                </template>
                <template v-if="type==1004 && mvTotal">
                    共找到 {{mvTotal}} 个MV
                </template>
                <template v-if="type==1014 && videoTotal">
                    共找到 {{videoTotal}} 个视频
                </template>
                <template v-if="type==1009 && radioTotal">
                    共找到 {{radioTotal}} 个电台
                </template>
                <template v-if="type==1006 && lyricTotal">
                    共找到 {{lyricTotal}} 首歌词
                </template>
            </span>
        </div>
        <ul class="result-nav">
            <li v-for="item in typeList" :class="{activeType:item.id==type}" :key="item.id" @click="changeType(item.id)">{{item.name}}</li>
        </ul>
        <div class="result-wrapper" 
            ref="wrapper" 
            v-loading="loading" 
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(33, 33, 33, 1)">
            <div class="search-content">
                <div v-show="type==1">
                        <el-table
                                :data="songList"
                                stripe
                                :row-style="{ background: 'rgb(27,27,27)', height: '30px' }"
                                :header-row-style="{
                                    background: 'rgb(27,27,27)',
                                    borderBottom: 'none',
                                    height: '30px',
                                }"
                                :header-cell-style="{ background: 'rgb(27,27,27)' }"
                                @row-dblclick="toPlay($event)"
                            >
                            <el-table-column label width="10px"></el-table-column>
                            <el-table-column label align="center" width="50px">
                                <template slot-scope="scope">
                                <i
                                    class="icon icon-volume red"
                                    v-if="scope.row.id == audioInfo.id"
                                ></i>
                                <template v-else>{{ scope.$index + 1+(page-1)*100 }}</template>
                                </template>
                            </el-table-column>

                            <el-table-column label width="30px" align="center">
                                <template slot-scope="scope">
                                <a href="javascript:;">
                                    <i class="icon icon-like" @click="addLike(scope.row.id,false)" v-if="likeList.includes(scope.row.id)"></i>

                                    <i
                                    class="icon icon-like-hollow"
                                    v-else
                                    @click="addLike(scope.row.id,true)"
                                    style="cursor:pointer"
                                    ></i>
                                </a>
                                </template>
                            </el-table-column>
                            <el-table-column label width="30px" align="center">
                                <template slot-scope="scope">
                                <a href="javascript:;" :key="scope.row.id">
                                    <i

                                    class="icon icon-download"
                                    style="cursor:pointer"
                                    ></i>
                                </a>
                                </template>
                            </el-table-column>
                            <el-table-column label="音乐标题" min-width="120px">
                                <p
                                slot-scope="scope"
                                class="text-ellipses flex"
                                :class="{ red: scope.row.id == audioInfo.id }"
                                >
                                <span class="text-ellipses">{{ scope.row.name }}</span>

                                <i
                                    class="icon icon-video red ml5 fs12"
                                    v-if="scope.row.mv"
                                    @click="toMv(scope.row.mv)"
                                ></i>
                                </p>
                            </el-table-column>

                            <el-table-column label="歌手" min-width="120px">
                                <p slot-scope="scope" class="text-ellipses" >
                                    <template v-for="(singer, index) in (scope.row.ar||scope.row.artists)">
                                        <router-link
                                        tag="a"
                                        :to="{ name: 'art', params: { art_id: singer.id } }"
                                        href="javascript:;"
                                        :key="singer.id"
                                        :style="{color:audioInfo.id == scope.row.id ? '#c82525' : 'rgb(172,172,172'}"
                                        >
                                        {{ index == 0 ? singer.name : "/" + singer.name }}
                                        </router-link>
                                    </template>
                                </p>
                            </el-table-column>
                            <el-table-column label="专辑" min-width="100px">
                                <p slot-scope="scope" class="text-ellipses">
                                {{scope.row.al ?  scope.row.al.name :scope.row.album.name}}
                                </p>
                            </el-table-column>
                            <el-table-column label="时长" min-width="50px">
                                <template slot-scope="scope">{{scope.row.duration | duration}}</template>
                            </el-table-column>
                            <el-table-column width="10px"></el-table-column>
                        </el-table>
                        
                </div>

                <div v-show="type==100">
                        <el-table 
                                :data="singerList" 
                                :show-header="false" 
                                :row-style="{ background: 'rgb(27,27,27)'}"
                                :header-row-style="{
                                    background: 'rgb(27,27,27)',
                                    borderBottom: 'none',
                                    height: '30px',
                                }"
                                @row-dblclick="toArt($event)"
                                :header-cell-style="{ background: 'rgb(27,27,27)' }">
                            <el-table-column label width="30px"></el-table-column>

                            <el-table-column align="left">
                                <p slot-scope="scope" class="singer-info">
                                    <img v-lazy=scope.row.img1v1Url width="60" height="60"/>
                                    <router-link tag="a" :to="{name:'art',params:{art_id:scope.row.id}}" href="javascript:;">{{scope.row.name}}</router-link>
                                </p>
                            </el-table-column>
                            <el-table-column align="right">
                                    <template slot-scope="scope">
                                        <i class="icon icon-user identify" v-if="scope.row.alias.length>0"></i>
                                    </template>
                            </el-table-column>
                            <el-table-column label width="30px"></el-table-column>
                        </el-table>
                </div>

                <div v-show="type==10">
                        <el-table 
                                :data="albumList" 
                                :show-header="false" 
                                :row-style="{ background: 'rgb(27,27,27)'}"
                                :header-row-style="{
                                    background: 'rgb(27,27,27)',
                                    borderBottom: 'none',
                                    height: '30px',
                                }"
                                @row-dblclick="toAlbum($event)"
                                :header-cell-style="{ background: 'rgb(27,27,27)' }">
                            <el-table-column label width="30px"></el-table-column>

                            <el-table-column >
                                <p slot-scope="scope" class="singer-info">
                                    <img v-lazy=scope.row.picUrl width="60" height="60"/>
                                    <router-link tag="a" :to="{name:'album',params:{id:scope.row.id}}" href="javascript:;">{{scope.row.name}}</router-link>
                                </p>
                            </el-table-column>
                            <el-table-column >
                                    <template slot-scope="scope">
                                       <router-link tag="a" :to="{name:'art',params:{art_id:scope.row.artist.id}}">{{scope.row.artist.name}}</router-link>
                                    </template>
                            </el-table-column>
                            <el-table-column label width="30px"></el-table-column>
                        </el-table>
                </div>

                <div v-show="type==1000">
                        <el-table 
                                :data="playList" 
                                :show-header="false" 
                                :row-style="{ background: 'rgb(27,27,27)'}"
                                :header-row-style="{
                                    background: 'rgb(27,27,27)',
                                    borderBottom: 'none',
                                    height: '30px',
                                }"
                                @row-dblclick="toAlbum($event)"
                                :header-cell-style="{ background: 'rgb(27,27,27)' }">
                            <el-table-column label width="30px"></el-table-column>

                            <el-table-column >
                                <p slot-scope="scope" class="singer-info">
                                    <img v-lazy=scope.row.coverImgUrl width="60" height="60"/>
                                    <router-link tag="a" :to="{name:'list',params:{list_id:scope.row.id}}" href="javascript:;">{{scope.row.name}}</router-link>
                                </p>
                            </el-table-column>
                            <el-table-column width="100px">
                                    <template slot-scope="scope">
                                        {{scope.row.trackCount}}首
                                    </template>
                            </el-table-column>
                            <el-table-column width="200px">
                                    <p slot-scope="scope" class="text-ellipses">
                                       <router-link tag="a" :to="{name:'art',params:{art_id:scope.row.creator.id}}">{{scope.row.creator.nickname}}</router-link>
                                    </p>
                            </el-table-column>
                            <el-table-column label width="30px"></el-table-column>
                        </el-table>
                </div>

                <div v-show="type==1002">
                        <el-table 
                                :data="userList" 
                                :show-header="false" 
                                :row-style="{ background: 'rgb(27,27,27)'}"
                                :header-row-style="{
                                    background: 'rgb(27,27,27)',
                                    borderBottom: 'none',
                                    height: '30px',
                                }"
                                @row-dblclick="toAlbum($event)"
                                :header-cell-style="{ background: 'rgb(27,27,27)' }">
                            <el-table-column label width="30px"></el-table-column>

                            <el-table-column >
                                <p slot-scope="scope" class="user-info">
                                    <img v-lazy=scope.row.avatarUrl width="70" height="70"/>
                                    <router-link tag="a" :to="{name:'album',params:{id:scope.row.id}}" href="javascript:;">{{scope.row.nickname}}</router-link>
                                    <i class="icon icon-female ml10" style="background:rgba(155,50,50,.5);border-radius:50%;padding:2px;" v-if="scope.row.gender==2"></i>
                                    <i class="icon icon-male ml10" style="background:rgba(55,100,155,.5);border-radius:50%;padding:2px;" v-if="scope.row.gender==1"></i>

                                </p>
                            </el-table-column>
                            <el-table-column align="right">
                                    <template slot-scope="scope">
                                        <template v-if="scope.row.description">
                                            {{scope.row.description }}
                                        </template>
                                        <template v-else-if="scope.row.userType==4">网易音乐人</template>
                                    </template>
                            </el-table-column>
                            <el-table-column label width="30px"></el-table-column>
                        </el-table>
                </div>

                <ul v-show="type==1004" class="mvs">
                    <li v-for="item in mvList"  :key="item.id" @click="toMv(item.id)">
						<div class="poster" :style="{backgroundImage:'url('+item.cover+')'}">
                            <span class="play-count"><i class="icon icon-play-hollow"> {{item.playCount|fixedNum}}</i></span>
                            <span class="duration">{{item.duration | duration}}</span>
                        </div>
						<div class="info">
							<p class="name text-ellipses">{{item.name}}</p>
							<span class="author">by <a>{{item.artistName}}</a></span>
						</div>
					</li>
                </ul>

                <ul v-show="type==1014" class="mvs">
                    <li v-for="item in videoList"  :key="item.id" @click="toVideo(item.id)">
						<div class="poster" :style="{backgroundImage:'url('+item.coverUrl+')'}">
                            <span class="play-count"><i class="icon icon-play-hollow"> {{item.playTime|fixedNum}}</i></span>
                            <span class="duration">{{item.durationms | duration}}</span>
                        </div>
						<div class="info">
							<p class="name text-ellipses">{{item.title}}</p>
							<span class="author">by <a>{{item.creator[0].userName}}</a></span>
						</div>
					</li>
                </ul>

                <div v-show="type==1009">
                        <el-table 
                                :data="radioList" 
                                :row-style="{ background: 'rgb(27,27,27)'}"
                                :header-row-style="{
                                    background: 'rgb(27,27,27)',
                                    borderBottom: 'none',
                                    height: '30px',
                                }"
                                @row-dblclick="toRadio($event)"
                                :header-cell-style="{ background: 'rgb(27,27,27)' }">
                            <el-table-column label width="30px"></el-table-column>

                            <el-table-column label="主播电台">
                                <p slot-scope="scope" class="singer-info">
                                    <img v-lazy=scope.row.picUrl width="60" height="60"/>
                                    <router-link tag="a" :to="{name:'radio',params:{radio_id:scope.row.id}}" href="javascript:;">{{scope.row.name}}</router-link>
                                </p>
                            </el-table-column>
                            <el-table-column width="200px">
                                    <p slot-scope="scope" class="text-ellipses">
                                        by 
                                       <router-link tag="a" :to="{name:'art',params:{art_id:scope.row.dj.id}}">{{scope.row.dj.nickname}}</router-link>
                                    </p>
                            </el-table-column>
                            <!-- <el-table-column label width="30px"></el-table-column> -->
                        </el-table>
                </div>

                <div v-show="type==1006">
                    歌词功能待完善
                </div>

                <div class="page">
                    <Page v-if="
                                (type==1&&songTotal>100) || 
                                (type==100 && singerTotal>100) ||
                                (type==10 && albumTotal>100)||
                                (type==1000 && listTotal>100) || 
                                (type==1002 && userTotal>100) || 
                                (type==1004 && mvTotal>100) || 
                                (type==1014 && videoTotal>100) ||
                                (type==1009 && radioTotal>100)"
                        class-name="pagination"
                        :current.sync="page"
                        :page-size="100"
                        :styles="{ background: 'none !important' }"
                        :total="
                                (type==1&&songTotal) || 
                                (type==100 &&singerTotal) || 
                                (type==10 &&albumTotal) ||
                                (type==1000 &&listTotal) || 
                                (type==1002 &&userTotal)|| 
                                (type==1014 &&videoTotal)|| 
                                (type==1004 &&mvTotal)|| 
                                (type==1009 &&radioTotal)"
                        @on-change="changePage()"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Page } from "view-design";
import axios from "axios"
import {mapState,mapMutations} from "vuex"
export default {
    components:{
        Page
    },
    props:["keyword"],
    data(){
        return {
            loading:false,
            songList:[],
            songTotal:0,
            singerList:[],
            singerTotal:0,
            albumList:[],
            albumTotal:0,
            playList:[],
            listTotal:0,
            userList:[],
            userTotal:0,
            mvList:[],
            mvTotal:0,
            videoList:[],
            videoTotal:0,
            radioList:[],
            radioTotal:0,
            lyricList:[],
            lyricTotal:0,
            type:1,
            page:1,
            typeList:[
                {
                    name:'单曲',
                    id:1
                },
                {
                    name:'歌手',
                    id:100
                },
                {
                    name:'专辑',
                    id:10
                },
                {
                    name:'歌单',
                    id:1000
                },
                {
                    name:'用户',
                    id:1002
                },
                {
                    name:'MV',
                    id:1004
                },
                {
                    name:"歌词",
                    id:1006
                },
                {
                    name:'视频',
                    id:1014
                },
                {
                    name:'主播电台',
                    id:1009
                }
            ]
        }
    },
    methods:{
        ...mapMutations(["changeLikeList"]),
        getResult(){
            this.loading=true;
            axios.post("/search",{
                keywords:this.keyword,
                limit:100,
                offset:(this.page-1)*100,
                type:this.type
            }).then(res=>{
                console.log(res)
                this.$refs.wrapper.scrollTo(0,0);
                this.loading = false;
                switch(this.type){
                    case 1:
                        //单曲
                        this.songList = res.data.result.songs;
                        this.songTotal = res.data.result.songCount
                        break;
                    case 100:
                        //歌手
                        this.singerList = res.data.result.artists;
                        this.singerTotal = res.data.result.artistCount;
                        break;
                    case 10:
                        //专辑
                        this.albumList = res.data.result.albums;
                        this.albumTotal = res.data.result.albumCount;
                        break;
                    case 1000:
                        //歌单
                        this.playList = res.data.result.playlists;
                        this.listTotal = res.data.result.playlistCount;
                        break;
                    case 1002:
                        //用户
                        this.userList = res.data.result.userprofiles;
                        this.userTotal = res.data.result.userprofileCount;
                        break;
                    case 1004:
                        //MV
                        this.mvList = res.data.result.mvs;
                        this.mvTotal = res.data.result.mvCount;
                        break;
                    case 1014:
                        //视频
                        this.videoList = res.data.result.videos;
                        this.videoTotal = res.data.result.videoCount;
                        break;
                    case 1009:
                        //电台
                        this.radioList = res.data.result.djRadios;
                        this.radioTotal = res.data.result.djRadiosCount;
                        break;
                    case 1006:
                        //歌词
                        this.lyricList = res.data.result.songs;
                        this.lyricTotal = res.data.result.songCount;
                        break;
                }
            })
        },
        toPlay(e) {
            console.log("11111",e)

            this.bus.$emit("play", [e.id]);
        },
        changePage(){
            //重新获取数据，并滚动至顶部
            this.getResult(this.type);
        },
        changeType(id){
            this.type=id;
            this.page=1;
            this.getResult()
        },
        toArt(e){
            this.$router.push({
                name:'art',
                params:{
                    art_id:e.id
                }
            })
        },
        toMv(id){
            location.href=`/video.html?mvid=${id}&type=m`
        },
        toAlbum(e){
            this.$router.push({
                name:'album',
                params:{
                    id:e.id
                }
            })
        },
        toRadio(e){
            this.$router.push({
                name:'radio',
                params:{
                    radio_id:e.id
                }
            })
        },
        toVideo(id){
            location.href=`/video.html?id=${id}&type=v`
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
                    var index = this.likeList.findIndex(ele=>ele==this.audioInfo.id);
                    console.log(index)
                    list.splice(index,1)
                    this.changeLikeList(list);
                }
            })
        },
    },
    mounted(){
        this.getResult();
    },
    computed: {
        ...mapState(["audioInfo",'likeList']),
    },
}
</script>
<style lang="less" scoped>
    *{
        color:rgb(132, 132, 132);
    }
    .activeType{
        color:#fff;
        font-weight:500;
    }
   
    .result{
        color: rgb(172, 172, 172);
        height: 100%;
        text-align: left;
        display: flex;
        flex-direction: column;
        overflow:hidden;
        .nav-bar {
            height: 70px;
            flex-shrink:0;
        }
        .about-keyword{
            flex-shrink:0;
            height:60px;
            line-height:60px;
            padding:0 30px;
            box-sizing:border-box;
            line-height:60px;
            color:rgb(102,102,102);
            strong{
                font-size:24px;
                margin-right:10px;
                color:rgb(172,172,172);
            }
        }
        .result-nav{
            flex-shrink:0;
            display:flex;
            border-bottom:1px solid rgb(52,52,52);
            padding:5px 30px;
            height:30px;
            li{
                margin-right:30px;
                cursor:pointer;
            }
        }
        .result-wrapper{
            flex:1;
            overflow-y:scroll;
            .page{
                text-align:center;
            }
            .singer-info{
                img{
                    width:60px;
                    height:60px;
                    border-radius:5px;
                    vertical-align: middle;
                    margin-right:10px;
                }
            }
            .user-info{
                img{
                    width:60px;
                    height:60px;
                    border-radius:50%;
                    vertical-align: middle;
                    margin-right:10px;
                }
            }
            .identify{
                width:20px;
                height:20px;
                border-radius:20px;
                background:red;
                color:#fff;
                padding:5px;
            }
            .mvs{
                display:flex;
                flex-wrap:wrap;
                justify-content: space-between;
                padding:0 30px;
                li{
                        width:220px;
                        cursor:pointer;
                        display:flex;
                        flex-direction:column;
						margin:20px 0;
						.poster{
							flex-shrink: 0;
							width:220px;
							height:120px;
							border-radius:5px;
							background-size:100% 100%;
                            margin-right:10px;
                            position:relative;
                            .play-count{
                                position:absolute;
                                right:5px;
                                top:5px;
                                i{
                                    color:rgb(202,202,202);
                                    font-size:14px;
                                }
                            }
                            .duration{
                                position:absolute;
                                right:5px;
                                bottom:5px;
                                color:rgb(202,202,202);
                            }
						}
						.info{
                            margin-top:10px;
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
                                font-size:12px;
                                
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
</style>