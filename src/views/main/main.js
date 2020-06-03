import Vue from 'vue'
import App from './App.vue'

import router from "@/router/index"
import store from "@/store/index"
import "@/components/toast/index.js"
import 'view-design/dist/styles/iview.css'
import "@/assets/css/common.css"
import VueLazyLoad from "vue-lazyload"
import {Input,Loading,Table,TableColumn,  MessageBox} from "element-ui"

Vue.config.productionTip = false
Vue.prototype.bus = new Vue()
Vue.use(VueLazyLoad)
Vue.use(Table);
Vue.use(TableColumn);
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.use(Loading);
Vue.use(Input)
Vue.filter('fixedNum',function(val){
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
)
Vue.filter("duration",function(val){
	
		let min = Math.floor(val/60000);
		let sec = Math.round(val/60000%1000);
		function addZero(val){
			return val >9 ? val : '0'+val
		}
		return addZero(min)+":"+addZero(parseInt(sec))

})
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
	router,
	store,
  render: h => h(App)
}).$mount('#app')
