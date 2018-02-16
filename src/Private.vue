<template>
  <div id="Private">
    PRIVATE
		<pre>{{ profile }}</pre>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Private',
  data() {
    return {
			profile: {}
    }
  },
	mounted() {
		axios.get( 'http://localhost:8001/profile', { requireAuth: true } )
		.then( res => {
			this.profile = res.data
		} )
		.catch( err => {
			console.log( err )
		} )
	}
}
</script>

<style lang="sass">
</style>
