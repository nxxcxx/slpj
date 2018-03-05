<template>
	<div id="Users">
		<div v-for="( user, idx ) in users" :key="idx">
			<router-link :to="`user/${user._id}`"> {{ user }} </router-link>
			<img v-for="( path, idx ) in getUserImagePaths( user._id )" :key="idx" :src="path" width="40px">
		</div>
	</div>
</template>

<script>
import axios from 'axios'

export default {

	name: 'Users',
	data() {
		return {
			users: [],
			userImagePaths: {}
		}
	},
	mounted() {
		axios.get( 'http://localhost:8001/users' )
			.then( res => {
				this.users = res.data
				this.loadUserImages( this.users )
			} )
			.catch( err => console.log( err ) )
	},
	methods: {
		getUserImagePaths( userId ) {
			console.log( this.userImagePaths[ userId ] )
			return this.userImagePaths[ userId ]
		},
		loadUserImages( users ) {
			for ( let user of users ) {
				axios.get( `http://localhost:8001/user/${user._id}/images` )
					.then( res => {
						let path = res.data.map( meta => meta.path.replace( '\\', '/' ) )
						this.$set( this.userImagePaths, user._id, path )
					} )
					.catch( err => console.log( err ) )
			}
		}
	},
}
</script>

<style lang="sass">
</style>
