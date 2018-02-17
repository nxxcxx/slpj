'use strict'

const passport = require( 'passport' )
const router = require( 'express' ).Router()
const jwtUtil = require( '../jwtUtil.js' )

router
	.post( '/signup', function ( req, res ) {
		authenticate( 'signup-strategy', req, res )
	} )
	.post( '/signin', function ( req, res ) {
		authenticate( 'signin-strategy', req, res )
	} )
	.get( '/auth', function ( req, res ) {
		jwtUtil.verify( req, res, function ( err, payload ) {
			if ( err ) return res.status( 401 ).send( err )
			res.status( 200 ).send( payload )
		} )
	} )

function authenticate( strategy, req, res ) {
	passport.authenticate( strategy, {
		session: false
	}, function ( err, user, info ) {
		if ( err )
			return res.status( 500 ).send( err )
		if ( !user )
			return res.status( 400 ).send( info.message )
		let token = generateToken( user )
		return res.status( 200 ).send( token )
	} )( req, res )

}

function generateToken( user ) {
	let payload = { userId: user.id }
	let token = jwtUtil.sign( payload )
	return {
		user: user.toJSON(),
		token: token
	}
}

module.exports = router
