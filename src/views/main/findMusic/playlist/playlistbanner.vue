<template>
	<div class="list" ref="list" :style="{backgroundImage:'url('+gaussImg+')'}">
		<img :src="playlist.coverImgUrl"/>
		<div class="description">
			<span class="tag"><i class="icon mr5" style="color:rgb(225,155,75)">&#xe63a;</i>{{playlist.tag}}</span>
			<p class="name">{{playlist.name}}</p>
			<p class="explain">{{playlist.copywriter}}</p>
		</div>
	</div>
</template>

<script>
	import blurImg from  "@/utils/gaussBlur.js"
	export default {
		props:{
			playlist:{
				type:Object,
				required:true
			}
		},
		data(){
			return {
				gaussImg:""
			}
		},
		updated(){
			const self = this;
			var img = new Image();
			img.src = this.playlist.coverImgUrl;
			img.crossOrigin='anonymous';
			img.onload = function () {
				self.gaussImg = blurImg(img)
			};
		}
	}
</script>

<style scoped lang="less">
	.list{
		height:150px;
		
		border-radius:10upx;
		border:1upx solid #fff;
		display: flex;
		background-size:cover;
		padding:20px ;
		border-radius: 10px;
		img{
			width:120px;
			height:120px;
			border-radius:10px;
		}
		div.description{
			margin-left:10px;
			text-align:left;
			display:flex;
			flex-direction: column;
			justify-content: center;
			.tag{
				height:24px;
				line-height:24px;
				border-radius:24px;
				width:80px;
				padding:0px 15px;
				font-size:14px;
				color:rgb(225,155,75);
				border:1px solid rgb(225,155,75);
			}
			p{
				line-height:30px;
			}
			p.name{
				color:#fff;
			}
			.explain{
				font-size:12px;
				color:rgb(132,132,132);
			}
		}
	}
</style>
