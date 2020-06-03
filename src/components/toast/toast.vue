<template>
	<div v-show="showToast" class="toast" :class="position">
		<div class="toast_container" v-if="type == 'success'">
			<div><i class="iconfont icon-check icon"></i></div>
			<div class="msg_container">{{ message }}</div>
		</div>
		<div class="toast_container" v-else-if="type == 'wrong'">
			<div><i class="iconfont icon-warning-circle icon"></i></div>
			<div class="msg_container">{{ message }}</div>
		</div>
		<div class="toast_container" v-else-if="type == 'loading'">
			<div></div>
			<div class="msg_container">{{ message }}</div>
		</div>
	</div>
</template>
<script>
	/* eslint-disabled*/
export default {
	props: {
		message: String,
		type: {
			validator: function(value) {
				// 值必须是这些字符串中的一个
				return ['success', 'wrong', 'loading'].indexOf(value) !== -1
			},
			default: 'success'
		},
		duration: {
			type: Number,
			default: 3000
		},
		position: {
			type: String,
			default: 'middle'
		}
	},
	components: {},
	data() {
		return {
			showToast: false
		}
	}
}
</script>

<style scoped>
.toast {
	width: 400px;
	font-size:12px;
	z-index: 9999999;
}
.toast_container {
	background: rgba(0, 0, 0, 0.7);
	border-radius: 8px;
	color: #fff;
	margin-left: 88px;
	margin-right: 88px;
	text-align: center;
	padding-top: 15px;
	padding-bottom: 15px;
}
.top {
	position: absolute;
	top: 10%;
}
.middle {
	position: absolute;
	top: 50%;
	left:50%;
	transform: translate(-50%,-50%);
}
.bottom {
	position: absolute;
	top: 70%;
}
.msg_container {
	margin-top: 8px;
	margin-left: 15px;
	margin-right: 15px;
	line-height: 22px;
	font-size: 12px;
	word-wrap: break-word;
}
.icon {
	font-size: 30px;
}
</style>
