'use strict'

var chalk = require( 'chalk' )
var router = require( 'express' ).Router()
var User = require( '../models/user.js' )

var jwt = require( 'jsonwebtoken' );
var PRIVATE_KEY = require( 'fs' ).readFileSync( __dirname + '/../private.key' );

router.route( '/users' )
	.get( function ( req, res ) {
		User.find( {}, function ( err, users ) {
			if ( err ) return res.status( 500 ).send( err )
			res.status( 200 ).send( users );
		} );
	} )

router.route( '/profile' )
	.get( function ( req, res ) {
		// to do refactor dupes code here
		if ( !req.headers.authorization )
			return res.status( 401 ).send( 'not signed in.' )

		var authHeader = req.headers.authorization.split( ' ' )
		var scheme = authHeader[ 0 ]
		var token = authHeader[ 1 ]

		if ( !token || scheme !== 'Bearer' )
			return res.status( 401 ).send( 'invalid token.' )

		jwt.verify( token, PRIVATE_KEY, function ( err, payload ) {

			if ( err ) return res.status( 401 ).send( err )

			User.findOne( { _id: payload.userId }, function ( err, user ) {

				if ( err ) return res.status( 500 ).send( err )
				if ( user ) return res.status( 200 ).send( user )
				res.status( 200 ).send()

			} );

		} );
	} )

router.route
module.exports = router;
