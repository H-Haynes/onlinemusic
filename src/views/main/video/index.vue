<template>
	<div class="video-nav">
		<div class="header-bar">
			<ul class="nav">
				<router-link 
					tag="li"
					v-for="nav in navlist" 
					:key="nav.link"
					:to="nav.link">
					{{nav.name}}
				</router-link>
				
			</ul>
		</div>
		<div class="video-content-wrapper">
			<router-view></router-view>
		</div>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				navlist:[
					{
						name:"视频",
						id:1,
						link:"/videolist/video",
						symbol:'recommend'
					},
					{
						name:"MV",
						id:1,
						link:"/videolist/mv",
						symbol:'recommend'
					},
				]
			}
		}
	}
</script>

<style lang="less" scoped>
	.router-link-exact-active{
		color:#c82525 !important
	}
	.video-nav {
		height: 100%;
		width: 100%;	
		display:flex;
		flex-direction: column;
		.header-bar {
			display: flex;
			background:rgb(32,32,32);
			height:70px;
			align-items: center;
			padding-left:30px;
			.nav{
				display:flex;
				color:rgb(150,150,150);
				font-size:14px;
				li{
					margin-right:25px;
					cursor:pointer;
				}
			}
		}
		.video-content-wrapper{
			flex:1;
			overflow-y: scroll;
			// &::-webkit-scrollbar{
			// 	width: 10px;
			// 	background-color: #fff;
			// 	border-radius: 5px;
			// 	z-index:999;
			// }
			// &::-webkit-scrollbar-thumb{
			// 	border-radius: 5px;
			// 	-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
			// 	background-color: #fff;
			// }
			// &::-webkit-scrollbar-track { /* 定义滚动条轨道  内阴影+圆角*/
			// 	-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.9);
			// 	border-radius: 5px;
			// 	background-color: rgb(32,32,32);
			// }
			
		}
	}
	
</style>
