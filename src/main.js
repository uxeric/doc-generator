import Vue from 'vue'
import App from './App.vue'
import store from './store'
import vuetify from './plugins/vuetify'
const { dialog } = require('electron').remote

Vue.config.productionTip = false

new Vue({
  dialog,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
