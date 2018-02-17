import axios from 'axios'
import q from 'q'

axios.interceptors.request.use( function ( config ) {
	if ( config.requireAuth ) {
		let token = localStorage.getItem( 'JWT' )
		if ( token )
			config.headers.Authorization = `Bearer ${token}`
	}
	return config
}, function ( err ) {
	console.log( err )
	return Promise.reject( err )
} )

function authenticate() {
	const deferred = q.defer()
	axios.get( 'http://localhost:8001/auth', { requireAuth: true } )
	.then( res => {
		deferred.resolve( true )
	} )
	.catch( err => {
		console.log( err )
		deferred.reject( err )
	} )
	return deferred.promise
}

function deauthenticate() {
	localStorage.removeItem( 'JWT' )
}

function signin( userCredentials ) {
	const deferred = q.defer()
	axios.post( 'http://localhost:8001/signin', userCredentials )
	.then( res => {
		setToken( res.data.token )
		deferred.resolve( true )
	} )
	.catch( err => {
		console.log( err )
		deauthenticate()
		deferred.reject( err )
	} )
	return deferred.promise
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
	signin
}
