import Vue from 'vue'
import AppParrilla from './AppParrilla.vue'

Vue.config.productionTip = false
//Vue.config.performance = true

new Vue({
  render: h => h(AppParrilla),
}).$mount('#app-parrilla')
