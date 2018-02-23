<template>
	<div id="Profile">
		<div class="container">

			<h5>PROFILE</h5>
			<pre>{{ user }}</pre>

			<div class="input-field col s12">
				<i class="material-icons prefix">message</i>
				<label for="text">LINE</label>
				<input type="text" v-model="profile.line">
			</div>

			<h5>UPLOAD IMAGES</h5>
			<div class="imageContainer">
				<form enctype="multipart/form-data" novalidate>
					<div class="dropbox z-depth-3" v-for="( n, idx ) in 2" :key="idx"
						:style="{ 'background-image': `url( ${getBgImgPath( idx )} )` }"
					>
						<input class="inputFile"
							type="file" name="img" accept="image/*"
							@change="onImageChosen( $event.target.name, $event.target.files, { idx } )"
						>

					</div>
				</form>
			</div>

			<div class="imageContainer">
				<form enctype="multipart/form-data" novalidate>
					<div class="dropbox z-depth-3" v-for="( n, idx ) in 2" :key="idx"
					>
						<input class="inputFile"
							type="file" name="img" accept="image/*"
							@change="onFileChange( $event, idx )"
						>
					</div>
				</form>
			</div>

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
			uploads: new Array( 2 )
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
			auth.deauthenticate()
			this.$router.push( '/signin' )
			console.log( err )
		} )
	},
	methods: {
		save() {
			let formData = new FormData()
			formData.append( 'line', this.profile.line )
			formData.append( 'img', this.uploads )
			axios.request( {
				url: 'http://localhost:8001/test',
				method: 'post',
				data: formData,
				requireAuth: true,
			} )
		},
		onFileChange( evt, idx ) {
			let files = evt.target.files
			if ( !files.length ) return
			this.uploads[ idx ] = files[ 0 ]
		},
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
					this.imgPaths = res.data.sort( ( a, b ) => a.idx - b.idx ).map( meta => meta.path )
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
	::-webkit-file-upload-button
		cursor: pointer
	.imageContainer
		border: 1px solid grey
		width: 100%
		height: 103px
		position: relative
	.dropbox
		background-position: center
		background-size: auto 100%
		background-repeat: no-repeat
		box-sizing: border-box
		height: 100px
		width: 80px
		position: relative
		float: left

	.inputFile
		opacity: 0.2
		cursor: pointer
		background: blue
		width: 100%
		height: 100%
		position: absolute
</style>
