<template>
	<div id="navBar">
		<ul>
			<li>
				<router-link to="/">HOME</router-link>
				<router-link to="/users">USERS</router-link>
				<router-link to="/signin">SINGIN</router-link>
				<router-link to="/private">PRIVATE</router-link>
				<router-link to="/signout">SIGNOUT</router-link>
			</li>
		</ul>
	</div>
</template>

<script>
import auth from './auth'

export default {
	name: 'NavBar',
	methods: {
	}
}
</script>

<style lang="sass">
#navBar
	background: #c9c9c9
</style>
