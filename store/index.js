import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

let lifeData = {};

try {
	// 尝试获取本地是否存在lifeData变量，第一次启动APP时是不存在的
	lifeData = uni.getStorageSync('lifeData');
} catch (e) {

}

// 需要永久存储，且下次APP启动需要取出的，在state中的变量名
let saveStateKeys = ['vuex_user', 'vuex_token', 'vuex_product_index', 'vuex_default_page',
'vuex_default_product_index'];


// 保存变量到本地存储中
const saveLifeData = function(key, value) {
	// 判断变量名是否在需要存储的数组中
	if (saveStateKeys.indexOf(key) != -1) {
		// 获取本地存储的lifeData对象，将变量添加到对象中
		let tmp = uni.getStorageSync('lifeData');
		// 第一次打开APP，不存在lifeData变量，故放一个{}空对象
		tmp = tmp ? tmp : {};
		tmp[key] = value;
		// 执行这一步后，所有需要存储的变量，都挂载在本地的lifeData对象中
		uni.setStorageSync('lifeData', tmp);
	}
}
const store = new Vuex.Store({
	// 下面这些值仅为示例，使用过程中请删除
	state: {
		// 如果上面从本地获取的lifeData对象下有对应的属性，就赋值给state中对应的变量
		// 加上vuex_前缀，是防止变量名冲突，也让人一目了然
		vuex_user: lifeData.vuex_user ? lifeData.vuex_user : {
			name: '明月'
		},
		vuex_token: lifeData.vuex_token ? lifeData.vuex_token : '',
		vuex_product_index: lifeData.vuex_product_index ? lifeData.vuex_product_index : 0,
		vuex_product_list: [{
			name: '在线监测仪',
			fullname: '在线温湿度监测仪',
			type: 'zx',
			thumb: 'https://img.anlengyun.com/zxjcy.png'
		}, {
			name: '蓝牙记录仪',
			fullname: '蓝牙记录仪',
			type: 'ly',
			thumb: 'https://img.anlengyun.com/lyjcy.png'
		}, {
			name: '医疗保温箱',
			fullname: '医疗保温箱',
			type: 'ylbwx',
			thumb: 'https://img.anlengyun.com/ylbwx.png'
		}, {
			name: '智慧冷库',
			fullname: '智慧冷库',
			type: 'zhlk',
			thumb: 'https://img.anlengyun.com/zhlk.png'
		}, {
			name: '智能保温箱',
			fullname: '智能保温箱',
			type: 'znbwx',
			thumb: 'https://img.anlengyun.com/znbwx.png'
		}, {
			name: '冷链车',
			fullname: '冷链车',
			type: 'llc',
			thumb: 'https://img.anlengyun.com/llc.png'
		}, {
			name: '冷藏集装箱',
			fullname: '冷藏集装箱',
			type: 'lcjzx',
			thumb: 'https://img.anlengyun.com/lcjzx.png'
		}, ],
		vuex_version: '1.0.1',
		vuex_default_page: lifeData.vuex_default_page ? lifeData.vuex_default_page : "/pages/index/index",
		vuex_default_product_index: lifeData.vuex_default_product_index ? lifeData.vuex_default_product_index :
			0,
	},
	mutations: {
		$uStore(state, payload) {
			// 判断是否多层级调用，state中为对象存在的情况，诸如user.info.score = 1
			let nameArr = payload.name.split('.');
			let saveKey = '';
			let len = nameArr.length;
			if (nameArr.length >= 2) {
				let obj = state[nameArr[0]];
				for (let i = 1; i < len - 1; i++) {
					obj = obj[nameArr[i]];
				}
				obj[nameArr[len - 1]] = payload.value;
				saveKey = nameArr[0];
			} else {
				// 单层级变量，在state就是一个普通变量的情况
				state[payload.name] = payload.value;
				saveKey = payload.name;
			}
			// 保存变量到本地，见顶部函数定义
			saveLifeData(saveKey, state[saveKey])
		}
	}
})

export default store
