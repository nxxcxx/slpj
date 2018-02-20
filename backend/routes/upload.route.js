'use strict'

const chalk = require( 'chalk' )
const router = require( 'express' ).Router()
const Image = require( '../models/image.js' )
const jwtUtil = require( '../jwtUtil.js' )
const multer = require( 'multer' )

let upload = multer( {
	dest: './uploads/',
} )

router.route( '/upload/photo' )
	.post( upload.single( 'photo' ),
	function ( req, res, next ) {
		jwtUtil.verify( req, res, function ( err, payload ) {
			req.userId = payload.userId
			next()
		} )
	},
	function ( req, res ) {
		let imgMeta = {
			userId: req.userId,
			path: req.file.path,
			originalName: req.file.originalName
		}
		Image.create( imgMeta, function ( err ) {
			if ( err ) return res.status( 500 ).send( err )
			return res.status( 200 ).send( req.file )
		} )
	} )

router.route( '/image/:id' )
	.get( function ( req, res ) {
		Image.findById( req.params.id, function ( err, img ) {
			if ( err ) return res.status( 500 ).send( err )
			return res.status( 200 ).send( img )
		} )
	} )

router.route( '/user/:id/images' )
	.get( function ( req, res ) {
		Image.find( { userId: req.params.id }, function ( err, imgs ) {
			if ( err ) return res.status( 500 ).send( err )
			return res.status( 200 ).send( imgs )
		} )
	} )

module.exports = router
