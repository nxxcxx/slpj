<template>
	<div id="Signin" class="container">

		<div class="section">

			<div class="row">
				<form>
					<div class="input-field col s12">
						<i class="material-icons prefix">person</i>
						<label for="email">Email</label>
						<input v-model="user.email" type="text">
					</div>
					<div class="input-field col s12">
						<i class="material-icons prefix">lock</i>
						<label for ="password">Password</label>
						<input v-model="user.password" type="password">
					</div>
					<div class="center-align">
						<button v-on:click="signin" type="submit"
							class="btn waves-effect waves-light">
							SIGNIN
						</button>
					</div>
				</form>
				{{ errmsg }}
			</div>

		</div>

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
