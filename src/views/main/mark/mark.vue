<template>
    <div class="markinfo">
        <div class="nav-bar">
            <ul>
                <li v-for="item in tabbar" @click="currentNav = item.id" :class="{currentTab:item.id==currentNav}" :key="item.id">{{item.name}}</li>
            </ul>
        </div>
        <div class="mark-wrapper">
            <div class="mark-content">
                <div class="albums" v-if="currentNav == 0">
                    <div class="my-album">
                        <i class="icon icon-album1"></i>
                        <a href="javascript:;">我的数字专辑<i class="icon icon-forward"></i></a>
                    </div>
                    <div class="my-mark-album">
                        <div class="head">
                            <span>收藏的专辑</span>
                            <input v-model="searchWord" autocomplete="off" placeholder="搜索收藏专辑"/>
                        </div>
                        <el-table :show-header="false" :data="subAlbum" :rowStyle="{background:'rgb(32,32,32)'}" @row-dblclick="toAlbum($event)">
                            <el-table-column width="30px"></el-table-column>
                            <el-table-column width="80px">
                                <template slot-scope="scope">
                                    <img :src="scope.row.picUrl" style="border-radius:5px" width="50"/>
                                </template>
                            </el-table-column>

                            <el-table-column prop="name"></el-table-column>

                            <el-table-column>
                                <template slot-scope="scope">
                                    <template v-for="(art,index) in scope.row.artists">
                                        <router-link :to="{name:'art',params:{art_id:art.id}}" tag="a" href="javascript:;" :key="art.id">{{index==0 ? art.name : ' / '+art.name}}</router-link>
                                    </template>
                                </template>
                            </el-table-column>

                            <el-table-column width="80px">
                                <template slot-scope="scope">
                                    {{scope.row.size}}首
                                </template>
                            </el-table-column>
                            <el-table-column width="30px"></el-table-column>
                        </el-table>
                    </div>
                </div>

                <div class="arts" v-if="currentNav == 1">
                    <div class="my-mark-art">
                        <div class="head">
                            <span>收藏的歌手</span>
                            <input v-model="searchWord" autocomplete="off" placeholder="搜索收藏的歌手"/>
                        </div>
                        <el-table :show-header="false" :data="subArt" :rowStyle="{background:'rgb(32,32,32)'}" @row-dblclick="toArt($event)">
                            <el-table-column width="30px"></el-table-column>
                            <el-table-column width="80px">
                                <template slot-scope="scope">
                                    <img :src="scope.row.img1v1Url" style="border-radius:5px" width="50"/>
                                </template>
                            </el-table-column>

                            <el-table-column prop="name"></el-table-column>

                            <el-table-column align="center">
                                <template slot-scope="scope">
                                    专辑:{{scope.row.albumSize}}首
                                </template>
                            </el-table-column>

                            <el-table-column align="right">
                                <template slot-scope="scope">
                                    MV:{{scope.row.mvSize}}
                                </template>
                            </el-table-column>
                        
                            <el-table-column width="30px"></el-table-column>
                        </el-table>
                    </div>
                </div>


                <div class="videos" v-if="currentNav == 2">
                    <div class="my-mark-video">
                        <div class="head">
                            <span>收藏的视频({{subVideo.length}})</span>
                            <input v-model="searchWord" autocomplete="off" placeholder="搜索收藏的视频"/>
                        </div>
                        <ul>
                            <li v-for="video in subVideo" :key="video.id" @click="toVideo(video.vid || video.id)">
                                <div class="poster" :style="{backgroundImage:`url(${video.coverUrl})`}"></div>
                                <p class="text-ellipses">{{video.title}}</p>
                                <span>{{video.creator[0].userName}}</span>
                            </li>
                            <li v-for="item in (3 - subVideo.length%3)" :key="item"></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {mapState} from "vuex";
    export default{
        data(){
            return {
                tabbar:[
                    {
                        name:'专辑',
                        id:0
                    },
                    {
                        name:'歌手',
                        id:1
                    },
                    {
                        name:"视频",
                        id:2
                    },
                    // {
                    //     name:"专栏",
                    //     id:3
                    // }
                ],
                currentNav:0,
                searchWord:"",

            }
        },
        computed:{
            ...mapState(['subAlbum','subArt','subVideo'])
        },
        methods:{
            toAlbum(e){
                this.$router.push({
                    name:'album',
                    params:{
                        id:e.id
                    }
                })
            },
            toArt(e){
                this.$router.push({
                    name:"art",
                    params:{
                        art_id:e.id
                    }
                })
            },
            toVideo(id){
                if(isNaN(+id)){
                    location.href=`/video.html?id=${id}&type=v`
                }else{
                    location.href=`/video.html?mvid=${id}&type=m`
                }
            }
            
        }
    }
