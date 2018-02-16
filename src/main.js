import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import App from './App.vue'

Vue.use( Vuex )
Vue.use( VueRouter )

import Home from './Home.vue'
import Users from './Users.vue'
import Signin from './Signin.vue'
import Private from './Private.vue'

import auth from './auth.js'

const router = new VueRouter( {
	routes: [
		{ path: '/', component: Home },
		{ path: '/users', component: Users },
		{ path: '/signin', component: Signin },
		{ path: '/private', component: Private, beforeEnter: requireAuth },
		{ path: '/signout', beforeEnter: function ( to, from, next ) {
			auth.deauthenticate()
			next( '/signin' )
		} }
	]
} )

function requireAuth( to, from, next ) {
	auth.authenticate()
		.then( () => next() )
		.catch( () => {
			auth.deauthenticate()
			next( '/signin' )
		} )
}

new Vue( {
	router,
	el: '#app',
	render: h => h( App )
} )
