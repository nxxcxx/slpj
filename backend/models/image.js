let mongoose = require( 'mongoose' )
let Schema = mongoose.Schema

let imageSchema = new Schema( {
	userId: { type: String, require: true },
	path: { type: String, require: true, trim: true },
	originalName: { type: String, require: true },
	idx: { type: Number, require: true }
} )

module.exports = mongoose.model( 'image', imageSchema, 'images' )
