import Vue from 'vue';
import App from './App.vue';
import store from './store';  // Importamos el store que acabamos de crear

Vue.config.productionTip = false;

new Vue({
  store,  // Registramos el store para que esté disponible en toda la app
  render: h => h(App),
}).$mount('#app');

