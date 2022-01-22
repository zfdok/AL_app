import App from './App'
import Vue from 'vue'

import uView from '@/uni_modules/uview-ui'
Vue.use(uView)

let vuexStore = require("@/store/$u.mixin.js");
Vue.mixin(vuexStore);
import store from '@/store';



Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	store,
    ...App
})
require('@/config/request.js')(app)
import httpApi from '@/config/api.js'
Vue.use(httpApi,app)

import utils from '@/config/utils.js'
Vue.use(utils,app)

app.$mount()
