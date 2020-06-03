<template>
  <div id="app">
    <div class="base-content-wrapper">
      <div class="base-content">
        <ul class="system-operate">
          <li class="icon"></li>
          <li class="icon"></li>
          <li class="icon"></li>
        </ul>
        <div class="base-content-left">
          <div class="head">
            <span class="icon icon-back" @click="historyBack"></span>
            <span class="icon icon-forward" @click="historyForward"></span>
          </div>
          <div class="user">
            <img
              v-lazy="
                userDetail.profile
                  ? userDetail.profile.avatarUrl
                  : require('@/assets/images/default-headimg.png')
              "
            />
            <div class="nickname" @click="showUserInfo">
              <span class="username">{{
                uid
                  ? userDetail.profile && userDetail.profile.nickname
                  : "未登录"
              }}</span>
              <span class="icon icon-right"></span>
            </div>
            <div
              class="userinfo-box"
              v-if="showUserInfoBox"
              @click="preventBubble"
            >
              <div class="follows">
                <ul>
                  <li>
                    <span>{{ userDetail.profile.eventCount }}</span>
                    <p>动态</p>
                  </li>
                  <li>
                    <span>{{ userDetail.profile.follows }}</span>
                    <p>关注</p>
                  </li>
                  <li>
                    <span>{{ userDetail.profile.followeds }}</span>
                    <p>粉丝</p>
                  </li>
                </ul>
                <span
                  class="sign not-sign"
                  v-if="!userDetail.pcSign"
                  @click="sign"
                >
                  <i class="icon icon-gold"></i>签到
                </span>
                <span class="sign" v-else>已签到</span>
              </div>
              <ul class="account-info">
                <li class="icon">
                  <p>
                    <span class="icon icon-vip"></span>
                    <span>会员等级</span>
                  </p>
                  <p>
                    {{
                      userDetail.profile.vipType == 0
                        ? "未订购"
                        : "vip" + userDetail.profile.vipType
                    }}
                  </p>
                </li>
                <li class="icon">
                  <p>
                    <span class="icon icon-level"></span>
                    <span>等级</span>
                  </p>
                  <p>
                    <span class="icon icon-level2"></span>
                    <i style="font-weight:bolder;font-size:16px;">{{
                      userDetail.level
                    }}</i>
                  </p>
                </li>
                <li class="icon">
                  <p>
                    <span class="icon icon-shop"></span>
                    <span>商城</span>
                  </p>
                </li>
              </ul>
              <ul class="setting-info">
                <li class="icon">
                  <p>
                    <span class="icon icon-setting"></span>
                    <span>个人信息设置</span>
                  </p>
                </li>
                <li class="icon">
                  <p>
                    <span class="icon icon-cellphone"></span>
                    <span>绑定社交账号</span>
                  </p>
                  <p>
                    <span
                      class="icon icon-weibo2"
                      style="margin-right:8px;;"
                    ></span>
                    <span class="icon icon-yixin"></span>
                  </p>
                </li>
              </ul>
              <ul class="layout">
                <li @click="exit">
                  <p>
                    <span class="icon icon-exit"></span>
                    <span>退出登录</span>
                  </p>
                </li>
              </ul>
            </div>
          </div>
          <div class="base-content-left-nav">
            <dl v-for="group in nav" :key="group.group" v-show="!group.needLogin || userId">
              <dt v-if="group.group">{{ group.group }}</dt>
              <router-link 
                tag="dd"
                v-for="menu in group.child"
                :key="menu.name"
                :to="menu.href"
                class="text-ellipses"
                v-show="!menu.needLogin || userId"
              >
                <span class="icon" :class="menu.icon"></span>
                {{ menu.name.includes('用户') ? menu.name.replace('用户',userDetail.profile&&userDetail.profile.nickname) : menu.name }}
              </router-link>
            </dl>
          </div>
        </div>
        <div class="base-content-right">
            <router-view :key="$route.fullPath"/>
        </div>
        <div class="login-box" v-show="showLogin">
          <div class="login-box-mask" @click="changeShowLogin(false)"></div>

          <div class="login-content">
            <span
              class="icon icon-close"
              @click="changeShowLogin(false)"
            ></span>
            <div class="login-form">
              <div class="bg">
                <span class="phone icon icon-phone"></span>
              </div>

              <div class="login-info">
                <div class="tel">
                  <div class="prefix">
                    <span class="phone icon icon-phone"></span>
                    <span class="prefix-num">{{ nowPrefix }}</span>
                    <span class="triangle"></span>
                  </div>
                  <input
                    type="number"
                    v-model="loginForm.phone"
                    @focus="hideError"
                    placeholder="请输入手机号"
                  />
                </div>
                <div class="password">
                  <span class="icon icon-lock"></span>
                  <input
                    type="password"
                    autocomplete="off"
                    @focus="hideError"
                    v-model="loginForm.pwd"
                    placeholder="请输入密码"
                  />
                  <span class="reset-pwd">重设密码</span>
                </div>
                <p class="errormsg">{{ loginMsg }}</p>
              </div>

              <p
                class="sub-login"
                @click="login"
                :style="{
                  background: loginlock ? 'rgb(170,170,170)' : 'rgb(199,27,27)',
                }"
              >
                登录
              </p>
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
                <a href="javascript:;">服务条款</a>、
                <a href="javascript:;">隐私条款</a>、
                <a href="javascript:;">儿童隐私政策</a>
              </div>
            </div>
          </div>
        </div>
        <div class="search-bar">
          <!-- <input placeholder="🔍搜索" v-model="searchContent"/> -->
          <!-- <el-input
            placeholder="请输入内容"
            @focus="showResult"
            @input="getSearchResult"
            @click.stop="preventBubble"
            v-model="searchContent"
          >
            <i slot="prefix" @click.stop="preventBubble" class="el-icon-search"></i>
          </el-input> -->
          <input placeholder="请输入内容"
            ref="searchContent"
            @focus="showResult();getSearchResult()"
            @input="getSearchResult"
            @keyup.enter="toSearch"
            @click.stop="preventBubble"
            v-model="searchContent" />
          <span class="icon icon-setting"></span>
          <span class="icon icon-message"></span>
          <span class="icon icon-skin"></span>
          <span class="icon icon-mini"></span>
          <div class="search-suggest" v-if="showSearchResult" @click.stop="preventBubble">
            <div class="result-wrapper">
              <div v-if="!searchContent">
                <p class="suggest-title">热门搜索</p>
                <ul class="suggest">
                  <li v-for="item in hotSearch" :key="item.id" @click="changeSearchContent(item.searchWord)">
                    {{ item.searchWord }}
                  </li>
                </ul>
              </div>

              <div v-if="!searchContent">
                <p class="suggest-title">搜索历史</p>
              </div>

              <div v-if="searchResult.song && searchContent">
                <p class="suggest-title">
                  <i class="icon icon-song1 mr5"></i>单曲
                </p>
                <ul class="search-result">
                  <li v-for="item in searchResult.song.songs.slice(0,5)" :key="item.id" @click="toPlay(item.id);hideResult()">
                      <span v-html="item.name.replace(new RegExp(searchContent,'g'),`<strong>${searchContent}</strong>`)"></span>-
                    <template v-for="singer in item.ar">
                      <span v-html="singer.name.replace(new RegExp(searchContent,'g'),`<strong>${searchContent}</strong>`)" :key="singer.id"></span>
                    </template>
                  </li>
                </ul>
              </div>

              <div v-if="searchResult.artist && searchContent">
                <p class="suggest-title">
                  <i class="icon icon-singer1 mr5"></i>歌手
                </p>
                <ul class="search-result">
                  <router-link tag="li" :to="{name:'art',params:{art_id:item.id}}"
                    v-for="item in searchResult.artist.artists"
                    @click.native="hideResult"
                    :key="item.id"
                  >
                    <span v-html="item.name.replace(new RegExp(searchContent,'g'),`<strong>${searchContent}</strong>`)"></span>
                  </router-link>
                </ul>
              </div>

              <div v-if="searchResult.album && searchContent">
                <p class="suggest-title">
                  <i class="icon icon-album1 mr5"></i>专辑
                </p>
                <ul class="search-result">
                  <router-link 
                    tag="li" 
                    :to="{name:'album',params:{id:item.id}}" 
                    v-for="item in searchResult.album.albums" 
                    @click.native="hideResult"
                    :key="item.id"
                    >
                    <span v-html="item.name.replace(new RegExp(searchContent,'g'),`<strong>${searchContent}</strong>`)"></span>-
                    <span v-html="item.artist.name.replace(new RegExp(searchContent,'g'),`<strong>${searchContent}</strong>`)"></span>
                  </router-link>
                </ul>
              </div>

              <div v-if="searchResult.video && searchContent">
                <p class="suggest-title">
                  <i class="icon icon-video mr5"></i>视频
                </p>
                <ul class="search-result">
                  <li v-for="item in searchResult.video.videos.filter(ele=>ele.title.length<10)" :key="item.id" @click="toVideo(item.vid)">
                    <span v-html="item.title.replace(new RegExp(searchContent,'g'),`<strong>${searchContent}</strong>`)"></span> -
                    <template v-for="author in item.creator">
                      <span v-html="author.userName.replace(new RegExp(searchContent,'g'),`<strong>${searchContent}</strong>`)" :key="author.id"></span>
                    </template>
                  </li>
                </ul>
              </div>

              <div v-if="searchResult.playList && searchContent">
                <p class="suggest-title">
                  <i class="icon icon-playlist1 mr5"></i>歌单
                </p>
                <ul class="search-result">
                  <li v-for="item in searchResult.playList.playLists.filter(ele=>ele.name.length<10)" :key="item.id">
                    <span v-html="item.name.replace(new RegExp(searchContent,'g'),`<strong>${searchContent}</strong>`)"></span>-
                      <span v-html="item.creator.nickname.replace(new RegExp(searchContent,'g'),`<strong>${searchContent}</strong>`)" :key="item.id"></span>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </div>

        <div class="play-detail" v-if="audioInfo" :class="{'lyric-show':showLyric}" v-cloak>
            <div class="header-bar"></div>
            <div class="fm-info-wrapper" ref="wrapper">
              <div class="fm-box">
                <div class="song-info">
                  <div class="poster">
                    <img v-lazy="audioInfo.al.picUrl" />
                    <!-- <span class="status" :class="{
                      pause:!FMList[currentIndex] || audioInfo.id != FMList[currentIndex].id || audioStatus=='paused',
                      playing:FMList[currentIndex] && (audioInfo.id == FMList[currentIndex].id && audioStatus =='play')
                    }">
                      <i class="icon icon-play" v-if="!FMList[currentIndex] || audioInfo.id != FMList[currentIndex].id || audioStatus=='paused'" @click="toPlay()"></i>
                      <i class="icon icon-pause" v-else @click="toPause()"></i>
                    </span> -->
                  </div>
                  <div class="controls">
                    <span v-if="likeList.includes(audioInfo.id)" @click="addLike(audioInfo.id,false)"><i class="icon icon-like red" ></i></span>
                    <span v-else @click="addLike(audioInfo.id,true)"><i class="icon icon-like-hollow" ></i></span>
                    <span ><i class="icon icon-collect"></i></span>
                    <span ><i class="icon icon-download"></i></span>
                    <span><i class="icon icon-share"></i></span>
                  </div>
                </div>
                <div class="lyric" v-if="audioInfo">
                  <div class="song-name">
                    {{audioInfo.name}}
                    <span v-if="audioInfo.mvid">
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
                    <span class="album">专辑:<i>{{audioInfo.al && audioInfo.al.name}}</i></span>
                    <span class="singer">歌手:<i>{{audioInfo.ar[0] && audioInfo.ar[0].name}}</i></span>
                  </p>
                  <div class="lyric-wrapper" >
                    <!-- <div class="lyric-content" v-html="lyric">
                      
                    </div> -->
                    <ul class='lyric-content'>
                      <li v-for="(text,index) in lyric"  :data-time="text.time" :key="text.time+index">
                        <!-- :class="{current:text.time>=(currentTime-2)*100000 && (lyric[index+1]&&lyric[index+1].time >= (currentTime-2)*100000)}" -->
                        {{text.text}}
                      </li>
                    </ul>
                  </div>
                </div>
                
                
              </div>
              <div class="about-other">
                
              
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
                <div class="relative">
                  <dl>
                    <dt>相似歌曲</dt>
                    <dd v-for="item in relativeList" :key="item.id" @click="toPlay(item.id)">
                        <div :style="{backgroundImage:'url('+item.album.picUrl+')'}">

                        </div>
                        <p>
                          <strong>{{item.name}}</strong>
                          <span>{{item.artists[0].name}}</span>
                        </p>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            
            <div class="send-comment-wrapper" v-show="showCommentBox">
              <div class="mask" @click="showCommentBox=false"></div>
              <div class="send-comment">
                <p class="title">
                  <i class="icon icon-close" @click="showCommentBox=false"></i>
                  歌曲：{{audioInfo.name}}
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
      </div>
      <div class="global-player">
        <div class="timeline-wrapper" ref="timeline" >
          <p
            ref = "realline"
            class="timeline"
            :style="{ left: -((1 - currentTime / duration) * 100) + '%' }">
            <i class="timedot" ref="timedot"></i>
          </p>
        </div>
        <!-- <div class="time-control" @click="changeCurrentTime">
            <div class="time-line" :style="{left:-((1 - currentTime / duration) * 100) + '%'}" ref="timeline"></div>
        </div> -->
        <div class="play-info">
          <img
            v-lazy="audioInfo.al? audioInfo.al.picUrl: require('@/assets/images/logo.jpg')"
            width="60"
            height="60"
            @click="changeLyricBox"
          />
          <div style="height:50px;overflow:hidden">
            <template v-if="audioInfo">
              <p class="song-info">
                <span class="songname">{{ audioInfo.name }}</span
                >-
                <span class="singer">
                  <template v-for="(author, index) in audioInfo.ar">{{
                    index == 0 ? author.name : "/" + author.name
                  }}</template>
                </span>
              </p>
              <p class="times">
                <span class="playtime">{{ currentTime | timeFormat }}</span> /
                <span class="duration">{{ duration | timeFormat }}</span>
              </p>
            </template>
            <template v-else>
              <p class="slogan"><strong>网易云音乐</strong>-听见好时光！</p>
            </template>
          </div>
        </div>
        <ul class="controls">
          <li class="icon icon-like red" v-if="likeList.includes(audioInfo.id)" @click="addLike(audioInfo.id,false)"></li>
          <li class="icon icon-unlike" v-else @click="addLike(audioInfo.id,true)"></li>

          <li class="icon icon-prev-ctrl" @click="prevSong"></li>
          <li
            class="icon"
            :class="audioStatus == 'play' ? 'icon-pause' : 'icon-play'"
            @click="changePlayStatus"
          ></li>
          <li class="icon icon-next-ctrl" @click="nextSong"></li>
          <li class="icon icon-share"></li>
        </ul>
        <ul class="other-operate">
          <li class="icon icon-whale"></li>
          <li class="icon icon-loop"></li>
          <li class="icon icon-playlist"></li>
          <li class="icon icon-lyric" @click="changeLyricBox"></li>
          <li class="icon icon-volume"></li>
        </ul>
      </div>
    </div>
    <my-audio></my-audio>
  </div>
