'use strict'

const chalk = require( 'chalk' )
const router = require( 'express' ).Router()
const Image = require( '../models/image.js' )
const jwtUtil = require( '../jwtUtil.js' )
const multer = require( 'multer' )
const del = require( 'del' )

let upload = multer( {
	dest: './uploads/',
} )

router.route( '/upload/image' )
	.post( upload.single( 'img' ),
	function ( req, res, next ) {
		jwtUtil.verify( req, res, function ( err, payload ) {
			req.userId = payload.userId
			next()
		} )
	},
	function ( req, res ) {
		let imgIdx = req.query.idx
		let imgMeta = {
			userId: req.userId,
			path: req.file.path,
			originalName: req.file.originalName
		}
		Image.findOneAndUpdate( { userId: req.userId, idx: req.query.idx },
			{ $set: { path: imgMeta.path, originalName: imgMeta.originalName } },
			{ upsert: true },
			function ( err, oldImg ) {
				if ( err ) return res.status( 500 ).send( err )
				if ( oldImg ) del( oldImg.path ) // delete old img in the uploads folder
				return res.status( 200 ).send( oldImg )
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
