<template>
  <div class="list" v-loading="loading" 
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(33, 33, 33, 1)">
    <div class="nav-bar"></div>
    <div class="list-detail" ref="wrapper">
      <div class="desc" v-if="+id">
        <img v-lazy=desc.picUrl />
        <div class="info">
          <p class="name">
            <span class="tag">专辑</span>
            <strong>{{ desc.name }}</strong>
          </p>

          <ul class="operate">
            <li>
              <span> <i class="icon icon-circle-play"></i>播放全部 </span>
              <span>
                <i class="icon icon-plus"></i>
              </span>
            </li>
            <li>
              <i class="icon icon-collect" v-if="subAlbum.some(ele=>ele.id == desc.id)" @click="addMark(desc.id,0)">取消收藏</i>
              <i class="icon icon-collect" v-else  @click="addMark(desc.id,1)">收藏</i>
            </li>
            <li>
              <i class="icon icon-share"></i>
              分享
            </li>
            <li>
              <i class="icon icon-download">下载全部</i>
            </li>
          </ul>
          
          <div class="author mt30">
            <img
              v-lazy='desc.artist ? desc.artist.picUrl : "/assets/images/default-headimg.png"'
              width="30"
            />
            <a href="javascript:;">
              {{ desc.artist ? desc.artist.name : "" }}
            </a>
            <p class="mt5">
              时间:
              {{ desc.publishTime | toDateStrZH}}
            </p>
          </div>
        </div>
      </div>
      <div class="menu">
        <ul class="tab">
          <li @click="changeTab(0)" :class="{ red: tab == 0 }">歌曲列表</li>
          <li @click="changeTab(1)" :class="{ red: tab == 1 }" v-if="+id">
            评论({{ commentTotal }})
          </li>
          <li @click="changeTab(2)" :class="{ red: tab == 2 }" v-if="+id">专辑详情</li>
          <li class="active" :style="{ left: tab * 130 + 'px' }"></li>
        </ul>
      </div>

      <div class="list-table" v-if="tab == 0">
        <el-table
          :data="playlist"
          stripe
          :row-style="{ background: 'rgb(27,27,27)', height: '40px' }"
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
                <template v-else>{{ scope.$index + 1 }}</template>
                </template>
            </el-table-column>

            <el-table-column label width="30px" align="center">
                <template slot-scope="scoped">
                <a href="javascript:;">
                    <i
                    class="icon icon-like-hollow"
                    @click="addLove(scoped.row.id)"
                    style="cursor:pointer"
                    ></i>
                </a>
                </template>
            </el-table-column>
            <el-table-column label width="30px" align="center">
                <template slot-scope="scoped">
                <a href="javascript:;">
                    <i
                    class="icon icon-download"
                    @click="addLove(scoped.row.id)"
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
                <span >{{ scope.row.name }}</span>

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
                <template slot-scope="scope">{{
                scope.row.dt|| scope.row.duration | duration
                }}</template>
            </el-table-column>
            <el-table-column width="10px"></el-table-column>
        </el-table>
      </div>

      <div class="comment-wrapper" v-if="tab == 1">
        <div class="comment">
          <textarea v-model="commentContent" style="width:100%"></textarea>

          <div class="comment-fun">
            <div class="special">
              <span>
                <i class="icon icon-emoji" @click.stop="showEmoji = true"></i>
                <ul class="emojiList" v-show="showEmoji">
                  <li
                    v-for="item in emoji"
                    :key="item.pic"
                    @click.stop="addEmoji(item.pic)"
                  >
                    {{ item.pic }}
                  </li>
                </ul>
              </span>
              <span>
                <i class="icon icon-aite" @click="addAite"></i>
              </span>
              <span>
                <i class="icon" @click="addJing">#</i>
              </span>
            </div>
            <a href="javascript:;" class="send-btn" @click="sendComment"
              >评论</a
            >
            <span>{{ 140 - commentContent.length }}</span>
          </div>

          <div class="hot-comment">
            <p class="title">精彩评论</p>
            <comment
              type="video"
              v-for="item in hotComment"
              :key="item.commentId"
              :comment="item"
            ></comment>
          </div>

          <div class="comments">
            <p class="title" ref="latest">
              最新评论
              <a href="javascript:;" name="latest"></a>
              <span>({{ commentTotal }})</span>
            </p>
            <comment
              type="video"
              v-for="item in commentList"
              :key="item.commentId"
              :comment="item"
            ></comment>
          </div>
          <div class="page">
            <a href="#latest" ref="hook" @click="scroll($event)"></a>
            <Page
              class-name="pagination"
              :current.sync="page"
              :page-size="20"
              :styles="{ background: 'none !important' }"
              :total="commentTotal"
              @on-change="changeCommentPage($event)"
            />
          </div>
        </div>
      </div>

      <div class="album-detail" v-if="tab == 2">
          <p class="description mt30">
            <i>{{ desc.description }}</i>
          </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState ,mapMutations} from "vuex";
