<template>
	<div class="tj-mv" :style="{width:width+'px'}"  @click="tomv(mv.id)">
		<div class="poster" 
			:style="{width:width+'px',height:height+'px',backgroundImage:'url('+mv.picUrl+')'}"
			@mouseover="showDesc" @mouseout="hideDesc()"
			>
			<span class="play-count">
				<i class="icon icon-play"></i>
				{{mv.playCount}}万
			</span>
			<p class="description" ref="desc">{{mv.copywriter}}</p>
		</div>
		<p class="mv-name">{{mv.name}}</p>
		<span class="author">{{mv.artistName}}</span>
	</div>
</template>

<script>
	export default{
		props:{
			mv:{
				type:Object,
				required:true
			},
			width:{
				type:Number,
				default:170
			},
			height:{
				type:Number,
				default:100
			}
		},
		methods:{
			showDesc(){
				this.$refs.desc.style.top=0
			},
			hideDesc(){
				this.$refs.desc.style.top="-80px"
			},
			tomv(id){
				location.href=`/video.html?mvid=${id}&type=m`
			}
		}
	}
</script>

<style lang="less" scoped>
	.tj-mv{
		text-align: left;
		.poster{
			border-radius:5px;
			background-size:100% 100%;
			position: relative;
			cursor:pointer;
			overflow:hidden;
			.play-count{
				display: block;
				font-size:12px;
				text-align: right;
				margin-right:5px;
				margin-top:5px;
				color:rgb(213,213,213)
			}
			.description{
				color:rgb(172,172,172);
				width:100%;	
				font-size:13px;
				background:rgba(0,0,0,.5);
				border-radius:5px 5px 0 0;
				padding:0 5px;
				box-sizing: border-box;
				position:absolute;
				top:-80px;
				left:0;
				transition:all .5s linear;
			}
		}
		.mv-name{
			color:rgb(172,172,172);
			font-size:13px;
			text-align: left;
			white-space: nowrap;
			overflow: hidden;
			width:170px;
			text-overflow: ellipsis;
			margin-top:10px;
		}
		.author{
			font-size:12px;
			color:rgb(150,150,150)
		}
	}
</style>
