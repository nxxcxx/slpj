var bcrypt = require( 'bcrypt-nodejs' )
var mongoose = require( 'mongoose' )
var Schema = mongoose.Schema

var userSchema = new Schema( {
	email: { type: String, required: true },
	password: { type: String, required: true },
	line: { type: String },
	comments: [ { type: Schema.Types.ObjectId, ref: 'comment' } ],
	images: [ { type: Schema.Types.ObjectId, ref: 'image' } ],
	gender: { type: String },
	weight: { type: Number },
	height: { type: Number },
	age: { type: Number },
	cost: { type: Number },
	details: { type: String },
	active: { type: Boolean, default: false },
	location: { type: Schema.Types.Mixed, default: { lat: 0, lng: 0 } }
} )

userSchema.pre( 'save', function ( next ) {
	var user = this
	if ( !user.isModified( 'password' ) ) return next()
	bcrypt.hash( user.password, null, null, function ( err, hash ) {
		if ( err ) return next( err )
		user.password = hash
		next()
	} )
} )

userSchema.methods.comparePassword = function ( password, callback ) {
	bcrypt.compare( password, this.password, callback )
}

userSchema.methods.toJSON = function () {
	var user = this.toObject()
	delete user.password
	return user
}

module.exports = mongoose.model( 'user', userSchema, 'users' )
