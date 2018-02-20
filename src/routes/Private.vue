<template>
	<div id="Private">
		PRIVATE
		<pre>{{ user }}</pre>
		<form enctype="multipart/form-data" novalidate>
			<span>UPLOAP IMAGES</span>
			<div class="dropbox">
				<input class="inputFile"
					type="file" name="photo" accept="image/*"
					@change="onImageChosen( $event.target.name, $event.target.files )"
				>
			</div>
		</form>
		<img v-for="( path, idx ) in imgPaths" :key="idx" :src="path" width="100px">
	</div>
</template>

<script>
import axios from 'axios'

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
			// todo startLoadingAnimation
			axios.post( 'http://localhost:8001/upload/photo', formData, { requireAuth: true } )
				.then( res => {
					// todo endLoadinAnimation
					this.loadUserImages()
				} )
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
	.dropbox
		outline: 2px dashed grey
		color: red
		height: 160px
		width: 100px
		position: relative
	.inputFile
		opacity: 0.5
		cursor: pointer
		background: blue
		width: 100%
		height: 100%
		position: absolute
</style>
