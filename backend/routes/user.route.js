'use strict';

var chalk = require( 'chalk' );
var router = require( 'express' ).Router();
var User = require( '../models/user.js' );

router.route( '/users' )
	.get( function ( req, res ) {
		User.find( {}, function ( err, users ) {
			if ( err ) return res.status( 500 ).send( err );
			res.status( 200 ).send( users );
		} );
	} )

module.exports = router;
