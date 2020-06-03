<template>
	<router-link tag="div" :to="{name:'list',params:{list_id:album.id}}" class="num-pic" :style="{width:size+'px'}">
		<div class="bg" :style="{width:size+'px',height:size+'px',backgroundImage:'url('+album.picUrl+')'}">
			<span class="num">
				<i class="icon icon-play-hollow"></i>
				{{album.playCount | fixedNum}}
			</span>
			<span class="play">
				<i class="icon icon-play"></i>
			</span>
		</div>
		<a class="description">
			{{album.name}}
		</a>
	</router-link>
</template>

<script>
	/*封面为图片加人数的组件*/
	export default {
		props:{
			album:{
				type:Object,
				required:true
			},
			size:{
				type:Number,
				default:200
			}
		},
		filters:{
			fixedNum(val){
				if(val<10000){
					return val;
				}else if(val<1000000){
					return (val/10000).toFixed(1)+'万'
				}else if(val<100000000){
					return Math.ceil(val/10000) + '万'
				}else{
					return (val/100000000).toFixed(1)+'亿'
				}
			}
		}
	}
</script>

<style lang="less" scoped="">
	.num-pic{
		margin-bottom:20px;
		.bg{
			border-radius:5px;
			background-size:100% 100%;
			position:relative;
			cursor: pointer;
			&:hover{
				.play{
					opacity: 0.7;
					transition:all .3s linear
				}
			}
			.num{
				position:absolute;
				right:5px;
				top:5px;
				font-size:12px;
				color:#fff;
				.icon-play-hollow{
					color:#fff;
				}
			}
			.play{
				width:30px;
				height:30px;
				display:flex;
				justify-content: center;
				align-items:center;
				border-radius:50%;
				background:rgba(200,200,200);
				opacity: 0;
				position: absolute;
				bottom:5px;
				right:5px;
				.icon-play{
					margin-left:5px;
					color:rgb(200,37,37);
				}
			}
			
		}
		.description{
			margin-top:5px;
			width:100%;
			color:rgb(172,172,172);
			font-size:13px;
			line-height:20px;
			text-align: left;
			display: inline-block;
			cursor:pointer;
			&:hover{
				color:rgb(213,213,213)
			}
		}
	}
</style>
