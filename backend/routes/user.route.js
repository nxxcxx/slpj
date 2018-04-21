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

router.route( '/profile' )
	.get( function ( req, res ) {
		jwtUtil.verify( req, res, function ( err, payload ) {
			if ( err ) return res.status( 401 ).send( err )
			User.findOne( { _id: payload.userId }, function ( err, user ) {
				if ( err ) return res.status( 500 ).send( err )
				if ( user ) return res.status( 200 ).send( user )
			} )
		} )
	} )

router.route( '/user/:id' )
	.get( function ( req, res ) {
		User.findById( req.params.id, function ( err, user ) {
			if ( err ) return res.status( 500 ).send( err )
			User.populate( user, [
				{ path: 'comments',populate: {
						path: 'byUserId', model: 'user', populate: {
							path: 'images', model: 'image'
						}
					}
				},
				{ path: 'images' } ],
				function ( err, user ) {
				if ( err ) return res.status( 500 ).send( err )
				if ( user ) return res.status( 200 ).send( user )
			} )
		} )
	} )

module.exports = router
