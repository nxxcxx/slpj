import axios from 'axios'
import q from 'q'

function authenticate() {
	const deferred = q.defer()
	const jwt = window.localStorage.getItem( 'JWT' )
	axios.get( 'http://localhost:8001/auth', {
		headers: { 'Authorization': `Bearer ${jwt}` }
	} )
	.then( res => {
		console.log( res )
		deferred.resolve( true )
	} )
	.catch( err => {
		console.log( err )
		deferred.reject( err )
	} )
	return deferred.promise
}

export default {
	authenticate
}