</script>
<style lang="less">
    .markinfo{
        color: rgb(172, 172, 172);
        height: 100%;
        text-align: left;
        display: flex;
        flex-direction: column;
        .nav-bar {
            height: 70px;
            display:flex;
            align-items:center;
            ul{
                display:flex;
                align-items:center;
                margin-left:30px;
                li{
                    margin:0 10px;
                    cursor:pointer;
                    &.currentTab{
                        color:#fff;
                        font-weight:bolder;
                    }
                }
                
            }
            
        }
        .mark-wrapper{
            flex:1;
            overflow-y:scroll;
            .mark-content{
                // height:900px;

                .albums{
                    height:80px;
                    background:rgb(42,42,42);
                    // padding:0 30px;
                    .my-album{
                        height:100%;
                        display:flex;
                        align-items:center;
                        cursor:pointer;
                        &>i{
                            margin-left:30px;
                            font-size:40px;
                            width:60px;
                            height:60px;
                            border-radius:5px;
                            border:1px solid brown;
                            padding:10px;
                            text-align:center;
                            background:rgb(110,30,30);
                            display:flex;
                            justify-content: center;
                            align-items: center;
                            margin-right:20px;
                        }
                        a{
                            flex:1;
                            .icon-forward::before{
                                font-size:14px;
                                margin-left:5px;
                            }
                        }
                    }
                    .my-mark-album{
                        padding-top:50px;
                        .head{
                            display:flex;
                            line-height:28px;
                            padding:0 30px;
                            margin-bottom:30px;
                            justify-content: space-between;
                            input{
                                background:rgb(38,38,38);
                                border-radius:5px;
                                outline:none;
                                border:none;
                                height:28px;
                                text-indent:10px;
                                color:rgb(102,102,102)
                            }
                        }
                    }   
                }
                .arts{
                    // height:80px;
                    background:transparent;
                    margin-bottom:30px;
                    .my-mark-art{
                        // padding-top:50px;
                        .head{
                            display:flex;
                            line-height:28px;
                            // margin-top:30px;
                            padding:0 30px;
                            margin-bottom:30px;
                            justify-content: space-between;
                            input{
                                background:rgb(38,38,38);
                                border-radius:5px;
                                outline:none;
                                border:none;
                                height:28px;
                                text-indent:10px;
                                color:rgb(102,102,102)
                            }
                        }
                    }
                }
                .videos{
                    // height:80px;
                    background:transparent;
                    margin-bottom:30px;
                    .my-mark-video{
                        // padding-top:50px;
                        .head{
                            display:flex;
                            line-height:28px;
                            // margin-top:30px;
                            padding:0 30px;
                            margin-bottom:30px;
                            justify-content: space-between;
                            input{
                                background:rgb(38,38,38);
                                border-radius:5px;
                                outline:none;
                                border:none;
                                height:28px;
                                text-indent:10px;
                                color:rgb(102,102,102)
                            }
                        }
                        ul{
                            padding:0 30px;
                            display:flex;
                            justify-content: space-between;
                            flex-wrap:wrap;
                            
                            li{
                                width:230px;
                                cursor:pointer;
                                &:hover{
                                    color:#fff;
                                }
                                .poster{
                                    width:100%;
                                    height:120px;
                                    background-size:100% 100%;
                                    border-radius:5px;
                                    position:relative;
                                }
                                p{
                                    line-height:24px;
                                    margin-top:10px;
                                }
                                span{
                                    line-height:24px;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

</style>