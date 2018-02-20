<template>
	<div id="Private">
		PRIVATE
		<pre>{{ user }}</pre>
		<form enctype="multipart/form-data" novalidate>
			<span>UPLOAP PHOTO</span>
			<input
				type="file" name="photo" accept="image/*"
				@change="onImageChosen( $event.target.name, $event.target.files )"
			>
		</form>
		<img v-for="( path, idx ) in imgPaths" :key="idx" :src="path" width="100px">
	</div>
</template>

<script>
import axios from 'axios'
const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3

export default {
	name: 'Private',
	data() {
		return {
			user: {},
			imgPaths: []
		}
	},
	mounted() {
		axios.get( 'http://localhost:8001/private', { requireAuth: true } )
		.then( res => {
			this.user = res.data
			this.loadUserImages()
		} )
		.catch( err => {
			console.log( err )
		} )
	},
	methods: {
		onImageChosen( fieldName, fileList ) {
			console.log( fileList )
			let formData = new FormData()
			formData.append( fieldName, fileList[ 0 ], fileList[ 0 ].name )
			axios.post( 'http://localhost:8001/upload/photo', formData, { requireAuth: true } )
				.then( res => console.log( res ) )
				.catch( err => console.log( err ) )
		},
		loadUserImages() {
			axios.get( `http://localhost:8001/user/${this.user._id}/images` )
				.then( res => {
					this.imgPaths = res.data.map( meta => meta.path )
				} )
				.catch( err => console.log( err ) )
		}
	}
}
</script>

<style lang="sass">
</style>
