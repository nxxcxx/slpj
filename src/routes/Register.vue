<template>
	<div id="Register" class="container">

			<form>
				<br>
				<div class="row">

					<div class="input-field col s12">
						<i class="material-icons prefix">person</i>
						<input id="email" v-model="user.email" type="text">
						<label for="email">Email</label>
					</div>

					<div class="input-field col s12">
						<i class="material-icons prefix">lock</i>
						<input id="password" v-model="user.password" type="password">
						<label for ="password">Password</label>
					</div>

				</div>


				<div class="row">
					<div class="center-align col s12">
						<div id="recaptcha" class="g-recaptcha" data-sitekey="6Ld-EEsUAAAAAJZCj5FTiy6mJZiP9zYdCTKuCMls"></div>
					</div>
				</div>

				<div class="row">
					<div class="center-align col s12">
						<button v-on:click="register" type="submit"
							class="btn waves-effect waves-light">
							REGISTER
						</button>
					</div>
				</div>

			</form>

	</div>
</template>

<script>
import axios from 'axios'

export default {
	name: 'Register',
	data() {
		return {
			user: {
				email: '',
				password: ''
			}
		}
	},
	methods: {
		register() {
			axios.post( 'http://localhost:8001/signup', this.user )
			.then( res => {
				console.log( res )
				this.$router.push( '/signin' )
			} )
			.catch( err => console.error( err.response ) )
		}
	},
	mounted() {
		let recaptchaElem = document.getElementById( 'recaptcha-loader' )
		if ( recaptchaElem === null ) {
			let recaptchaApi = document.createElement( 'script' )
			recaptchaApi.setAttribute( 'id', 'recaptcha-loader' )
			recaptchaApi.setAttribute( 'src', 'https://www.google.com/recaptcha/api.js' )
			document.head.appendChild( recaptchaApi )
		} else {
			grecaptcha.render( 'recaptcha', {
				sitekey: '6Ld-EEsUAAAAAJZCj5FTiy6mJZiP9zYdCTKuCMls'
			} )
		}
	}
}
</script>

<style lang="sass">
</style>
