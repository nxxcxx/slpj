<template>
	<div id="Profile">
		<div class="container">
		<div class="row">

			<div class="row center-align">
				<h5>PROFILE</h5>
				<span>{{ user._id }}</span>
			</div>

			<div class="row center-align">
				<div class="col s12">
					<span>Profile status</span>
					<div class="switch">
						<label>
							off
							<input type="checkbox">
							<span class="lever"></span>
							on
						</label>
					</div>
				</div>
			</div>

			<br>

			<div class="row">

				<div class="input-field col s6">
					<i class="material-icons prefix">message</i>
					<input id="line" type="text" v-model="profile.line">
					<label for="line" :class="{ active: !!profile.line }" >LINE</label>
				</div>

				<div class="input-field col s6">
					<i class="material-icons prefix">wc</i>
					<select ref="select">
						<option value="" disabled selected>Choose</option>
						<option value="m">Male</option>
						<option value="f">Female</option>
					</select>
					<label>GENDER</label>
				</div>

				<div class="input-field col s6">
					<i class="material-icons prefix">event_seat</i>
					<input id="weight" type="text" v-model="profile.weight">
					<label for="weight" :class="{ active: !!profile.weight }">WEIGHT</label>
				</div>

				<div class="input-field col s6">
					<i class="material-icons prefix">accessibility</i>
					<input id="height" type="text" v-model="profile.height">
					<label for="height" :class="{ active: !!profile.height }">HEIGHT</label>
				</div>

				<div class="input-field col s6">
					<i class="material-icons prefix">event</i>
					<input id="age" type="text" v-model="profile.age">
					<label for="age" :class="{ active: !!profile.age }">AGE</label>
				</div>

				<div class="input-field col s6">
					<i class="material-icons prefix">attach_money</i>
					<input id="cost" type="text" v-model="profile.cost">
					<label for="cost" :class="{ active: !!profile.cost }">COST</label>
				</div>

				<div class="input-field col s12">
					<i class="material-icons prefix">comment</i>
					<textarea id="details" class="materialize-textarea" ref="detailsText"></textarea>
					<label for="details">Enter a details</label>
				</div>

			</div>

			<div class="row">
				<div class="col s12">
					<div id="map" ref="map"></div>
				</div>
				<div class="col s12">
					LAT: {{ marker.position.lat() }} LNG: {{ marker.position.lng() }}
				</div>
			</div>

			<div class="row">
				<div class="col s12">
				<h5>UPLOAD IMAGES</h5>
				<form enctype="multipart/form-data" novalidate>
					<div class="imageContainer">
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
			</div>

			<div class="row">
				<div class="col s12">
					<button v-on:click="save" type="submit" style="width: 100%;"
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
				line: '',
				weight: '',
				height: ''
			},
			uploads: [],
			uploadsPreview: [],
			uploadSlot: [],
			deletes: [],
			marker: new google.maps.Marker( { position: { lat: 0, lng: 0 } } )
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
		this.initMap()
		M.FormSelect.init( this.$refs.select, {} )
	},
	methods: {
		initMap() {
			let map = new google.maps.Map( this.$refs.map, {
				center: { lat: 13.779460, lng: 100.574174 },
				zoom: 11
			} )
			map.addListener( 'click', ( e ) => {
				this.marker.setMap( map )
				this.marker.position = e.latLng
			} )
		},
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
	#map
		height: 300px
	::-webkit-file-upload-button
		cursor: pointer
	.imageContainer
		max-width: 600px
		position: relative
		overflow: visible
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
		max-width: 180px
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
