import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import 'leaflet/dist/leaflet.css';

Vue.config.productionTip = false

Vue.prototype.$http = axios
Vue.prototype.apiURL = 'https://jsonplaceholder.typicode.com/users'

// Fixing Marker Error
// https://github.com/vue-leaflet/Vue2Leaflet/issues/103
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({  
	iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),  
	iconUrl: require('leaflet/dist/images/marker-icon.png'),  
	shadowUrl: require('leaflet/dist/images/marker-shadow.png')  
})

new Vue({
	vuetify,
	render: function (h) { return h(App) }
}).$mount('#app')