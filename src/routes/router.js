import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './Home.vue'
import Users from './Users.vue'
import Signin from './Signin.vue'
import Private from './Private.vue'

import auth from '../auth.js'

Vue.use( VueRouter )

const router = new VueRouter( {
	routes: [
		{ path: '/', component: Home },
		{ path: '/users', component: Users },
		{ path: '/signin', component: Signin },
		{ path: '/private', component: Private, meta: { requireAuth: true } },
		{ path: '/signout', beforeEnter: function ( to, from, next ) {
			auth.deauthenticate()
			next( '/signin' )
		} }
	]
} )

router.beforeEach( ( to, from, next ) => {
	if ( to.meta.requireAuth ) {
		auth.authenticate()
			.then( () => next() )
			.catch( () => {
				auth.deauthenticate()
				next( '/signin' )
			} )
	} else {
		next()
	}
} )

export default router
