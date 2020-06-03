<template>
    <div class="list">
        <div class="nav-bar"></div>
        <div class="list-detail" ref="wrapper">
            <div class="desc">
                <img v-lazy="desc.picUrl" />
                <div class="info">
                    <p class="name">
                        <span class="tag">{{ desc.category }}</span>
                        <strong>{{ desc.name }}</strong>
                    </p>
                    <p class="red price" v-if="desc.price">￥{{desc.price/100}}</p>
                    <div class="author">
                        <img
                        v-lazy="
                            desc.dj
                            ? desc.dj.avatarUrl
                            : '/assets/images/default-headimg.png'
                        "
                        width="30"
                        />
                        <a href="javascript:;">{{ desc.dj ? desc.dj.nickname : "" }}</a>
                    </div>

                    <ul class="operate">
                        <li v-if="!desc.price">
                            <span>
                                <i class="icon icon-circle-play"></i>播放全部
                            </span>
                            <span>
                                <i class="icon icon-plus"></i>
                            </span>
                        </li>
                        <li v-if="desc.price>0">
                            <i class="icon icon-car"></i>
                            立即购买
                        </li>
                        <li v-if="desc.price>0" style="color:#c82525;border-color:#c82525">
                            <i class="icon icon-circle-play"></i>
                            免费试听
                        </li>
                        <li v-if="!desc.price">
                            <i class="icon icon-star"></i>
                            订阅({{ desc.subCount | fixedNum }})
                        </li>
                        <li>
                            <i class="icon icon-share"></i>
                            分享({{ desc.shareCount }})
                        </li>
                    </ul>

                    <p class="description mt30">
                        <i>{{ desc.desc }}</i>
                    </p>
                </div>
            </div>
            <div class="menu">
                <ul class="tab">
                    <li @click="changeTab(0)" :class="{ red: tab == 0 }">节目({{ programList.length }})</li>
                    <!-- <li @click="changeTab(2)" :class="{ red: tab == 1 }">订阅者</li> -->
                    <li class="active" :style="{ left: tab * 130 + 'px' }"></li>
                </ul>
        </div>

        <div 
            class="list-table" 
            v-if="tab == 0" 
            v-loading="loading" 
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(42, 42, 42, 1)">
            <el-table
                :data="programList"
                style="min-height:200px"
                stripe
                :show-header="false"
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
                    <i class="icon icon-volume red" v-if="scope.row.id == audioInfo.id"></i>
                    <template v-else>{{ scope.$index + 1 }}</template>
                    </template>
                </el-table-column>
                <el-table-column label="音乐标题" min-width="120px">
                    <p
                    slot-scope="scope"
                    class="text-ellipses flex "
                    :style="{ 'align-items': 'center' }"
                    :class="{ red: scope.row.id == audioInfo.id }"
                    >
                    <img :src="scope.row.coverUrl" width="40" class="mr10" />
                    <span class="flex1">{{ scope.row.name }}</span>
                    </p>
                </el-table-column>
                <el-table-column>
                    <template slot-scope="scope">
                        <i class="icon icon-circle-play"></i>
                        {{scope.row.listenerCount}}
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot-scope="scope">
                        <i class="icon icon-zan"></i>
                        {{scope.row.likedCount}}
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot-scope="scope">
                        {{scope.row.createTime | toDateStrZH}}
                    </template>
                </el-table-column>
                <el-table-column label="时长" min-width="50px">
                    <template slot-scope="scoped">
                    {{
                    scoped.row.duration | duration
                    }}
                    </template>
                </el-table-column>
                <el-table-column width="10px"></el-table-column>
            </el-table>
        </div>

        </div>
    </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";

// import { Page } from "view-design";
export default {
  props: ["radio_id"],
  components: {
    // comment,
    // Page,
  },
  data() {
    return {
        loading:false,
        programList: [],
        desc: {},
        trackIds: [],
        tab: 0,
        page: 1,
    };
  },
  methods: {
    getInfo() {
      axios
        .post("/dj/detail", {
          rid: this.radio_id
        })
        .then(res => {
          console.log(res);
          this.desc = res.data.djRadio;
        });
    },
    getProgram(offset=0) {
        if(!offset){
            this.loading = true;
        }
        axios.post("/dj/program", {
            rid: this.radio_id,
            limit:100,
            offset:offset*100
        })
        .then(res => {
            this.programList = this.programList.concat(res.data.programs);
            if(res.data.more){
                this.getProgram(offset+1)
            }
            this.loading = false;
        });
    },
    changeTab(tab) {
      if (this.tab == tab) {
        return;
      } else {
        this.tab = tab;
      }
    },

    addLove(id) {
      console.log(id);
    },
    toPlay(e) {
        const self = this;
        this.bus.$emit("play", [e.mainSong.id]);

        setTimeout(()=>{
            self.audioInfo.name  = e.name
        },1000)
    },
    toMv(id) {
      location.href = `/video.html?mvid=${id}&type=m`;
    }
  },
  mounted() {
    this.getInfo();
    this.getProgram();
  },
  computed: {
    ...mapState(["audioInfo"])
  }
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
        .price{
            line-height:40px;
            font-size:18px;
            font-weight:bolder;
        }
        .author {
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
        //   justify-content: space-around;
          li {
            height: 30px;
            border-radius: 30px;
            display: flex;
            align-items: center;
            text-align: center;
            font-size: 13px;
            margin-right:25px;
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
        .description {
          line-height: 30px;
          font-size: 12px;
          i {
            color: rgb(127, 127, 127);
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

  }
}
</style>
