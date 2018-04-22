<template>
	<div id="Signin" class="container">

		<div class="section">
			<br>
			<div class="row">
				<form>
					<div class="input-field col s12">
						<i class="material-icons prefix">person</i>
						<input id="email" v-model="user.email" type="text">
						<label for="email">Email</label>
					</div>
					<div class="input-field col s12">
						<i class="material-icons prefix">lock</i>
						<input id="password" v-model="user.password" type="password">
						<label for="password">Password</label>
					</div>
					<div class="center-align">
						<button v-on:click="signin" type="submit"
							class="btn waves-effect waves-light">
							SIGNIN
						</button>
						<router-link to="/register">
							<button class="btn waves-effect waves-light deep-orange">
								REGISTER
							</button>
						</router-link>
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
