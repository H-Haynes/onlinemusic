<template>
	<div class="video-content-wrap">
		<div class="video-content">
			<div class="left">
				<p class="page-title">
					<i class="icon icon-back"></i>
					视频详情
				</p>
				
				<div class="player">
					<video ref="video" @click="playVideo" src="https://mydata-1258971635.cos.ap-beijing.myqcloud.com/%E5%8B%87%E6%95%A2%E8%80%85%E7%9A%84%E5%91%8A%E5%88%AB-%E6%9C%9D%E8%8A%B1%E5%A4%95%E8%AA%93%E6%8E%A8%E5%B9%BF%E6%9B%B2.mp4" poster="https://mydata-1258971635.cos.ap-beijing.myqcloud.com/wind.gif"></video>
					<span class="play" v-show="isPaused" @click="playVideo"><i class="icon icon-play"></i></span>
				</div>
			</div>
			<div class="right">
				<p class="title">相关推荐</p>
				<ul>
					<li v-for="item in relativeList"  :key="item.id">
						<div class="poster" :style="{backgroundImage:'url('+item.coverUrl+')'}"></div>
						<div class="info">
							<p class="name">{{item.title}}</p>
							<span class="author">by <a>{{item.creator[0].userName}}</a></span>
						</div>
					</li>
				</ul>
			</div>			
		</div>
	</div>
	
</template>

<script>
</script>

<style scoped lang="less">
	*{
		color:rgb(172,172,172)
	}
	.video-content-wrap{
		height:640px;
		width:100%;
		// border:1px solid red;
		box-sizing: border-box;
		padding:10px 20px;
		overflow-y: scroll;
		.video-content{
			display:flex;
			width:100%;
			height:4000px;
			.left{
				flex:1;
				margin-right:30px;
				// border:1px solid green;
				.page-title{
					text-align:left;
					height:30px;
					line-height:30px;
					color:rgb(202,202,202);
					font-weight: bolder;
					i{
						&::before{
							font-size:14px;
							font-weight: normal;
						}
					}
				}
				.player{
					margin-top:10px;
					height:320px;
					width:100%;
					// border:1px solid red;
					border-radius:10px;
					overflow: hidden;
					position: relative;
					cursor: pointer;
					video{
						width:100%;
						height:100%;
						object-fit: fill;
					}
					.play{
						width:60px;
						height:60px;
						background:rgba(240,240,240,.5);
						border-radius:50%;
						position: absolute;
						left:50%;
						top:50%;
						display:flex;
						justify-content: center;
						align-items: center;
						transform: translate(-50%,-50%);
						i{
							color:#e40;
							font-size:20px;
						}
					}
				}
			}
			.right{
				width:320px;
				.title{
					height:30px;
					line-height:30px;
					color:rgb(202,202,202);
					font-weight: bolder;
				}
				ul{
					li{
						display:flex;
						margin:20px 0;
						.poster{
							flex-shrink: 0;
							width:160px;
							height:100px;
							border-radius:5px;
							background-size:100% 100%;
							margin-right:10px;
						}
						.info{
							text-align: left;
							font-size:13px;
							display: flex;
							flex-direction: column;
							justify-content: space-around;
							font-weight: 800;
							*{
								cursor: pointer;
							}
							.name{
								color:rgb(202,202,202);
							}
							.author{
								color:rgb(120,120,120);
								a{
									color:rgb(120,120,120);
									&:hover{
										color:rgb(200,200,200);
									}
								}
								
							}
						}
					}
				}
			}
		}
		
	}
</style>
