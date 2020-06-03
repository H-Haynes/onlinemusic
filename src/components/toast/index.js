import Vue from 'vue'
import Toast from './toast'
var singleToast = true;
var queue = [];

function createInstance() {
	// 返回一个扩展实例构造器
	if (queue.length==0 || !singleToast) {
		const ToastConstructor = Vue.extend(Toast);
		// 构造一个实例
		const toastDom = new ToastConstructor({
			el: document.createElement('div'),
		});
		// 把实例化的 toast.vue 添加到 body 里
		document.body.appendChild(toastDom.$el);
		queue.push(toastDom);
		singleToast = true;
		return toastDom;
	}else{
		return queue[0];	//单例模式
	}
}

// 注册为全局组件的函数
function toast(options = {}) {

	const toastDom = queue.length==0?createInstance() : queue[0];	//单例模式
	toastDom.message = typeof options === 'string' ? options : options.message;
	toastDom.type = options.type || 'success';
	toastDom.duration = options.duration || 3000;
	toastDom.position = options.position || 'middle';
	if (!toastDom.message) {
		toastDom.showToast = singleToast = false;
	} else {
		toastDom.showToast = true;
		setTimeout(() => {
			toastDom.showToast = singleToast = false
		}, toastDom.duration);
	}
}
// 将组件注册到 vue 的 原型链里去,
// 这样就可以在所有 vue 的实例里面使用 this.$toast()
// Vue.prototype.$toast = showToast
Vue.prototype.$toast = toast;