import { emoji } from "@/utils/emoji";
import comment from "@/components/comment.vue";
import { Page } from "view-design";
export default {
    props: ["id"],
    components: {
        comment,
        Page,
    },
    data() {
        return {
          loading:false,
          playlist: [],
          privileges: [],
          desc: {},
          tab: 0,
          hotComment: [],
          commentTotal: 0,
          commentList: [],
          page: 1,
          commentContent: "",
          showEmoji: false,
          subscribeList: [],
          subPage: 1,
          emoji: emoji,
        };
    },
    methods: {
        ...mapMutations(['changeSubAlbum']),
        getInfo() {
          if(+this.id){
            axios.post("/album", {
                id: this.id,
                })
                .then((res) => {
                console.log(res);
                this.playlist = res.data.songs;
                // this.privileges = res.data.privileges;
                this.desc = res.data.album;
                this.loading = false;
            });
          }else{
            axios.post("/recommend/songs").then(res=>{
                this.playlist  = res.data.data.dailySongs;
                this.loading = false;
            })
          }
        },
        changeTab(tab) {
            if (this.tab == tab) {
                return;
            } else {
                this.tab = tab;
            }
        },
        getComment() {
            axios.post("/comment/album", {
                id: this.id,
                limit: 20,
                offset: (this.page - 1) * 20,
                })
                .then((res) => {
                if (this.page == 1) {
                    this.hotComment = res.data.hotComments;
                }
                if (this.page != 1) {
                    this.$nextTick(() => {
                    this.$refs.wrapper.scrollTop = this.$refs.latest.offsetTop - 100;
                    });
                }
                // this.hotComment = res.data.hotComments;
                this.commentTotal = res.data.total;
                this.commentList = res.data.comments;
            });
        },
        addLove(id) {
            console.log(id);
        },
        toPlay(e) {
            console.log("11111",e)

            this.bus.$emit("play", [e.id]);
        },
        toMv(id) {
            location.href = `/video.html?mvid=${id}&type=m`;
        },
        addEmoji(text) {
            this.commentContent += text;
        },
        addAite() {
            this.commentContent += "@";
        },
        addJing() {
            this.commentContent += "#";
        },
        sendComment() {
            if (!this.commentContent.trim()) {
                this.$toast({
                message: "请输入评论内容",
                });
            } else {
                axios
                .post("/comment", {
                    id: this.desc.id,
                    t: 1,
                    type: 3,
                    content: this.commentContent,
                })
                .then((res) => {
                    if (res.data.code == 200) {
                    this.$toast({
                        message: "发送成功",
                    });

                    this.showCommentBox = false;
                    setTimeout(() => {
                        this.getComment();
                    }, 500);
                    } else {
                    this.$toast({
                        message: res.data.msg,
                    });
                    }
                });
            }
        },
        changeCommentPage(page) {
            console.log(111);
            this.page = page;
            this.getComment();
        },
        getSubscribeList(){
            axios.post("/playlist/subscribers",{
                id:this.id,
                limit:20,
                offset:(this.subPage-1)*20
            }).then(res=>{
                this.subscribeList = res.data.subscribers;
            })
        },
        addMark(id,isAdd){

          axios.post("/album/sub",{
            id,
            t:isAdd
          }).then(res=>{
            console.log(res)
            if(res.data.code == 200){
              this.$toast({
                message:isAdd ? '收藏成功' : '已取消收藏',
              })
              return axios.post("/album/sublist",{
                limit:300
              }).then(res=>{
                  this.changeSubAlbum(res.data.data);
              })
            }
          },err=>{
            this.$toast({
              message:err.msg
            })
          })
        }
    },
    mounted() {
      this.loading = true;
        console.log("挂载成功!")
        this.getInfo();
        this.getComment();
        this.getSubscribeList();
    },
    computed: {
        ...mapState(["audioInfo","subAlbum"]),
    },
    
};
</script>

