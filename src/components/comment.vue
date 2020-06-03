<template>
	<div class="comment-box">
		<img :src="comment.user.avatarUrl"/>
		<div class="content">
			<p>
				<a href="javascript:;">{{comment.user.nickname}}</a>:
				{{comment.content}}
			</p>
			<div class="operate">
				<span class="time">{{comment.time |toTimeStrZH}}</span>
				<span class="other">
					<i class="icon icon-zan"> {{comment.likedCount}} </i>
					<i class="icon icon-share"></i>
					<i class="icon icon-comment"></i>
				</span>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props:{
			comment:{
				type:Object,
				isRequired:true
			}
		},
		data(){
			return {
				
			}
		}
	}
</script>

<style lang="less" scoped>
	.comment-box{
		display:flex;
		font-size:14px;
		width:100%;
		box-sizing: border-box;
		padding:20px 0 0 0;
		img{
			width:50px;
			height:50px;
			border-radius:50%;
			margin-right: 20px;
		}
		.content{
			flex:1;
			border-bottom:1px solid rgb(42,42,42);
			a{
				color:skyblue
			}
			.operate{
				margin-top:10px;
				margin-bottom: 20px;
				display:flex;
				justify-content: space-between;
				align-items: center;
				font-size:12px;
				.other{
					i{
						margin:0 10px;
						cursor:pointer;
						&:before{
							font-size:14px;
						}
					}
				}
				*{
					color:rgb(120,120,120);
				}
			}
		}
	}
</style>
