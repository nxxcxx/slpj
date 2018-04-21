'use strict'

const chalk = require( 'chalk' )
const router = require( 'express' ).Router()
const jwtUtil = require( '../jwtUtil.js' )
const User = require( '../models/user.js' )
const Image = require( '../models/image.js' )

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

router.route( '/user/:id/images' )
	.get( function ( req, res ) {
		Image.find( { userId: req.params.id }, null, { sort: { idx: 1 } },
			function ( err, imgs ) {
				if ( err ) return res.status( 500 ).send( err )
				return res.status( 200 ).send( imgs )
		} )
	} )

router.route( '/user/:id/comments' )
	.get( function ( req, res ) {
		User.findById( req.params.id, function ( err, user ) {
			if ( err ) return res.status( 500 ).send( err )
			User.populate( user, [ { path: 'comments', movel: 'comment' } ], function ( err, populatedUser ) {
				if ( err ) return res.status( 500 ).send( err )
				return res.status( 200 ).send( populatedUser )
			} )
		} )
	} )

module.exports = router
