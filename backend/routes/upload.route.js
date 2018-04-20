'use strict'

const chalk = require( 'chalk' )
const router = require( 'express' ).Router()
const Image = require( '../models/image.js' )
const User = require( '../models/user.js' )
const jwtUtil = require( '../jwtUtil.js' )
const multer = require( 'multer' )
const del = require( 'del' )
const util = require( 'util' )
const path = require( 'path' )
const crypto = require( 'crypto' )
const mime = require( 'mime' )
const Comment = require( '../models/comment.js' )

const storage = multer.diskStorage( {
	destination: function ( req, res, cb ) {
		cb( null, './uploads' )
	},
	filename: function ( req, file, cb ) {
		crypto.pseudoRandomBytes( 16, function ( err, raw ) {
			cb( null, raw.toString( 'hex' ) + Date.now() + '.' + mime.extension( file.mimetype ) )
		} )
	}
} )

const upload = multer( {
	storage,
	fileFilter: function ( req, file, cb ) {
		let filetypes = /jpeg|jpg/
		let mimetype = filetypes.test( file.mimetype )
		let extname = filetypes.test( path.extname( file.originalname ).toLowerCase() )
		if ( mimetype && extname )
			return cb( null, true )
		cb( 'Error: File upload only supports the following filetypes - ' + filetypes )
	},

} )

function verifyIdentity( req, res, next ) {
	jwtUtil.verify( req, res, function ( err, payload ) {
		req.userId = payload.userId
		next()
	} )
}

router.route( '/user/:id/comments' )
	.get( function ( req, res ) {
		User.findById( req.params.id, function ( err, user ) {
			if ( err ) return res.status( 500 ).send( err )
			User.populate( user, [ { path: 'comments' } ], function ( err, populatedUser ) {
				if ( err ) return res.status( 500 ).send( err )
				return res.status( 200 ).send( populatedUser )
			} )
		} )
	} )

router.route( '/upload/comment' )
	.post( verifyIdentity, function createComment( req, res ) {
		Comment.create( { byUserId: req.userId, text: req.body.text }, function ( err, comment ) {
			if ( err ) return res.status( 500 ).send( err )
			User.findOneAndUpdate( { _id: req.body.toUserId }, { $push: { 'comments': comment._id } },
				function ( err, user ) {
					if ( err ) return res.status( 500 ).send( err )
					return res.status( 200 ).send( comment )
			} )
		} )
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
				if ( oldImg ) del( oldImg.path )
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
		Image.find( { userId: req.params.id }, null, { sort: { idx: 1 } },
			function ( err, imgs ) {
				if ( err ) return res.status( 500 ).send( err )
				return res.status( 200 ).send( imgs )
		} )
	} )

router.route( '/save' )
	.post( verifyIdentity, upload.array( 'img' ), function handleUploads( req, res, next ) {
		let uploadSlot = JSON.parse( req.body.uploadSlot )
		for ( let [ idx, imgName ] of uploadSlot.entries() ) {
			let file = req.files.find( file => file.originalname === imgName )
			if ( !file ) continue
			Image.findOneAndUpdate( { userId: req.userId, idx },
				{ $set: { path: file.path, originalName: file.originalname } }, { upsert: true },
				function ( err, oldImg ) {
					if ( err ) return res.status( 500 ).send( err )
					if ( oldImg ) del( oldImg.path )
				} )
		}
		next()
	}, function handleDeletes( req, res, next ) {
		let delIdx = JSON.parse( req.body.deletes )
		for ( let [ idx, remove ] of delIdx.entries() ) {
			if ( remove ) {
				Image.findOneAndRemove( { userId: req.userId, idx }, function ( err, img ) {
					if ( err ) return res.status( 500 ).send( err )
					if ( img ) del( img.path )
				} )
			}
		}
		next()
	}, function handleInfo( req, res, next ) {
		console.log( req.body.line )
		User.findOneAndUpdate( { _id: req.userId }, { $set: { line: req.body.line } },
			function ( err, user ) {
				if ( err ) return res.status( 500 ).send( err )
				return res.status( 200 ).send()
		} )
	} )

module.exports = router
