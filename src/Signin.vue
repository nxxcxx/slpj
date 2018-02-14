<template>
  <div id="Signin">
		SIGNIN
		<form>
			<input v-model="user.email" placeholder="Email">
			<input v-model="user.password" placeholder="Password" type="password">
			<button v-on:click="signin" type="submit">SIGN IN</button>
		</form>
  </div>
</template>

<script>

let storage = window.localStorage

function setToken( token ) {
	storage.setItem( 'JWT', token )
}

function getToken() {
	return storage.getItem( 'JWT' )
}

function removeToken() {
	storage.removeItem( 'JWT' )
}

import axios from 'axios'

export default {
  name: 'Signin',
	data() {
		return {
			user: {
				email: '',
				password: ''
			},
			errmsg: ''
		}
	},
	methods: {
		signin() {
			axios.post( 'http://localhost:8001/signin', this.user )
			.then( res => {
				console.log( res )
				setToken( res.data.token )
				this.$router.push( '/' )
			} )
			.catch( err => {
				console.log( err )
				removeToken()
			} )
		}
	}
}

</script>

<style lang="sass">
</style>
