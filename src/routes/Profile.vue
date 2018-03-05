<template>
	<div id="Profile">
		<div class="container">
		<div class="row">
			<h5>PROFILE</h5>
			<pre>{{ user }}</pre>

			<div class="input-field col s6">
				<i class="material-icons prefix">message</i>
				<label for="text" :class="{ active: !!profile.line }" >LINE</label>
				<input type="text" v-model="profile.line">
			</div>

			<div class="col s12">
			<h5>UPLOAD IMAGES</h5>
			<form enctype="multipart/form-data" novalidate>
				<div class="imageContainer z-depth-1">
					<div class="dropbox z-depth-1" v-for="( n, idx ) in 6" :key="idx"
						:style="{ 'background-image': `url( ${getBgImgPath( idx )} )` }"
						@mouseover="onMouseOver( $event )" @mouseleave="onMouseLeave( $event )"
					>

						<i class="material-icons trashicon"
							v-show="!!getBgImgPath( idx )"
							@click="markImgForDeletion( idx )"
						>close</i>

						<input class="inputFile"
							type="file" name="img" accept="image/*"
							@change="onFileChange( $event, idx )"
						>

					</div>
				</div>
			</form>
			</div>

			<div class="col s12">
				<div class="section center-align">
					<button v-on:click="save" type="submit"
						class="btn waves-effect waves-light">
						SAVE
					</button>
				</div>
			</div>

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
			uploads: [],
			uploadsPreview: [],
			uploadSlot: [],
			deletes: []
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
			formData.append( 'deletes', JSON.stringify( this.deletes ) )
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
			let duplicated = this.uploads.find( f => f ? f.name === file.name : false )
			if ( duplicated ) return
			this.$set( this.uploads, idx, file )
			this.createPreviewImage( file, idx )
			this.uploadSlot[ idx ] = file.name
			this.deletes[ idx ] = false
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
		onMouseOver( evt ) {
			evt.target.parentElement.classList.add( 'z-depth-5' )
			evt.target.parentElement.classList.add( 'onhover' )
		},
		onMouseLeave( evt ) {
			evt.target.classList.remove( 'z-depth-5' )
			evt.target.classList.remove( 'onhover' )
		},
		markImgForDeletion( idx ) {
			if ( this.uploadsPreview[ idx ] ) {
				this.$set( this.uploadsPreview, idx, null )
			}
			this.$set( this.uploads, idx, null )
			this.$set( this.imgPaths, idx, null )
			this.uploadSlot[ idx ] = null
			this.deletes[ idx ] = true
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
		flex-wrap: wrap
	.dropbox
		background-position: center
		background-size: auto 100%
		background-repeat: no-repeat
		box-sizing: border-box
		height: 180px
		min-width: 80px
		max-width: 200px
		width: calc( 100% * ( 1/3 ) - 10px - 1px )
		position: relative
		flex-grow: 1
	.inputFile
		opacity: 0
		cursor: pointer
		background: blue
		width: 100%
		height: 100%
		position: absolute
	.onhover
		z-index: 10
	.trashicon
		position: absolute
		right: 0px
		cursor: pointer
		user-select: none
		z-index: 100
</style>