</template>
<script>
	import $ from "jquery"

import myAudio from "@/components/audio.vue";
import axios from "axios";
import { mapState, mapMutations } from "vuex";
	import comment from "@/components/comment.vue"

	import {Page} from "view-design"

export default {
  components: {
    myAudio,
    Page,
    comment
  },
  data() {
    return {
      searchContent: "",
      href: location.href,
      nav: [
        {
          group: "",
          child: [
            {
              name: "发现音乐",
              href: "/find/",
              icon: "icon-music",
              page: "find",
            },
            {
              name: "私人FM",
              href: "/fm",
              icon: "icon-fm",
              page: "fm",
            },
            {
              name: "视频",
              icon: "icon-video",
              page: "video",
              href: "/videolist",
            },
            {
              name: "朋友",
              href: "friend",
              icon: "icon-friend",
              page: "friend",
              needLogin:true,

            },
          ],
        },
        {
          group: "我的音乐",
          child: [
            {
              name: "iTunes音乐",
              href: "itunes",
              icon: "icon-itunes",
            },
            {
              name: "下载管理",
              href: "download",
              icon: "icon-download",
            },
            {
              name: "我的音乐云盘",
              href: "cloud",
              icon: "icon-cloud",
            },
            {
              needLogin:true,
              name: "我的收藏",
              href: "/mark",
              icon: "icon-mark",
            },
          ],
        },
        {
          group:'创建的歌单',
          needLogin:true,
          child:[]
        },
        {
          group:'收藏的歌单',
          needLogin:true,
          child:[]
        }
      ],
      nowPrefix: "+86",
      telPrefixList: [
        {
          country: "中国",
          prefix: "+86",
          icon: "icon-china",
        },
        {
          country: "中国香港",
          prefix: "+852",
          icon: "icon-hongkong",
        },
        {
          country: "中国澳门",
          prefix: "+853",
          icon: "icon-macau",
        },
        {
          country: "中国台湾",
          prefix: "+886",
          icon: "icon-taiwan",
        },
      ],
      loginForm: {
        phone: "",
        pwd: "",
      },
      isAgreeProctol: false,
      loginMsg: "",
      // userAccount:{},
      userId: "",
      token: "",
      userDetail: {},
      showUserInfoBox: false,
      loginlock: false,
      hotSearch: [],
      searchResult: {},



      showCommentBox:false,
      commentContent:"",
      showQuality:false,
      quality:1,

      showLyric:false,
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
      ],
      commentId:"",
      relativeId:"",
      relativeList:[]
    };
  },
  methods: {
    ...mapMutations(["changeShowLogin","changeShowSearchResult","changeLikeList",'changePlayIndex','changeSubAlbum','changeSubArt','changeSubVideo','changeUserDetail','changeSubList']),
    getHotSearch() {
      axios
        .post("/search/hot/detail", {
          limit: 10,
        })
        .then((res) => {
          this.hotSearch = res.data.data.slice(3, 12);
        });
    },
    getSearchResult() {
      if (!this.searchContent) return;
      axios.post("/search", {
          keywords: this.searchContent,
          type: 1018,
        })
        .then((res) => {
          this.searchResult = res.data.result;
        });
    },
    toSearch(){
      this.$router.push({
        name:'search',
        params:{
          keyword:this.searchContent
        }
      });
      this.hideResult();
      this.showLyric = false;
    },
    showUserInfo(e) {
      e.stopPropagation();
      if (!this.userId) {
        //若未登录显示登录框

        this.changeShowLogin(true);
      } else {
        this.showUserInfoBox = true;
      }
    },
    login() {
      const self = this;
      if (!this.isAgreeProctol) {
        this.$toast({
          message: "请先勾选同意服务条款、隐私政策、儿童隐私政策",
          // type:'loading',
          position: "middle",
          duration: 1000,
        });
      } else if (!this.loginForm.phone.trim()) {
        //检查手机号
        this.loginMsg = "请输入手机号";
        return;
      } else if (!this.loginForm.pwd.trim()) {
        this.loginMsg = "请输入登录密码";
        return;
      } else {
        this.loginlock = true;
        axios.post("/login/cellphone", {
            phone: this.loginForm.phone,
            password: this.loginForm.pwd,
          })
          .then((res) => {
            this.loginlock = false;
            if (res.data.code === 200) {
              this.userId = res.data.account.id;
              this.$store.dispatch("changeUid", this.userId);
              this.token = res.data.token;

              this.$toast({
                message: "登陆成功",
              });
              this.changeShowLogin(false);
              //获取用户详情
              this.getUserDetail();
              this.getUserSub();
              this.getLoveAlbum();
              this.getLoveArt();
              this.getLoveVideo();
              this.getLoveSong();
            }
          })
          .catch(function(error) {
            self.loginlock = false;
            if (error.response) {
              self.$toast({
                message: error.response.data.msg,
                duration: 2000,
              });
            }
          });
      }
    },
    hideError() {
      this.loginMsg = "";
    },
    getUserDetail() {
      axios
        .post("/user/detail", {
          uid: this.userId,
        })
        .then((res) => {
          if (res.status === 200) {
            this.userDetail = res.data;
            this.changeUserDetail(res.data);
            return axios.post("/likelist",{
              uid:this.userId
            })
          }
        }).then(res=>{
          this.changeLikeList(this.likeList.concat(res.data.ids))
        })
    },
    preventBubble(e) {
      e.stopPropagation();
      console.log('禁止冒泡')
    },
    changeCurrentTime(e) {
      console.log(e);
      this.bus.$emit(
        "changeCurrent",
        (e.offsetX / this.$refs.timeline.offsetWidth) * this.duration
      );
    },
    changePlayStatus() {
      this.bus.$emit("changeStatus");
    },
    historyBack() {
      history.back(1);
    },
    historyForward() {
      history.forward(1);
    },
    sign() {
      axios
        .post("/daily_signin", {
          type: 1,
        })
        .then(() => {
          this.$toast({
            message: "签到成功",
          });
          this.getUserDetail();
        });
    },
    exit() {
      axios.post("/logout").then(() => {
        this.$toast({
          message: "已退出",
        });
        location.reload();
      });
    },
    toPlay(id){
      this.bus.$emit('play',[id]);
      //获取评论、相似歌曲
      setTimeout(()=>{
        this.getComment();
      },800)
      

      // this.hideResult()
    },
    toVideo(id){
      location.href=`/video.html?id=${id}&type=${isNaN(+id)?'v':'v'}`
      if(isNaN(+id)){//mv
          location.href=`/video.html?id=${id}&type=v`
      }else{
          
          location.href=`/video.html?mvid=${id}&type=m`
      }
    },
    hideResult(){
      this.changeShowSearchResult(false)
    },
    showResult(){
      this.changeShowSearchResult(true)
    },
    changeSearchContent(keyword){
      this.searchContent = keyword;
      this.$nextTick(()=>{
        this.$refs.searchContent.focus()
      })
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



      showComment(){
				if(this.uid){
					this.showCommentBox = true;
				}else{
					// this.$store.commit("changeShowLogin",true)
					this.changeShowLogin(true)
				}
			},
		
			checkQuality(index){
				this.quality = index;
				this.showQuality = false;
			},
			getComment(){
				axios.post("/comment/music",{
					limit:20,
					offset:(this.page-1)*20,
					id:this.audioInfo.id
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
					this.commentId = this.audioInfo.id;
          this.relativeId = this.audioInfo.id;
          return axios.post("/simi/song",{
            id:this.audioInfo.id
          })
				}).then(res=>{
          this.relativeList = res.data.songs;
        })
			},
			changeCommentPage(page){
				this.page = page;
				this.getComment();
			},
			toPause(){
				this.bus.$emit("changeStatus")
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
						id:this.audioInfo.id,
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
      },
      changeLyricBox(){
          if(!this.audioInfo.id) return;  //无歌曲
          if(this.showLyric){//隐藏
              this.showLyric = false;
          }else{
            //检查是否获取过评论等信息，如果没有则获取
            if(this.commentId != this.audioInfo.id){
              this.getComment();
            }
            this.showLyric = true;
          }
      },
      prevSong(){
            console.log(this.playIndex)
          this.changePlayIndex(this.playIndex-1>=0? this.playIndex-1 : this.playList.length-1);
          setTimeout(()=>{
            this.bus.$emit('play',['']);
          })
      },
      nextSong(){
          this.changePlayIndex(this.playIndex+1>=this.playIndex.length ? 0 : this.playIndex+1);
          setTimeout(()=>{
            this.bus.$emit('play',['']);
          })
      },
      getUserSub(){
        axios.post("/user/subcount").then(res=>{
          console.log(res)
        })
      },
      getLoveAlbum(){
        axios.post('/album/sublist',{
          limit:300,
        }).then(res=>{
            this.changeSubAlbum(res.data.data);
        })
      },
      getLoveArt(){
        axios.post("/artist/sublist",{
          limit:300,
        }).then(res=>{
          this.changeSubArt(res.data.data)
        })
      },
      getLoveVideo(){
        axios.post("/mv/sublist",{
          limit:100
        }).then(res=>{
          this.changeSubVideo(res.data.data)
        })
      },
      getLoveSong(){
        axios.post("/user/playlist",{
          uid:this.uid
        }).then(res=>{
          this.changeSubList(res.data.playlist)
        })
      }
  },
  mounted() {
    axios.post("/login/status").then((res) => {
      this.userId = res.data.profile.userId;
      this.$store.dispatch("changeUid", this.userId);
      this.getUserDetail();
      this.getUserSub();
      this.getLoveAlbum();
      this.getLoveArt();
      this.getLoveVideo();
      this.getLoveSong()
    });
    this.getHotSearch();
    const self = this;
    var doc = document.body || document.documentElement;
    doc.addEventListener("click", function() {
      self.showUserInfoBox = false;
      // console.log("文档被点击",e)
      self.changeShowSearchResult(false)
    });
    this.$refs.timeline.addEventListener('click',function(e){
        if(e.target.nodeName=='DIV'){
            self.bus.$emit("changeCurrent",(e.offsetX / self.$refs.timeline.offsetWidth) * self.duration);
        }else{
            var hidden = 1000 -  self.currentTime/self.duration *1000;

            self.bus.$emit("changeCurrent",(e.offsetX  - hidden)/self.$refs.timeline.offsetWidth * self.duration);
        }
    })

    this.$refs.timedot.onclick=function(e){
        e.stopPropagation();
    }
    this.$refs.timedot.onmousedown=function(e){
          e.stopPropagation();
          e.preventDefault();
          var dragFlag = false;
          var percent = 0;
          document.onmousemove=function(e){
              // console.log(e);
              // var hidden = 1000 -  self.currentTime/self.duration *1000;
              if(e.target.nodeName == 'DIV'){
                dragFlag = true;
                percent = e.offsetX/self.$refs.timeline.offsetWidth
                self.$refs.realline.style.left =  (1-percent) * -100 +'%';

              }else if(e.target.nodeName == 'P'){
                  dragFlag = true;
                 var hidden = 1000 -  self.currentTime/self.duration *1000;
                  percent = (e.offsetX  - hidden)/self.$refs.timeline.offsetWidth
                  self.$refs.realline.style.left =  (1-percent) * -100 +'%';

              }

          }
          document.onmouseup = function(){
            document.onmouseup = document.onmousemove = null;
            if(dragFlag){
                self.bus.$emit("changeCurrent",percent* self.duration);
            }
          }
    }
    
    
  },
  computed: {
    ...mapState([
      "uid",
      "audioInfo",
      "currentTime",
      "duration",
      "audioStatus",
      "showLogin",
      "showSearchResult",
      "lyric",
      'likeList',
      'playList',
      'playIndex',
      'subList'
    ]),
  },
  filters: {
    durationFormat(val) {
      if (!val) return "--:--:--";
      var hours = val / 3600000; //时
      var min = Math.floor((val % 3600000) / 60000); //分
      var sec = Math.round(((val % 3600000) % 60000) / 1000); //秒
      var result = "";
      if (hours > 1) {
        result += hours > 9 ? `${hours}:` : `0${hours}:`;
      }
      result += min > 9 ? `${min}:` : `0${min}:`;
      result += sec > 9 ? `${sec}` : `0${sec}`;
      return result;
    },
    timeFormat(val) {
      if (!val) return "--:--:--";
      var hours = parseInt(val / 3600);
      var min = parseInt(Math.floor((val % 3600) / 60));
      var sec = Math.floor((val % 3600) % 60);

      var result = "";
      if (hours > 0) {
        result += (hours > 9 ? `${hours}:` : `0${hours}:`);
      }
      result += (min > 9 ? `${min}:` : `0${min}:`);
      result += (sec > 9 ? `${sec}` : `0${sec}`);
      return result;
    },
  },
  watch:{
			currentTime:function(val){
				clearInterval(this.timer)
				var li = $(".lyric-wrapper li");
				let current = li.filter(function(index,ele){	//找到当播放的歌词行，双语可能有多行
						//当前时间大于歌词行的时间且小于下一行的时间
						if(val * 1000>= $(ele).attr("data-time") && (li[index+1]?val*1000 <$(li[index+1]).attr("data-time"):true) ){
							return $(ele)
						}
				})

				li.removeClass("current");	//所有行移除高亮
				current.addClass("current");	//当前播放的加上高亮


				let index = $(".lyric-content li").index(current.last())
				$(".lyric-wrapper ul").css({
					marginTop:index>6 ? -(index-6)*30:0
				});
      },
      subList(val){
        var c = [],f=[];
        for(var i=0;i<val.length;i++){
            if(val[i].creator.userId == this.userId){
                c.push({
                  name: val[i].name,
                  href: `/list/${val[i].id}`,
                  icon: "icon-like-hollow",
                })
            }else{
                f.push({
                  name: val[i].name,
                  href: `/list/${val[i].id}`,
                  icon: "icon-mark",
                })
            }
            
          }
          this.nav[2].child = c;
          this.nav[3].child = f;
      }
		}
};
</script>
<style lang="less">
  .time-control{
      position:absolute;
      top:0;
      left:0;
      width:100%;
      // background:#fff;
      height:8px;
      cursor:pointer;
      &:hover{
        .time-line::after{
          display:inline-block;
        }
      }
      .time-line{
        width:100%;
        height:3px;
        background-color:#f40 ;
        // top:50%;
        border-radius:3px;
        top:0;
        position:absolute;
        left:-100%;
        // transform:translatey(-50%);
        &::after{
          content:"";
          width:10px;
          height:10px;
          border-radius:10px;
          background:#f40;
          position:absolute;
          right:-5px;
          top:-3px;
          display:none;
          cursor:pointer;
        }
      }
  }

  @keyframes rotate{
    0%{
      box-shadow:inset 0 0 30px #fff, 
                  inset 6px 0 45px pink, 
                  inset -6px 0 45px purple, 
                  inset 6px 0 90px pink, 
                  inset -6px 0 90px purple, 
                  0 0 10px #fff, 
                  6px 0 40px pink, 
                  -6px 0 40px purple;
      transform:rotateZ(0deg)
    }
  
    50%{
        box-shadow:inset 0 0 30px #fff, 
                  inset 6px 0 45px cyan, 
                  inset -6px 0 45px rgb(9, 216, 178), 
                  inset 6px 0 90px cyan, 
                  inset -6px 0 90px rgb(9, 216, 178), 
                  0 0 10px #fff, 
                  6px 0 40px cyan, 
                  -6px 0 40px rgb(9, 216, 178);
        transform:rotateZ(360deg)
    }
    100%{
          box-shadow:inset 0 0 30px #fff, 
                      inset 6px 0 45px pink, 
                      inset -6px 0 45px purple, 
                      inset 6px 0 90px pink, 
                      inset -6px 0 90px purple, 
                      0 0 10px #fff, 
                      6px 0 40px pink, 
                      -6px 0 40px purple;
          transform:rotateZ(720deg)
    }
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
    .lyric-show{
      top:0 !important;
    }
  /**播放歌曲详情 */
  .play-detail{
    position:absolute;
    top:800px;
    transition:all .5s ease-in-out;
    height:800px;
    left:0;
    z-index:66;
    background:rgb(52,52,52);
    color:rgb(172,172,172);
    width:100%;
    .header-bar{
        height:70px;
        background:rgb(32,32,32);
      }
      .fm-info-wrapper{
        height:calc(100% - 250px);
        background:#202020;
        overflow-y:scroll;
        
        .fm-box{
          height:500px;
          justify-content:space-around;
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
              border-radius:50%;
              margin:0 auto;
              // border-radius:5px;
              overflow: hidden;
              position:relative;
              display:flex;
              justify-content:center;
              align-items:center;
              animation: rotate 30s linear  infinite;
              will-change:transform,box-shadow;
              img{
                // width:100%;
                width:200px;
                height:200px;
                border-radius:50%;
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
            // flex:1;
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
                  background:rgb(22,22,22);
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
            .lyric-wrapper{
              // border:1px solid cyan;
              width:400px;
              flex:1;
              overflow-y:scroll;
              .lyric-content{
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
        .about-other{
          display:flex;
          justify-content:space-around;
          .comment{
            height:100px;
            padding:0 30px;
            margin-top:50px;
            text-align: left;
            width:600px;
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
          .relative{
            width:350px;
            margin-left:30px;
            padding-top:55px;
            display:flex;
            flex-direction:column;
            dl{
              text-align:left;
              dt{
                font-weight:bolder;
                font-size:18px;
                margin-bottom:20px;
              }
              dd{
                display:flex;
                align-items:center;
                margin-bottom:20px;
                flex-shrink:0;
                cursor:pointer;
                div{
                  width:60px;
                  height:60px;
                  background-size:100% 100%;
                  border-radius:5px;
                  margin-right:10px;
                }
                p{
                  display:flex;
                  flex:1;
                  flex-direction:column;
                }
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
            color:rgb(172,172,172);
            padding:10px;
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
  .search-bar {
    input{
      text-indent:10px;
    }
    .search-suggest {
      width: 350px;
      height: 570px;
      background: #fff;
      position: absolute;
      right: 0;
      top: 50px;
      background: rgb(45, 45, 45);
      z-index: 5000;
      box-sizing: border-box;
      padding: 20px 0px 0 0;
      .result-wrapper {
        width: 100%;
        height: 100%;
        overflow-y: scroll;
        .suggest-title {
          text-align: left;
          color: rgb(132, 132, 132);
          line-height: 40px;
          padding: 0 20px;
          // margin-bottom:20px;
        }
        ul.suggest {
          display: flex;
          flex-wrap: wrap;
          padding:20px;
          box-sizing:border-box;
          li {
            border: 1px solid rgb(72, 72, 72);
            padding: 3px 15px;
            font-size: 12px;
            border-radius: 20px;
            margin: 5px 10px 5px 0;
            cursor: pointer;
          }
        }
        ul.search-result {
          li {
            height: 36px;
            line-height: 36px;
            text-align: left;
            padding: 0 30px;
            cursor: pointer;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            strong{
              color:skyblue;
            }
            &:hover {
              background: rgb(72, 72, 72);
            }
          }
        }
      }
    }
  }
  .router-link-exact-active {
    color: red !important;
  }
  .router-link-exact-active .icon {
    color: red !important;
  }
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  background: #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 1000px;
}
body,
html {
  width: 100%;
  height: 100%;
}
#nav {
  padding: 30px;
}
#nav a {
  font-weight: bold;
  color: #2c3e50;
}
#nav a.router-link-exact-active {
  color: #42b983;
}
.base-content-wrapper {
  width: 1000px;
  background: rgb(33, 33, 33);
  border: 1px solud purple;
  height: 700px;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
}
.base-content {
  /* width:100%; */
  width: 1000px;
  height: 620px;
  display: flex;
  position:relative;
  overflow:hidden;
  /* border-bottom:1px solid #444; */
}
.system-operate {
  position: absolute;
  left: 10px;
  top: 15px;
  display: flex;
  cursor: pointer;
  z-index: 999;
}
.system-operate li {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  cursor: pointer;
  margin-right: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.system-operate li:first-of-type {
  background: rgb(252, 72, 71);
}
.system-operate li:nth-of-type(2) {
  background: rgb(253, 181, 37);
}
.system-operate li:last-of-type {
  background: rgb(42, 202, 51);
}
.system-operate li::before {
  font-size: 12px;
  height: 15px;
  line-height: 15px;
  display: none;
}
.system-operate li:first-of-type::before {
  content: "\e7a5";
  color: rgb(108, 7, 2);
}
.system-operate li:nth-of-type(2)::before {
  content: "\e63c";
  color: rgb(134, 19, 3);
}
.system-operate li:last-of-type::before {
  content: "\ea47";
  color: rgb(11, 84, 12);
}
.system-operate:hover li::before {
  display: inline-block;
}
.base-content-left {
  width: 200px;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.base-content-left .head {
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-shrink:0;
}
.base-content-left .head span {
  display: inline-block;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
  cursor: pointer;
  line-height: 30px;
  text-align: center;
}
.base-content-left-nav {
  flex: 1;
  overflow-y:scroll;
  background: rgb(23, 23, 23);
}
.base-content-left .user {
  height: 60px;
  width: 100%;
  display: flex;
  align-items: center;
  background: rgb(20, 20, 20);
  font-size: 14px;
  color: #aaa;
  position: relative;
  flex-shrink:0;
}
.base-content-left .user > img {
  width: 40px;
  border-radius: 50%;
  margin: 0 10px;
}
.base-content-left .user .nickname {
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  cursor: pointer;
  position: relative;
}
.base-content-left .user .userinfo-box {
  width: 300px;
  height: 400px;
  background: rgb(41, 41, 41);
  border-radius: 5px;
  position: absolute;
  left: 98%;
  top: 10px;
  z-index: 99;
}
.base-content-left .user .icon-right {
  width: 30px;
  height: 30px;
  line-height: 30px;
  margin-left: 10px;
  cursor: pointer;
}
.base-content-left .user .nickname .username {
  flex: 1;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.base-content-left-nav dl {
  margin-bottom: 10px;
}
.base-content-left-nav dt {
  font-size: 12px;
  color: #777;
  padding: 0 10px 0 20px;
  text-align: left;
  cursor: default;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 800;
}
.base-content-left-nav dd {
  font-weight: 800;
  height: 35px;
  line-height: 35px;
  text-align: left;
  padding-left: 20px;
  font-size: 14px;
  color: rgb(170, 170, 170);
  cursor: pointer;
}
.base-content-left-nav dt .icon,
.base-content-left-nav dd .icon {
  font-weight: normal;
}
.base-content-left-nav dd:hover {
  background: rgb(22, 21, 21);
}
.base-content-left-nav .icon {
  font-size: 18px;
  color: #888;
  margin-right: 5px;
}
.base-content-right {
  /* flex:1; */
  width: calc(100% - 200px);
  height: 100%;
}
.global-player {
  border-top: 1px solid rgb(27, 26, 26);
}
.login-box {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 998;
}
.login-box-mask {
  width: 100%;
  height: 100%;
}
.login-content {
  width: 350px;
  height: 480px;
  background: #fff;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.login-form {
  width: 250px;
  height: 400px;
  /* border:1px solid red; */
  margin: 60px auto 0;
}
.login-form .bg {
  width: 100%;
  /* background-image:url("@/assets/images/login_bg.jpg"); */
  background-size: 100% 100%;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-form .bg .phone {
  font-size: 80px;
  color: rgb(237, 136, 141);
}
.login-info {
  width: 100%;
  height: 80px;
  margin: 30px 0;
  border: 1px solid rgb(214, 214, 214);
  border-radius: 5px;
}
.login-info .tel {
  display: flex;
  align-items: center;
  height: 40px;
  border-bottom: 1px solid rgb(214, 214, 214);
  box-sizing: border-box;
  padding: 0 10px;
}
.login-info .tel .prefix {
  flex: 1;
  height: 40px;
  line-height: 40px;
  border-right: 1px solid rgb(214, 214, 214);
  display: flex;
  align-items: center;
  cursor: pointer;
}
.login-info .tel .prefix .phone {
  width: 20px;
  color: #aaa;
}
.login-info .tel .prefix .triangle {
  width: 0;
  height: 0;
  border: 5px solid transparent;
  margin: 0 10px;
  border-top-color: rgb(135, 135, 135);
}
.login-info .tel .prefix .prefix-num {
  flex: 1;
  font-size: 12px;
}
.login-info .tel input {
  flex: 2;
  border: none;
  outline: none;
  font-size: 12px;
  margin-left: 10px;
  font-weight: 700;
}
.login-info .password {
  display: flex;
  height: 40px;
  align-items: center;
  padding: 0 10px;
}
.login-info .password .icon-lock {
  width: 20px;
  margin-right: 10px;
}
.login-info .password input {
  flex: 1;
  border: none;
  font-size: 12px;
  outline: none;
}
.login-info .reset-pwd {
  width: 60px;
  text-align: center;
  font-size: 12px;
  color: rgb(178, 178, 178);
  cursor: pointer;
}
.login-info .errormsg {
  color: red;
  font-size: 12px;
  margin-top: 5px;
  text-align: right;
}
.sub-login {
  height: 40px;
  line-height: 40px;
  font-size: 18px;
  letter-spacing: 5px;
  font-weight: 500;
  color: #fff;
  background: rgb(199, 27, 27);
  cursor: pointer;
  border-radius: 3px;
}
.register {
  height: 40px;
  line-height: 40px;
  text-decoration: underline;
  cursor: pointer;
}
.login-way {
  display: flex;
  height: 50px;
  justify-content: space-between;
  align-items: center;
}
.login-way li {
  font-size: 18px;
  padding: 5px;
  border: 1px solid rgb(195, 195, 195);
  border-radius: 50%;
  color: rgb(83, 83, 83);
  cursor: pointer;
}
.proctol {
  font-size: 10px;
  margin-top: 20px;
  color: rgb(180, 180, 180);
}
.proctol a {
  color: #409eff;
  text-decoration: none;
}
.login-content .icon-close {
  position: absolute;
  left: 10px;
  top: 10px;
  font-size: 12px;
  color: rgb(150, 150, 150);
  cursor: pointer;
}
.userinfo-box .follows {
  height: 150px;
  border-bottom: 1px solid rgb(70, 70, 70);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.userinfo-box .follows ul {
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: 80px;
}
.userinfo-box .follows ul li span {
  font-size: 30px;
  font-weight: bold;
}
.userinfo-box .follows .sign {
  width: 100px;
  height: 30px;
  border-radius: 30px;
  line-height: 30px;
  border: 1px solid rgb(70, 70, 70);
}
.userinfo-box .follows .not-sign {
  cursor: pointer;
}
.userinfo-box .follows .not-sign:hover {
  color: rgb(170, 170, 170);
  border-color: rgb(170, 170, 170);
}
.userinfo-box .follows .not-sign:hover i {
  color: rgb(170, 170, 170);
}
.userinfo-box .follows .not-sign i {
  font-style: normal;
  font-size: 24px;
  vertical-align: sub;
  color: rgb(70, 70, 70);
}
.userinfo-box > ul {
  border-bottom: 1px solid rgb(70, 70, 70);
  padding: 5px 0;
}
.userinfo-box > ul li {
  height: 36px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
}
.userinfo-box > ul li:hover {
  background: rgb(49, 51, 54);
}
.userinfo-box > ul:last-of-type {
  border: none;
}
.userinfo-box > ul li p:first-of-type .icon {
  font-size: 16px;
  margin-right: 8px;
}
.userinfo-box > ul li p .icon {
  font-size: 16px;
}
.userinfo-box .account-info li::after,
.userinfo-box .setting-info li::after {
  content: "\e641";
  position: absolute;
  right: 5px;
  font-size: 12px;
  color: rgb(127, 126, 125);
}
.global-player {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
  position: relative;
}
.global-player .timeline-wrapper {
  cursor: pointer;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 3px;
}
.global-player .timeline-wrapper .timeline {
  position: absolute;
  width: 100%;
  left: -100%;
  top: 0;
  height: 3px;
  border-radius: 3px;
  background: rgb(198, 38, 38);
}
.global-player .timeline-wrapper .timeline .timedot{
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: rgb(198, 38, 38, 38);
    position: absolute;
    right: -4px;
    top: 50%;
    display: none;
    transform: translatey(-50%);
}
.global-player .timeline-wrapper:hover .timedot{
  display:inline-block;
}
// .global-player .timeline-wrapper .timeline:after {
//   content: "";
//   width: 15px;
//   height: 15px;
//   border-radius: 50%;
//   background: rgb(198, 38, 38, 38);
//   position: absolute;
//   right: -4px;
//   top: 50%;
//   display: none;
//   transform: translatey(-50%);
// }
// .global-player .timeline-wrapper:hover .timeline:after {
//   display: inline-block;
// }
.global-player .play-info {
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 12px;
  max-width: 33%;
  color: rgb(132, 132, 132);
}
.global-player .play-info img {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 5px;
  margin-right: 10px;
}
.global-player .play-info .song-info {
  color: rgb(164, 176, 213);
  margin-bottom: 5px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.global-player .play-info .song-info .songname {
  font-size: 16px;
}
.global-player .play-info .times {
  font-weight: 800;
  text-align: left;
  color: rgb(172, 172, 172);
}
.global-player .play-info .times span {
  color: rgb(101, 101, 101);
}
.global-player .controls {
  flex: 1;
  display: flex;
  height: 80px;
  justify-content: center;
  align-items: center;
}
.global-player .controls li {
  width: 40px;
  height: 40px;
  line-height: 40px;
  font-size: 20px;
  color: rgb(178, 178, 178);
  cursor: pointer;
  margin-right: 10px;
}
.global-player .controls li:nth-of-type(3) {
  font-size: 20px;
  border-radius: 50%;
  background: rgb(195, 36, 37);
}
.global-player .controls li:nth-of-type(2),
.global-player .controls li:nth-of-type(4) {
  color: rgb(195, 36, 37);
}
.global-player .other-operate {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.global-player .other-operate li {
  font-size: 20px;
  margin-right: 20px;
  color: rgb(178, 178, 178);
  cursor: pointer;
}
.base-content .search-bar {
  position: absolute;
  right: 0px;
  top: 0px;
  color: rgb(213, 213, 213);
  height: 70px;
  display: flex;
  align-items: center;
  z-index:99;
}
.base-content .search-bar input {
  width: 150px;
  height: 24px;
  border: none;
  outline: none;
  border-radius: 24px;
  /* text-indent:20px; */
  background: rgb(50, 57, 64);
  color: rgb(213, 213, 213);
}
.base-content .search-bar input::-webkit-input-placeholder {
  color: rgb(152, 152, 152);
}
.base-content .search-bar span {
  margin: 0 10px;
  cursor: pointer;
}
.slogan {
  display: flex;
  align-items: center;
  height: 100%;
  /* font-weight:bolder; */
  font-style: italic;
  font-size: 14px;
}
.slogan strong {
  font-style: normal;
}
.red {
  color: rgb(195, 36, 37);
}
</style>
