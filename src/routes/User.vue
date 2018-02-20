<template>
	<div id="User">
		USER:<pre>{{ user }}</pre>
	</div>
</template>

<script>
import axios from 'axios'

export default {
	name: 'User',
	data() {
		return {
			user: {}
		}
	},
	beforeCreate() {
		axios.get( `http://localhost:8001/user/${this.$route.params.id}` )
			.then( res => {
				this.user = res.data
			} )
			.catch( err => {
				console.log( err )
			} )
	}
}
</script>

<style lang="sass">
</style>
