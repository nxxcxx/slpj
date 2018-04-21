<template>
	<div id="navBar">
		<nav>
			<div class="nav-wrapper">
				<ul>
						<li><router-link to="/"><i class="material-icons">home</i></router-link></li>
						<li><router-link to="/users"><i class="material-icons">people</i></router-link></li>
						<!-- <li><router-link to="/forum"><i class="material-icons">forum</i></router-link></li> -->
						<li><router-link to="/profile" v-if="isAuthenticated" ><i class="material-icons">person</i></router-link></li>
						<li class="right"><router-link to="/signin" v-if="!isAuthenticated" ><i class="material-icons">account_circle</i></router-link></li>
						<li class="right"><router-link to="/signout" v-if="isAuthenticated" ><i class="material-icons">exit_to_app</i></router-link></li>
				</ul>
			</div>
		</nav>
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
	background: #e9e9e9
</style>
