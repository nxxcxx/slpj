<template>
	<div id="Signin">
		SIGNIN
		<form>
			<input v-model="user.email" placeholder="Email">
			<input v-model="user.password" placeholder="Password" type="password">
			<button v-on:click="signin" type="submit">SIGN IN</button>
		</form>
		{{ errmsg }}
	</div>
</template>

<script>

import auth from '../auth.js'

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
			auth.signin( this.user )
				.then( () => {
					this.$router.push( '/profile' )
				} )
				.catch( () => {
					this.errmsg = 'login failed.'
				} )
		}
	}
}

</script>

<style lang="sass">
</style>
