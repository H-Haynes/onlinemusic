<template>
	<div class="dujia" :style="{ width: width + 'px' }" @click="toMv">
		<div class="bg" :style="{ width: width + 'px', height: height + 'px', backgroundImage: 'url(' + album.sPicUrl + ')' }">
			<span class="play"><i class="icon icon-play-hollow"></i></span>
		</div>
		<a class="name">{{ album.name }}</a>
	</div>
</template>

<script>
export default {
	props: {
		album: {
			type: Object,
			required: true
		},
		width: {
			type: Number,
			default: 170
		},
		height: {
			type: Number,
			default: 100
		}
	},
	methods:{
		toMv(){
			location.href=`/video.html?mvid=${this.album.id}&type=m`
		}
	}
};
</script>

<style lang="less" scoped>
.dujia {
	.bg {
		background-size: 100% 100%;
		border-radius: 5px;
		cursor: pointer;
		position: relative;
		.play {
			position: absolute;
			left: 5px;
			top: 5px;
			text-align: center;
			text-indent: 5px;
			line-height: 20px;
			width: 20px;
			height: 20px;
			border-radius: 50%;
			border: 1px solid rgb(172, 172, 172);
			font-size: 12px;
			color:rgb(172,172,172);
			background: rgba(50, 50, 50, 0.5);
		}
	}
	.name {
		font-size: 13px;
		text-align: left;
		display: inline-block;
		line-height: 20px;
		margin-top: 10px;
		cursor: pointer;
		height:40px;
		overflow:hidden;
		text-overflow: ellipsis;
		&:hover {
			color: rgb(213, 213, 213);
		}
	}
}
</style>