<style lang="less" scoped>
.list {
  color: rgb(172, 172, 172);
  height: 100%;
  text-align: left;
  display: flex;
  flex-direction: column;
  .nav-bar {
    height: 70px;
  }
  .list-detail {
    flex: 1;
    // border:1px solid red;
    overflow-y: scroll;
    .desc {
      padding: 0 30px;
      height: 250px;
      display: flex;
      align-items: center;
      overflow:hidden;
      & > img {
        width: 200px;
        height: 200px;
        border-radius: 10px;
        margin-right: 30px;
      }
      .info {
        flex: 1;
        // border:1px solid green;
        height: 100%;
        .name {
          line-height: 34px;

          .tag {
            color: rgb(200, 27, 27) !important;
            border: 1px solid rgb(200, 27, 27);
            font-size: 13px;
            padding: 2px 5px;
            vertical-align: top;
            margin-right: 10px;
            border-radius: 5px;
          }
          strong {
            font-size: 20px;
          }
        }
        .author {
          font-size:13px;
          img {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            vertical-align: middle;
            margin-right: 10px;
          }
          a {
            color: skyblue;
            margin-right: 20px;
          }
          span {
            font-weight: 300;
          }
        }
        .operate {
          margin-top: 20px;
          display: flex;
          justify-content: space-around;
          li {
            height: 30px;
            border-radius: 30px;
            display: flex;
            align-items: center;
            text-align: center;
            font-size: 13px;
            width: 22%;
            border: 1px solid rgb(127, 127, 127);
            cursor: pointer;
            justify-content: center;
            &:first-of-type {
              display: flex;
              background: rgb(200, 27, 27);
              border-color: rgb(200, 27, 27);
              color: #fff;
              span:first-of-type {
                flex: 1;
                color: #fff;
              }
              span:nth-of-type(2) {
                width: 30px;
                color: #fff;
                border-left: 1px solid rgb(255, 27, 27);
              }

              i {
                color: #fff;
              }
            }
          }
        }
        .count {
          line-height: 30px;
          margin-top: 10px;
          font-size: 12px;
          i {
            color: rgb(127, 127, 127);
          }
          span {
            margin-right: 30px;
          }
        }
        
      }
    }
    .menu {
      height: 40px;
      display: flex;
      ul {
        margin-left: 30px;
        display: flex;
        align-items: center;
        position: relative;
        li {
          width: 130px;
          text-align: center;
          cursor: pointer;
          &.active {
            height: 2px;
            position: absolute;
            left: 0;
            bottom: 0;
            background: rgb(255, 27, 27);
            transition: 0.5s ease-in-out;
          }
        }
      }
    }
    .list-table {
      padding: 30px 0;
    }
    .comment-wrapper {
      padding: 30px;
      .comment {
        text-align: left;
        margin-top: 30px;
        .title {
          margin-top: 30px;
          height: 40px;
          line-height: 40px;
          font-size: 18px;
          color: rgb(162, 172, 202);
          font-weight: bolder;
          position: relative;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          z-index:9;
          strong {
            font-size: 18px;
            margin-right: 20px;
          }
          span {
            font-size: 13px;
            color: rgb(172, 172, 172);
          }
        }
        textarea {
          width: 100%;
          border-radius: 5px;
          height: 100px;
          background: rgb(54, 54, 56);
          border-color: rgb(35, 33, 33);
          resize: none;
          outline: none;
          font-size: 14px;
          padding: 5px;
          color: rgb(202, 202, 202);
        }

        .comment-fun {
          display: flex;
          justify-content: space-between;
          position: relative;
          margin-top: 20px;
          .special {
            font-size: 18px;
            span {
              margin: 0 5px;
              cursor: pointer;
              font-size: 24px;
              i::before {
                font-size: 24px;
              }
              .emojiList {
                width: 280px;
                background: rgb(55, 55, 55);
                padding: 10px;
                display: flex;
                flex-wrap: wrap;
                position: absolute;
                border-radius: 5px;
                z-index:99;
                li {
                  margin: 0 2px;
                }
              }
            }
          }
          & > span {
            position: absolute;
            right: 10px;
            top: -45px;
            color: rgb(132, 132, 132);
          }
          .send-btn {
            height: 30px;
            line-height: 30px;
            padding: 0 15px;
            border-radius: 30px;
            border: 1px solid rgb(72, 72, 72);
            &:hover {
              background: rgb(40, 40, 40);
            }
          }
        }
      }
      .page{
        text-align:center;
      }
    }
    .album-detail {
      box-sizing: border-box;
      padding: 30px;
      .description {
          line-height: 24px;
          font-size: 12px;
          i {
            color: rgb(127, 127, 127);
          }
        }
    }
  }
}
</style>
