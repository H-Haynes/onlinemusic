<template>
	<div class="zhubo">
		<img v-lazy="radio.picUrl" />
		<div class="zhubo-info">
			<p>{{radio.name}}</p>
			<span>{{radio.copywriter}}</span>
		</div>
	</div>
</template>

<script>
	export default {
		props:{
			radio:{
				type:Object,
				required:true
			}
		}
	}
</script>

<style lang="less" scoped>
	.zhubo{
		box-sizing:border-box;
		padding:10px;
		border-radius:5px;
		display:flex;
		align-items: center;
		cursor:pointer;
		&:hover{
			background:rgb(42,44,46)
		}
		img{
			width:100px;
			height:100px;
			border-radius:5px;
			margin-right:20px;
		}
		.zhubo-info{
			flex:1;
			// font-size:14px;
			text-align: left;
			overflow: hidden;
			p{
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				color:rgb(172,172,172);
			}
			span{
				font-size:12px;
				color:rgb(150,150,150)
			}
		}
		
		
	}
</style>
