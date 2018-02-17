<template>
	<div id="Users">
		<pre>{{ users }}</pre>
	</div>
</template>

<script>
import axios from 'axios'

export default {

	name: 'Users',
	data() {
		return {
			users: []
		}
	},
	mounted() {
		axios.get( 'http://localhost:8001/users' )
			.then( res => {
				this.users = res.data
			} )
			.catch( err => {
				console.log( err )
			} )
	}

}
</script>

<style lang="sass">
</style>
