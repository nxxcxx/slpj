'use strict'

const chalk = require( 'chalk' )
const router = require( 'express' ).Router()
const User = require( '../models/user.js' )
const jwtUtil = require( '../jwtUtil.js' )

router.route( '/users' )
	.get( function ( req, res ) {
		User.find( {}, function ( err, users ) {
			if ( err ) return res.status( 500 ).send( err )
			res.status( 200 ).send( users );
		} );
	} )

router.route( '/private' )
	.get( function ( req, res ) {
		jwtUtil.verify( req, res, function ( err, payload ) {
			if ( err ) return res.status( 401 ).send( err )
			User.findOne( { _id: payload.userId }, function ( err, user ) {
				if ( err ) return res.status( 500 ).send( err )
				if ( user ) return res.status( 200 ).send( user )
				res.status( 200 ).send()
			} )
		} )
	} )

router.route( '/user/:id' )
	.get( function ( req, res ) {
		User.findOne( { _id: req.params.id }, function ( err, user ) {
			if ( err ) return res.status( 500 ).send( err )
			if ( user ) return res.status( 200 ).send( user )
			res.status( 200 ).send()
		} )
	} )

module.exports = router
