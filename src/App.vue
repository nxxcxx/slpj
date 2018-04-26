<template>
	<div id="app">
		<NavBar></NavBar>
		<router-view></router-view>
		<Footer></Footer>
	</div>
</template>

<script>
import NavBar from './NavBar.vue'
import Footer from './Footer.vue'
import auth from './auth.js'

export default {
	name: 'app',
	components: {
		NavBar,
		Footer
	},
	beforeCreate() {
		auth.authenticate( true )
	}
}
</script>

<style lang="sass">
body
	background: #fafafa
	margin: 0px
ul
	margin: 0px
	padding: 0px
li
	margin: 0px

#app
	font-family: monospace
</style>
