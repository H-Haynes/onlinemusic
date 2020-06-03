<template>
	<div class="home">
		<div class="header-bar">
			<ul class="nav">
				<router-link 
					tag="li"
					v-for="nav in navlist" 
					:key="nav.id"
					:to="nav.link">
					{{nav.name}}
				</router-link>
				
			</ul>
		</div>
		<div class="home-content-wrapper">
			<router-view></router-view>
		</div>
	</div>
</template>
<style scoped lang="less">
.router-link-exact-active{
	color:#c82525 !important
}
.home {
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
	.home-content-wrapper{
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

.checked{
	font-weight:bolder;
	color:rgb(213,213,213);
}




</style>
<script>
	export default {
		
		data(){
			return {
				href:location.href,
				currentNavId:1,
				navlist:[
					{
						name:"个性推荐",
						id:1,
						link:"/find/recommend",
						symbol:'recommend'
					},
					{
						name:"歌单",
						id:2,
						link:"/find/playlist",

					},
					{
						name:"主播电台",
						id:3,
						link:"/find/anchor",

					},
					{
						name:"排行榜",
						id:4,
						link:"/find/rank",

					},
					{
						name:"歌手",
						id:5,
						link:"/find/artists",
						
					},
					{
						name:"最新音乐",
						id:6,
						link:"/find/new"
					}
				],
			}
		}
}
</script>
