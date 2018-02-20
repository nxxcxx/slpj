import Vue from 'vue'
import store from './store.js'
import router from './routes/router.js'
import App from './App.vue'

new Vue( {
	store,
	router,
	el: '#app',
	render: h => h( App )
} )
