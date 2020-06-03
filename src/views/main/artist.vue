<template>
    <div class="artist">
        <div class="head"></div>
        <div class="info-wrapper">
            <div class="artist-info">
                <img :src="artist.picUrl"/>
                <div class="info">
					<p class="name">
						<strong>{{artist.name}}</strong>
					</p>
					
                    <p class="sub-name">
                        <span v-for="name in artist.alias" :key="name">{{name}}</span>
                    </p>
					<ul class="operate">
						<li>
                            <i class="icon icon-collect" v-if="subArt.some(ele=>ele.id==art_id)" @click="addSubArt(art_id,0)">取消收藏</i>

                            <i class="icon icon-collect" v-else  @click="addSubArt(art_id,1)">收藏</i>
                        </li>
					</ul>

					<p class="count">
						<span>单曲数:<i>{{artist.musicSize}}</i></span>
						<span>专辑数:<i>{{artist.albumSize}}</i></span>
						<span>MV数:<i>{{mvs.length}}</i></span>
					</p>
				</div>           
            </div>

            <div class="menu">
				<ul class="tab">
					<li @click="changeTab(0)" :class="{red:tab==0}">专辑</li>
					<li @click="changeTab(1)" :class="{red:tab==1}">MV</li>
					<li @click="changeTab(2)" :class="{red:tab==2}">歌手详情</li>
					<li @click="changeTab(3)" :class="{red:tab==3}">相似歌手</li>

					<li class="active" :style="{left:tab*90+'px'}"></li>
				</ul>
			</div>

            <div class="album-wrap" v-if="tab==0">
                <div class="album" v-for="item in hotAlbum" :key="item.id">
                    <div class="poster">
                        <img :src="item.blurPicUrl" />
                        <p>{{new Date(item.publishTime).toLocaleDateString().replace(/\//g,'-')}}</p>
                    </div>

                    <div class="table-wrapper">
                        <p class="name">
                            <strong>{{item.name}}</strong>
                            <i class="icon icon-play-hollow"></i>
                            <i class="icon icon-collect"></i>
                        </p>
                        <el-table 
                            :show-header="false" 
                            :data="item.songs"
                            stripe 
                            :row-style="{background:'rgb(32,32,32)',height:'40px'}"
                            :header-row-style="{background:'rgb(27,27,27)',borderBottom:'none',height:'30px'}"
                            :header-cell-style="{background:'rgb(27,27,27)'}"
                            @row-dblclick="toPlay($event)"
                            >
                            <el-table-column label=""  align="center" width="50px">
                                <template slot-scope="scope">
                                    <i class="icon icon-volume red" v-if="scope.row.id == audioInfo.id"></i>
                                    <template v-else>{{scope.$index+1 >9 ? scope.$index+1:'0'+(scope.$index+1)}}</template>
                                </template>
                            </el-table-column>

                            <el-table-column label="" width="30px" align="center">
                                <template slot-scope="scoped">
                                    <a href="javascript:;">
                                        <i class="icon icon-like-hollow" @click="addLove(scoped.row.id)" style="cursor:pointer"></i>
                                    </a>
                                </template>
                            </el-table-column>
                            <el-table-column>
                                <template slot-scope="scope">
                                    <a href="javascript:;">{{scope.row.name}}</a>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>

            <div class="mv-wrap" v-if="tab==1">
                <ul>
                    <li v-for="item in mvs" :key="item.id" >
                        <div class="poster" :style="{backgroundImage:'url('+item.imgurl16v9+')'}">
                            <span>
                                <i class="icon icon-play-hollow"></i>
                                {{item.playCount | fixedNum}}
                            </span>
                            <strong>{{item.duration | duration}}</strong>
                        </div>
                        <p class="text-ellipses name">{{item.name}}</p>
                    </li>
                </ul>
            </div>

            <div class="desc-wrap" v-if="tab==2">
                <strong>{{artist.name}}简介</strong>
                <p>{{desc.briefDesc}}</p>

                <template v-for="item in desc.introduction">
                    <strong class="mt30" :key="item.ti">{{item.ti}}</strong>
                    <p v-html="item.txt.replace(/\n/g,'<br/><br/>')" :key="item.ti"></p>
                </template>
            </div>

            <div class="relative-wrap" v-if="tab==3">
                <ul>
                    <li v-for="item in relativeList" :key="item.id">
                        <img :src="item.img1v1Url" />
                        <router-link tag="a" :to="{name:'art',params:{art_id:item.id}}" href="javascript:;" :key="item.art_id">{{item.name}}</router-link>
                    </li>
                </ul>
            </div>
        </div>
        
    </div>
</template>

<script lang="ts">
    import axios from "axios"
    import { mapState,mapMutations } from 'vuex';
    export default {
        props:['art_id'],
        data(){
            return {
                desc:{},
                hotAlbum:[],
                artist:{},
                mvs:[],
                mvOffset:0,
                tab:0,
                albums:[],
                relativeList:[]
            }
        },
        methods:{
            ...mapMutations(['changeSubArt']),
            getSingerDesc(){
                axios.post("/artist/desc",{
                    id:this.art_id
                }).then(res=>{
                    this.desc = res.data
                })
            },
            getAlbum(){
                axios.post("/artist/album",{
                    id:this.art_id
                }).then(res=>{
                    this.artist = res.data.artist;
                    this.hotAlbum = res.data.hotAlbums;
                    for(let i =0;i<this.hotAlbum.length;i++){
                        axios.post("/album",{
                            id:this.hotAlbum[i].id
                        }).then(res=>{
                            this.hotAlbum[i].songs=res.data.songs
                        })
                    }
                })
            },
            changeTab(tab:0|1|2|3){
				if(this.tab == tab){
					return
				}else{
					this.tab  = tab;
				}
			},
            getMvs(){
                axios.post("/artist/mv",{
                    id:this.art_id,
                    limit:30,
                    offset:this.mvOffset
                }).then(res=>{
                    this.mvs = this.mvs.concat(res.data.mvs);
                    if(res.data.hasMore){
                        this.mvOffset+=30;
                        this.getMvs()
                    }
                })
            },
        
            getAlbumList(){
                axios.post("/artist/album",{
                    id:this.art_id
                }).then(res=>{
                    this.albums = res.data.hotAlbums;
                })
            },
           
            toPlay(e){
				this.bus.$emit("play",[e.id]);
			},
            getRelativeSinger(){
                axios.post("/simi/artist",{
                    id:this.art_id
                }).then(res=>{
                    this.relativeList = res.data.artists
                })
            },
            addSubArt(id,isAdd){
                axios.post("/artist/sub",{
                    id,
                    t:isAdd
                }).then(res=>{
                    if(res.data.code == 200){
                        this.$toast({
                            message:isAdd ? '收藏成功' : '已取消收藏',
                        })
                        return axios.post("/artist/sublist",{
                            limit:300
                        }).then(res=>{
                            this.changeSubArt(res.data.data);
                        })
                    }
                },err=>{
                    this.$toast({
                    message:err.msg
                    })
                })
            }
        },
        mounted(){
            this.getSingerDesc();
            this.getAlbum();
            this.getMvs();
            this.getAlbumList();
            this.getRelativeSinger();
        },
        computed:{
            ...mapState(['audioInfo','subArt'])
        }
    }
</script>

<style scoped lang="less">
    

    .artist{
        display:flex;
        flex-direction: column;
        height:100%;
        color:rgb(172,172,172);
        .head{
            height:70px;
        }
        .info-wrapper{
            flex:1;
            overflow-y:scroll;
            .artist-info{
                padding:30px;
                height:900px;
                // background:rgb(42,42,42);
                display:flex;
                margin-right:20px;
                height:250px;
                text-align:left;
                &>img{
                    width:200px;
                    
                    border-radius:10px;
					margin-right:30px;
                }
                .info{
					flex:1;
					// border:1px solid green;
					height:100%;
					.name{
						line-height:50px;
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
                            i{
                                font-size:16px;
                                margin-right:5px;
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
				
				}
            }
            .menu{
				height:40px;
				display:flex;
				ul{
					margin:0 30px;
                    display:flex;
                    width:100%;
					align-items:center;
                    position:relative;
                    border-bottom:1px solid rgb(72,72,72);
					li{
						width:90px;
						text-align:center;
						cursor:pointer;
						&.active{
							height:2px;
							position:absolute;
							left:0;
							bottom:-1px;
							background:rgb(255,27,27);
							transition:0.5s ease-in-out
						}
					}

				}
            }
            
            .album-wrap{
                padding:30px;
                .album{
                    display:flex;
                    margin-bottom:50px;
                    .poster{
                        width:200px;
                        img{
                            width:160px;
                            height:160px;
                            border-radius:10px;
                        }
                    }
                    .table-wrapper{
                        flex:1;
                        text-align:left;
                        .name{
                            height:40px;
                            line-height:40px;
                            font-size:16px;
                            width:100%; 
                            strong{
                                margin-right:30px;
                            }
                            i{
                                border:1px solid rgb(127,127,127);
                                padding:2px 3px;
                                border-radius:3px;
                                margin-right:20px;
                                cursor:pointer;

                                &:hover{
                                    color:rgb(212,212,212)
                                }
                                &::before{
                                    font-size:12px;
                                }
                            }
                        }
                    }
                }
                
            }
            .mv-wrap{
                padding:30px;
                ul{
                    display:flex;
                    flex-wrap:wrap;
                    justify-content: space-between;
                    li{
                        width:220px;
                        margin-bottom:30px;
                        .poster{
                            width:100%;
                            height:140px;
                            background-size:100% 100%;
                            border-radius:5px;
                            position:relative;
                            span{
                                position:absolute;
                                right:10px;
                                top:10px;
                                color:#fff;
                                font-size:13px;
                            }
                            strong{
                                font-weight:normal;
                                position:absolute;
                                bottom:5px;
                                right:10px;
                                color:#fff;
                            }
                        }
                        .name{
                            text-align:left;
                            line-height:40px;
                        }
                    }
                }
            }
            .desc-wrap{
                padding:0 30px;
                text-align:left;
                margin-bottom:50px;
                strong{
                    font-size:16px;
                    line-height:40px;
                    margin-bottom:10px;
                    display:inline-block;
                }
                p{
                    font-size:12px;
                    line-height:20px;
                    color:rgb(132,132,132)
                }
            }
            .relative-wrap{
                padding:30px;
                ul{
                    display:flex;
                    flex-wrap:wrap;
                    justify-content: space-between;
                    li{
                        width:160px;
                        margin-bottom:20px;
                        cursor:pointer;
                        img{
                            width:160px;
                            height:160px;
                            border-radius:5px;
                        }
                    }
                }
            }
        }
    }
</style>
