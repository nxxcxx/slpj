import axios from 'axios'
import q from 'q'
import store from './store.js'

axios.interceptors.request.use( function ( config ) {
	if ( config.requireAuth ) {
		let token = localStorage.getItem( 'JWT' )
		if ( token ) config.headers.Authorization = `Bearer ${token}`
	}
	return config
}, function ( err ) {
	console.log( err )
	return Promise.reject( err )
} )

function authenticate( force ) {
	let def = q.defer()
	if ( force )
		store.dispatch( 'resetUser' )
	if ( store.state.user ) {
		def.resolve( true )
	} else {
		axios.get( 'http://localhost:8001/auth', { requireAuth: true } )
		.then( res => {
			store.commit( 'setUser', { user: res.data.userId } )
			def.resolve( true )
		} )
		.catch( err => {
			deauthenticate()
			def.reject( err )
		} )
	}
	return def.promise
	// return def.promise.delay( 1000 )
}

function deauthenticate() {
	resetToken()
	store.dispatch( 'resetUser' )
}

function signin( userCredentials ) {
	const deferred = q.defer()
	axios.post( 'http://localhost:8001/signin', userCredentials )
	.then( res => {
		setToken( res.data.token )
		store.commit( 'setUser', { user: res.data.user._id } )
		deferred.resolve( true )
	} )
	.catch( err => {
		console.error( err.response )
		deauthenticate()
		deferred.reject( err )
	} )
	return deferred.promise
}

function isAuthenticated() {
	return store.state.user !== null
}

function resetToken() {
	localStorage.removeItem( 'JWT' )
}

function setToken( token ) {
	localStorage.setItem( 'JWT', token )
}

function getToken() {
	return localStorage.getItem( 'JWT' )
}

export default {
	authenticate,
	deauthenticate,
	signin,
	isAuthenticated
}
