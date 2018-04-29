'use strict'

const chalk = require( 'chalk' )
const router = require( 'express' ).Router()
const jwtUtil = require( '../jwtUtil.js' )
const User = require( '../models/user.js' )
const Image = require( '../models/image.js' )

router.route( '/users' )
	.get( function queryUsers( req, res, next ) {
		console.log( req.query )
		User.find( {}, null, {
			skip: parseInt( req.query.skip ) || 0,
			limit: parseInt( req.query.limit )
		}, function ( err, users ) {
			if ( err ) return res.status( 500 ).send( err )
			User.populate( users, [ { path: 'images' } ], function ( err, users ) {
				if ( err ) return res.status( 500 ).send( err )
				req._users = users
				next()
			} )
		} )
	}, function queryTotalUsers( req, res ) {
		User.count( {}, function ( err, count ) {
			if ( err ) return res.status( 500 ).send( err )
			return res.status( 200 ).send( {
				total: count,
				users: req._users
			} )
		} )
	} )

router.route( '/users/total' )
	.get( function ( req, res ) {
		User.count( {}, function ( err, count ) {
			if ( err ) return res.status( 500 ).send( err )
			return res.status( 200 ).send( { total: count } )
		} )
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
						}, select: 'email images'
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
