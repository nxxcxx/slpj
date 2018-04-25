import Vue from 'vue'
import Vuex from 'vuex'
Vue.use( Vuex )

export default new Vuex.Store( {
	state: {
		user: null,
		users: [],
		totalUsers: Infinity,
		currentPage: 1
	},
	mutations: {
		setUser( state, payload ) {
			state.user = payload.user
		},
		resetUser( state ) {
			state.user = null
		},
		appendUsers( state, payload ) {
			state.users = [ ...state.users, ...payload.users  ]
		},
		incrementPage( state ) {
			state.currentPage += 1
		},
		setTotalUsers( state, payload ) {
			state.totalUsers = payload.totalUsers
		}
	},
	actions: {
		resetUser( store ) {
			if ( store.state.user !== null )
				store.commit( 'resetUser' )
		}
	}
} )
