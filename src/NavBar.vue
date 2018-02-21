<template>
	<div id="navBar">
		<ul>
			<li>
				<router-link to="/">HOME</router-link>
				<router-link to="/users">USERS</router-link>
				<router-link to="/signin" v-if="!isAuthenticated" >SINGIN</router-link>
				<router-link to="/profile" v-if="isAuthenticated" >PROFILE</router-link>
				<router-link to="/signout" v-if="isAuthenticated" >SIGNOUT</router-link>
			</li>
		</ul>
	</div>
</template>

<script>
import auth from './auth'

export default {
	name: 'NavBar',
	computed: {
		isAuthenticated: function () {
			return auth.isAuthenticated()
		}
	}
}
</script>

<style lang="sass">
#navBar
	background: #c9c9c9
</style>
