<template>
	<div id="Register" class="container">

			<form>

				<div class="row">

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
