<template>
	<div id="Profile">
		<h3>PROFILE</h3>
		<pre>{{ user }}</pre>
		<h3>UPLOAP IMAGES</h3>
		<div class="imageContainer">
			<form enctype="multipart/form-data" novalidate>
				<div class="dropbox" v-for="( n, idx ) in 2" :key="idx"
					:style="{ 'background-image': `url( ${getBgImgPath( idx )} )` }"
				>
					<input class="inputFile"
						type="file" name="img" accept="image/*"
						@change="onImageChosen( $event.target.name, $event.target.files, { idx } )"
					>
				</div>
			</form>
		</div>

		<img v-for="( path, idx ) in imgPaths" :key="idx" :src="path" height="100px">
	</div>
</template>

<script>
import axios from 'axios'

export default {
	name: 'Profile',
	data() {
		return {
			user: {},
			imgPaths: []
		}
	},
	computed: {},
	mounted() {
		axios.get( 'http://localhost:8001/profile', { requireAuth: true } )
		.then( res => {
			this.user = res.data
			this.loadUserImages()
		} )
		.catch( err => {
			console.log( err )
		} )
	},
	methods: {
		onImageChosen( fieldName, fileList, meta ) {
			let formData = new FormData()
			formData.append( fieldName, fileList[ 0 ], fileList[ 0 ].name )
			axios.request( {
				url: 'http://localhost:8001/upload/image',
				method: 'post',
				data: formData,
				requireAuth: true,
				params: { idx: meta.idx }
			} ).then( res => {
				// todo endLoadinAnimation
				this.loadUserImages()
			} ).catch( err => console.log( err ) )
		},
		loadUserImages() {
			axios.get( `http://localhost:8001/user/${this.user._id}/images` )
				.then( res => {
					this.imgPaths = res.data.map( meta => meta.path )
				} )
				.catch( err => console.log( err ) )
		},
		getBgImgPath( idx ) {
			if ( this.imgPaths[ idx ] )
				return this.imgPaths[ idx ].replace( '\\', '/' )
			return ''
		}
	}
}
</script>

<style lang="sass">
	.imageContainer
		background: #b9b9b9
		width: 200px
		height: 100px
		position: relative
		padding: 10px
	::-webkit-file-upload-button
		cursor: pointer
	.dropbox
		background-size: contain
		background-repeat: no-repeat
		box-sizing: border-box
		outline: 2px dashed black
		height: 100px
		width: 80px
		position: relative
		float: left

	.inputFile
		opacity: 0
		cursor: pointer
		background: blue
		width: 100%
		height: 100%
		position: absolute
</style>
