import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './Home.vue'
import Users from './Users.vue'
import Signin from './Signin.vue'
import Profile from './Profile.vue'
import User from './User.vue'
import Register from './Register.vue'
import Forum from './Forum.vue'

import auth from '../auth.js'

Vue.use( VueRouter )

const router = new VueRouter( {
	routes: [
		{ path: '/', component: Home },
		{ path: '/users', component: Users },
		{ path: '/forum', component: Forum },
		{ path: '/signin', component: Signin },
		{ path: '/profile', component: Profile, meta: { requireAuth: true } },
		{ path: '/signout', beforeEnter: function ( to, from, next ) {
			auth.deauthenticate()
			next( '/signin' )
		} },
		{ path: '/user/:id', component: User },
		{ path: '/register', component: Register }
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
