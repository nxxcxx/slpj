<template>
	<div id="app">
		<NavBar></NavBar>
		<router-view></router-view>
	</div>
</template>

<script>
import NavBar from './NavBar.vue'
import auth from './auth.js'

export default {
	name: 'app',
	components: {
		NavBar
	},
	beforeCreate() {
		auth.authenticate( true )
	}
}
</script>

<style lang="sass">
body
	margin: 0px
ul
	margin: 0px
	padding: 0px
li
	margin: 0px

#app
	font-family: monospace
	background: #f9f9f9
</style>
