'use strict'

const jwt = require( 'jsonwebtoken' )
const PRIVATE_KEY = require( 'fs' ).readFileSync( __dirname + '/private.key' )

function sign( payload ) {
	return jwt.sign( payload, PRIVATE_KEY, {
		expiresIn: 31536000
	} )
}

function verify( req, res, next ) {
	if ( !req.headers.authorization )
		return res.status( 401 ).send( 'not signed in.' )
	var authHeader = req.headers.authorization.split( ' ' )
	var scheme = authHeader[ 0 ]
	var token = authHeader[ 1 ]
	if ( !token || scheme !== 'Bearer' )
		return res.status( 401 ).send( 'invalid token.' )
	jwt.verify( token, PRIVATE_KEY, function ( err, payload ) {
		next( err, payload )
	} )
}

module.exports = {
	sign,
	verify
}
