<template>
	<div id="Profile">
		<div class="container">

			<h5>PROFILE</h5>
			<pre>{{ user }}</pre>

			<div class="input-field col s12">
				<i class="material-icons prefix">message</i>
				<label for="text" :class="{ active: !!profile.line }" >LINE</label>
				<input type="text" v-model="profile.line">
			</div>

			<h5>UPLOAD IMAGES</h5>


			<form enctype="multipart/form-data" novalidate>
				<div class="imageContainer z-depth-1">
					<div class="dropbox z-depth-1" v-for="( n, idx ) in 6" :key="idx"
						:style="{ 'background-image': `url( ${getBgImgPath( idx )} )` }"
					>
						<input class="inputFile"
							type="file" name="img" accept="image/*"
							@change="onFileChange( $event, idx )"
						>
					</div>
				</div>
			</form>


			<div class="section center-align">
				<button v-on:click="save" type="submit"
					class="btn waves-effect waves-light">
					SAVE
				</button>
			</div>

		</div>
	</div>
</template>

<script>
import axios from 'axios'
import auth from '../auth.js'

export default {
	name: 'Profile',
	data() {
		return {
			user: {},
			imgPaths: [],
			profile: {
				line: ''
			},
			uploads: new Array( 2 ),
			uploadsPreview: new Array( 2 ),
			uploadSlot: []
		}
	},
	computed: {},
	mounted() {
		axios.get( 'http://localhost:8001/profile', { requireAuth: true } )
		.then( res => {
			this.user = res.data
			this.loadUserProfile()
			this.loadUserImages()
		} )
		.catch( err => {
			auth.deauthenticate()
			this.$router.push( '/signin' )
			console.error( err )
		} )
	},
	methods: {
		save() {
			let formData = new FormData()
			formData.append( 'line', this.profile.line )
			formData.append( 'uploadSlot', JSON.stringify( this.uploadSlot ) )
			for ( let [ idx, file ] of this.uploads.entries() ) {
				formData.append( 'img', file )
			}
			axios.request( {
				url: 'http://localhost:8001/save',
				method: 'post',
				data: formData,
				requireAuth: true,
			} ).then( res => {
				console.log( res )
			} ).catch( err => {
				console.error( err )
			} )
		},
		onFileChange( evt, idx ) {
			let file = evt.target.files[ 0 ]
			if ( !file ) return
			this.$set( this.uploads, idx, file )
			this.createPreviewImage( file, idx )
			this.uploadSlot[ idx ] = file.name
		},
		createPreviewImage( file, idx ) {
			let img = new Image()
			let reader = new FileReader()
			reader.onload = ( e ) => {
				this.$set( this.uploadsPreview, idx, e.target.result )
			}
			reader.readAsDataURL( file )
		},
		getBgImgPath( idx ) {
			return this.uploadsPreview[ idx ] ? this.uploadsPreview[ idx ] : this.imgPaths[ idx ]
		},
		loadUserImages() {
			axios.get( `http://localhost:8001/user/${this.user._id}/images` )
				.then( res => {
					for ( let uri of res.data ) {
						this.$set( this.imgPaths, uri.idx, uri.path.replace( '\\', '/' ) )
					}
				} )
				.catch( err => console.log( err ) )
		},
		loadUserProfile() {
			if ( this.user.line )
				this.profile.line = this.user.line
		},
		updated() {
		}
	}
}
</script>

<style lang="sass">
	::-webkit-file-upload-button
		cursor: pointer
	.imageContainer
		position: relative
		overflow: hidden
		display: flex
		justify-content: center
		height: 120px
	.dropbox
		background-position: center
		background-size: auto 100%
		background-repeat: no-repeat
		box-sizing: border-box
		flex-basis: 100%
		position: relative
	.inputFile
		opacity: 0
		cursor: pointer
		background: blue
		width: 100%
		height: 100%
		position: absolute
</style>
