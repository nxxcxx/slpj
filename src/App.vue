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
	list-style-type: none
	margin: 0px
	padding: 0px
li
	display: inline-block
	margin: 0 10px
a
	color: #002b6b
#app
	font-family: monospace
	background: #e6e6e6
</style>
