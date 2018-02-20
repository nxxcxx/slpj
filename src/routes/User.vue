<template>
	<div id="User">
		USER:<pre>{{ user }}</pre>
		<img v-for="( path, idx ) in imgPaths" :key="idx" :src="path" width="100px">
	</div>
</template>

<script>
import axios from 'axios'

export default {
	name: 'User',
	data() {
		return {
			user: {},
			imgPaths: []
		}
	},
	mounted() {
		axios.get( `http://localhost:8001/user/${this.$route.params.id}` )
			.then( res => {
				this.user = res.data
				this.loadUserImages()
			} )
			.catch( err => {
				console.log( err )
			} )
	},
	methods: {
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
