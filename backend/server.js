'use strict'

const express = require( 'express' )
const mongoose = require( 'mongoose' )
const bodyParser = require( 'body-parser' )
const cors = require( 'cors' )
const moment = require( 'moment' )
const chalk = require( 'chalk' )

mongoose.connect( 'mongodb://localhost/slpj' )
const db = mongoose.connection
db.on( 'error', console.error.bind( console, chalk.red( 'DB connection error' ) ) )
db.once( 'open', console.log.bind( console, chalk.cyan( 'DB connection successful' ) ) )

const passport = require( 'passport' )
passport.use( 'signup-strategy', require( './signup.str.js' ) )
passport.use( 'signin-strategy', require( './signin.str.js' ) )

const app = express()
app.use( passport.initialize() )
app.use( bodyParser.json() )
app.use( cors() )

app.use( function ( req, res, next ) {
	console.log( req.method, req.url, '\t' + getDate() )
	next()
} )

app.use( require( './routes/auth.route.js' ) )
app.use( require( './routes/user.route.js' ) )

const server = app.listen( 8001, function () {
	console.log( chalk.cyan( 'Listening on port:', server.address().port, getDate() ) )
} )

function getDate() {
	return moment().format( 'DD/MM/YY hh:mm:ss a');
}
