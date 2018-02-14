<template>
  <div id="Home">
    HOME
		<button v-on:click="auth">AUTH</button>
  </div>
</template>

<script>
import axios from 'axios'
import auth from './auth.js'

export default {
  name: 'Home',
	methods: {
		auth() {
			auth.authenticate()
				.then( res => {
				} )
				.catch( err => {
				} )
		}
	}
}
</script>

<style lang="sass">
</style>
