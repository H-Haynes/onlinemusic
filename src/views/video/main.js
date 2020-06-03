import Vue from 'vue'
import App from './App.vue'

import 'view-design/dist/styles/iview.css'
import "@/components/toast/index.js"
import "@/assets/css/common.css"
import VueLazyLoad from "vue-lazyload"
Vue.config.productionTip = false
Vue.prototype.bus = new Vue()
Vue.use(VueLazyLoad)
Vue.filter('fixedNum',function(val){
		if(val<10000){
			return val.toString();
		}else if(val<1000000){
			return (val/10000).toFixed(1)+'万'
		}else if(val<100000000){
			return Math.ceil(val/10000) + '万'
		}else{
			return (val/100000000).toFixed(1)+'亿'
		}
	}
)
Vue.filter('toDateStrZH',function(val){
		if(!val){
			return '-'
		}
		let time = new Date(val);
		let year = time.getFullYear();
		let month = time.getMonth()+1;
		let day = time.getDate();
		return year + '年' + month+ '月' +day +'日';
	}
)
Vue.filter('toTimeStrZH',function(val){
	if(!val){
			return '-'
	}
	let time = new Date(val);
	let year = time.getFullYear();
	let month = time.getMonth()+1;
	let day = time.getDate();
	let hour = time.getHours();
	let minute = time.getMinutes();
	let second = time.getSeconds();
	function addZero(num){
		return num > 9 ? num :'0' + num
	}
		return year + '年' + month+ '月' +day +'日 '+addZero(hour)+":"+addZero(minute)+":"+addZero(second);
	}
)
Vue.filter('toTimeStr',function(val){
	if(!val){
			return '-'
	}
	let time = new Date(val);
	let year = time.getFullYear();
	let month = time.getMonth()+1;
	let day = time.getDate();
	let hour = time.getHours();
	let minute = time.getMinutes();
	let second = time.getSeconds();
	function addZero(num){
		return num > 9 ? num :'0' + num
	}
	return year + '-' + addZero(month)+ '-' +addZero(day) +' '+addZero(hour)+":"+addZero(minute)+":"+addZero(second);
})
 


new Vue({
  render: h => h(App)
}).$mount('#app')
