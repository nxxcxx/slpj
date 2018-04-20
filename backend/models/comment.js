let mongoose = require( 'mongoose' )
let Schema = mongoose.Schema

let commentSchema = new Schema( {
	byUserId: { type: Schema.Types.ObjectId, ref: 'User' },
	text: { type: String, require: true },
	time: { type: Date, default: Date.now }
} )

module.exports = mongoose.model( 'comment', commentSchema, 'comments' )
